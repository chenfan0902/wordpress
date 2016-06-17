var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var db = require('../../connectFactory').getConnection('soapDb');
var query = require('../../dbQuery');
var detailCfg = require('../../plugin_config/'+sysConfig.province+'/other/redisStateConfig').detailConfig;
var listCfg = require('../../plugin_config/'+sysConfig.province+'/other/redisStateConfig').detailList;
var async = require('async');
var extend = require('extend');
var logger = require('../../log').logger;
var auth = require('../../auth');
var formatDate = require('../../util').formatDate;
var exec = require('child_process').exec;
var sanitize = require('validator').sanitize;
var commander = require('../../commander');
var redis = require("redis");
var redisCfg = sysConfig.redis;

module.exports = function (app) {

    app.get('/other/redisState.html', function(req, res) {
        var chartList = req.query.chartList;
        var value = req.query.date||'';
        var list = listCfg[chartList];

        var now = new Date().getTime();
        value = formatDate(now,'yyyy-MM-dd');

        logger.debug("value=%s",value);
        var headTile = detailCfg[list[0].mode+list[0].type+list[0].subtype].name;
        var displayLength = detailCfg[list[0].mode+list[0].type+list[0].subtype].displayLength;
        var scope = detailCfg[list[0].mode+list[0].type+list[0].subtype].scopes[0];
        var queryUrl = "/other/redisStateData?mode="+list[0].mode+"&type="+list[0].type+"&scope="+scope+"&subtype="+list[0].subtype+"&date="+value;
        logger.debug("queryUrl------------=%s",queryUrl);

        res.renderPjax('plugin/other/redisState',{
            titles: detailCfg[list[0].mode+list[0].type+list[0].subtype].titles,
            queryUrl:queryUrl,
            headTile:headTile,
            displayLength:displayLength,
            layout: false
        });
    });

    app.get('/other/redisStateData', function(req, res,next) {
        var mode = req.query.mode
            , type = req.query.type
            , scope = req.query.scope
            , value = req.query.date
            , subtype = req.query.subtype || ''
            , iDisplayStart = req.query.iDisplayStart
            , iDisplayLength = req.query.iDisplayLength
            , sSearch = req.query.sSearch

        var sortIdx = req.query.iSortCol_0 || '-1';
        var sortDir = req.query.sSortDir_0 || '';


        //var value = '2015-10-14';

        if (!iDisplayStart) iDisplayStart = 0;

        var now = new Date().getTime();

        var table = query.getTable(mode, type, scope, '','soapDb','multiQueryResult');

        type += subtype;


        logger.debug("value------------=%s", value);
        logger.debug("mode------------=%s", mode);
        logger.debug("type------------=%s", type);
        logger.debug("subtype------------=%s", subtype);
        logger.debug("sSearch=%s", sSearch);
        if (!detailCfg[mode + type]) {
            return next(new Error('not found'));
        }

        var tempConfig = {};
        extend(true, tempConfig, detailCfg[mode + type]);

        var filter = {};
        if (tempConfig.filter) {
            filter = tempConfig.filter;
        }

        tempConfig.filterColNames.forEach(function (col) {
            if (col === "timestamp") {
                filter[col] = {$gte: now - tempConfig.delayTime, $lte: now + 1000};
            }
        });

        if (sSearch && sSearch !== "") {
            (filter.$or === undefined) &&  (filter.$or = []);
            var regexp = /0*\.*\d+\.*d*\M/;
            var regexp1 =  /[\$\/\{\}]/;
            if(regexp.test(sSearch)){
                var obj ={}
                obj.used_memory = {$gte: sSearch};
                filter.$or.push(obj);
            }else if(regexp1.test(sSearch)){
                delete filter.$or;
                try {
                    filter = JSON.parse(sSearch);
                } catch (e) {
                    logger.error("sSearch JSON.parse err=%s", e.message);
                }
            }else {
                tempConfig.filterColNames.forEach(function (col) {
                    if (col !== "timestamp") {
                        var obj = {};
                        try {
                            if (col === 'state') {
                                if (sSearch === '正常') {
                                    obj[col] = '0';
                                } else if (sSearch === '停止') {
                                    obj[col] = '1';
                                }
                            }else {
                                obj[col] = new RegExp(sSearch);
                            }
                        } catch (e) {
                            logger.debug("err=%s", e.message);
                            var sSearchTemp = /\sSearch/;
                            obj[col] = sSearchTemp;
                        }
                        if (JSON.stringify(obj) !== '{}') {
                            filter.$or.push(obj);
                        }
                    }
                });
            }

        }
        if(sortIdx !=='-1' && sortDir !==''){
            var sortTag = (sortDir=='asc'?1:-1);
            if(tempConfig.sortCol[sortIdx] !== undefined){
                var sort ={};
                sort[tempConfig.sortCol[sortIdx]] = sortTag;
                tempConfig.sort = sort;
            }
        }
        tempConfig.filter = filter;
        logger.debug("tempConfig=%s", JSON.stringify(tempConfig));

        var tempConfig1 = {};
        extend(true, tempConfig1, tempConfig);

        tempConfig.limit = iDisplayLength;
        tempConfig.skip = iDisplayStart;

        var render = function (count, docs,docs1) {
            var output = {};
            var temp = [];
            output.sEcho = parseInt(req.query.sEcho);
            output.iTotalRecords = count;
            output.iTotalDisplayRecords = count;
            output.aaData = [];

            var allCnt = 0;


            docs1.forEach(function (item, idx) {
                var item1 ={};
                if(item._doc !== undefined){
                    item1 = item._doc
                }else{
                    item1 = JSON.parse(JSON.stringify(item));
                }
                if (item1.keyspace_hits !=='-'){
                    try {
                        allCnt = allCnt + parseInt(item1.keyspace_hits);
                    }catch(e){
                        logger.error(e.message);
                    }
                }
            });

            var allHits = allCnt;

            docs.forEach(function (item, idx) {
                var item1 ={};
                if(item._doc !== undefined){
                    item1 = item._doc
                }else{
                    item1 = JSON.parse(JSON.stringify(item));
                }

                tempConfig.colNames.forEach(function (col) {
                    if (col === '#') {
                        temp.push(parseInt(iDisplayStart) + 1 + idx);
                    } else {
                        var colValue;
                        if (item1[col] !== undefined) {
                            colValue = item1[col];
                        }else {
                            colValue = '-';
                        }
                        if(col ==='state'){
                            if(new Date().getTime() - new Date(item1.time).getTime() > 300000){
                                colValue = '<font color="red">pangu-monitor状态异常</font>';
                            }else {
                                colValue = (colValue === '0') ? '正常' : '<font color="red">停止</font>';
                            }
                        }
                        if (col === 'allHits'){
                            colValue = allHits;
                        }
                        temp.push(colValue);
                    }
                });
                output.aaData.push(temp);
                temp = [];
            });
            var response = JSON.stringify(output);

            res.send(response);
        };
        async.parallel({
            count: function (cb) {
                table.getCount(tempConfig, function (cnt) {
                    cb(null, cnt);
                });
            },
            docs: function (cb) {
                table.list(tempConfig, cb);
            },
            docs1: function (cb) {
                table.list(tempConfig1, cb);
            }
        }, function (err, results) {
            if (err) {
                logger.error(err);
            }
            logger.debug("redisState==docs------------=%s", JSON.stringify(results.docs));
            render(results.count, results.docs,results.docs1);
        });
    });


    app.get('/other/redisSendCmd', function (req, res) {
        var port = req.query.port || 7812;
        var cmdContent = sanitize(req.query.cmdContent).trim();
        var type = req.query.type;
        cmdContent = sanitize(cmdContent).xss();
        var cmdArr = cmdContent.split("`");
        var execObj = {};

        var now = new Date().getTime();
        value = formatDate(now,'yyyy-MM-dd');
        var tableName = 'RedisStateONE';

        logger.debug('cmdContent=%s', cmdContent);
        logger.debug('type=%s', type);

        var execCmdFun = function (type,cmdLine,redisHost,data) {
            return function (callback) {
                if(!req.session.user){
                    return callback(null,'redis服务操作需先登录风来平台！');
                }
                commander.getCommander(req.session.user.user_name, redisHost, data, function (err, cmdStr) {
                    if (err) {
                        logger.error('==== RedisCmd error ====', err);
                        return callback(null, err);
                    }
                    if (type === '2') {
                        var client = redis.createClient(redisHost.split(':')[1], redisHost.split(':')[0]);
                        client.on_error = function (msg) {
                            client.end();
                            //callback(null,'清除缓存：' + msg);
                        };
                        client.flushdb(function (err, res) {
                            if (err) {
                                logger.error('==== err ====', err);
                            }
                            db.collection(tableName).update({host:redisHost},{$set: {db0: '-'}},function (err, result) {
                                //callback(null, '清除成功！');
                            });
                            callback(null, '清除成功！');

                        });
                    } else if (type === '1') {
                        var client = redis.createClient(redisHost.split(':')[1], redisHost.split(':')[0]);
                        client.on_error = function (msg) {
                            client.end();
                            db.collection(tableName).update({host:redisHost},{$set: {state: type}},function (err, result) {
                                callback(null, '停止成功！');
                            });
                        };
                        client.shutdown(function (err, res) {
                            if (err) {
                                logger.error('==== err ====', err);
                            }
                            //return callback(null, '停止成功！');

                        });
                    } else {
                        cmdStr = cmdStr.replace(/\\/g,"");
                        logger.debug('cmdStr=%s', cmdStr);
                        exec(cmdStr, {timeout: 8000}, function (err, stdout, stderr) {
                            if (err) {
                                logger.error(err, stderr);
                                callback(null,'启动服务：' + err);
                            } else {
                                db.collection(tableName).update({host:redisHost},{$set: {state: type}},function (err, result) {
                                    callback(null, '启动成功！');
                                })
                            }
                        });
                    }
                });
            }
        };

        for (var i=0;i<cmdArr.length ;i++ ) {
            if(cmdArr[i] === ''){
                continue;
            }
            var hostUrl = cmdArr[i].split('|')[0];
            var host = hostUrl.split(':')[0];
            var cmdLine = cmdArr[i].split('|')[1];
            var shell = sanitize(sanitize(req.query.shell || './script/startRedis.sh').trim()).xss();
            var cmdid = sanitize(sanitize(req.query.cmdid || '3c4a6a8bb16f3d810b880d38e1ce0d1a').trim()).xss();
            var cmdtype = sanitize(sanitize(req.query.cmdtype || 'startRedisCmd').trim()).xss();
            var data = {
                port: port,
                host: host,
                shell: shell,
                cmdId: cmdid,
                cmdType: cmdtype,
                cmdLine:cmdLine
            };
            execObj[hostUrl] = execCmdFun(type,cmdLine,hostUrl,data);
        }

        async.parallel(execObj,function(err, results) {
            if (err) {
                logger.error(err);
                res.send(err);

            }else{
                res.send(results);
            }
        });
    });




    app.get('/other/redisStateGraph', function (req, res) {

        var type = req.query.type;
        var host = req.query.host;
        var now = new Date().getTime();
        var dbn = req.query.dbn || 'db0';
        value = formatDate(now,'yyyy-MM-dd');
        var table = query.getTable('Redis', 'StateBase', 'suffix', value,'soapDb','multiQueryResult');

        var filterConfig = {sort: {'timestamp':1},colNames:['timestamp','used_memory',dbn,'keyspace_hits','instantaneous_ops_per_sec']};
        var filter = {};
        filter.host = host;
        filterConfig.filter = filter;
        logger.debug("filterConfig=%s", JSON.stringify(filterConfig));

        table.list(filterConfig, function(err,docs){
            logger.debug("docs=%s", JSON.stringify(docs));
            var result = [];
            docs.forEach(function (item) {
                var item1 = {};
                if (item._doc !== undefined) {
                    item1 = item._doc
                } else {
                    item1 = JSON.parse(JSON.stringify(item));
                }
                //item1.used_memory = item1.used_memory.replace(/M/g,'');
                var regexp = /keys=(\d+)/;
                if(regexp.test(item1[dbn])){
                    item1.db = RegExp.$1;
                }
                result.push(item1);
            });
            logger.debug("result=%s", JSON.stringify(result));
            res.send(result);
        });

    });


    app.get('/other/modifyRedisHostInfo', function (req, res) {
        var hostIp = req.query.hostIp;
        var hostInfo = req.query.hostInfo;
        var tag = req.query.tag;
        var monitorType = req.query.monitorType;
        var now = new Date().getTime();
        var tableName = 'RedisStateONE';
        logger.debug("tag++++++++++=%s", tag);
        if(tag === '3') {
            db.collection(tableName).update({"host": hostIp}, {$set: {host_name: hostInfo,monitorType:monitorType}}, function (err, result) {
                if (err) {
                    res.send(result);
                    return;
                }
                res.send("修改成功！");
            });
        }else if (tag ==='1'){
            db.collection(tableName).insert( {host:hostIp,host_name: hostInfo,monitorType:monitorType,keyspace_hits:0,time:formatDate(now,'yyyy-MM-dd HH:mm:ss.ms')}, function (err, result) {
                if (err) {
                    res.send(result);
                    return;
                }
                res.send("添加成功！");
            });
        }else{
            db.collection(tableName).remove({"host": hostIp}, function (err, result) {
                if (err) {
                    res.send(result);
                    return;
                }
                res.send("删除成功！");
            });
        }
    });

}