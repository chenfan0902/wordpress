var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../../config/config')[env];
var debug = require('debug')('pangu:top');
var util = require("util");
var query = require('../../../../dbQuery');
var config = require('../../../../plugin_config/'+sysConfig.province+'/common/detail/query/config_historyDetail').config;
var lpConfig = require('../../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/point/config_lcupoint').lcupoint;
var chart_list = require('../../../../plugin_config/'+sysConfig.province+'/common/detail/query/config_historyDetail').list;
var hostsList = require('../../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').queue.hosts;
var async = require('async');
var extend = require('extend');
var env = process.env.NODE_ENV || 'development';
var redisCfg = require('../../../../../../config/config')[env].redisCluster;
var redis = require('ioredis');
var client = redis.createClient(redisCfg.nodes, {password: redisCfg.password});
var auth = require('../../../../auth');
var logger = require('../../../../log').logger;
var exec = require('child_process').exec;
var db = require('../../../../connectFactory').getConnection('tuxedoDb');
var sanitize = require('validator').sanitize;
var commander = require('../../../../commander');
var http = require('http');
var mutil = require('../../../../util');


function getMapReduceData(req,res,value,mode,type,subtype,scope,sSearch){
    var dt = new Date(value);
    var YY = ("00"+dt.getFullYear()%100).substr(-2);
    var MM = ("00"+(dt.getMonth() + 1)).substr(-2);
    var DD = ("00"+dt.getDate()).substr(-2);
    var HH = ("00"+dt.getHours()).substr(-2);
    if (scope=="hours") value= YY+MM+DD+HH;
    if(scope=="day") value = YY+MM+DD;
    if(scope=="month") value = YY+MM;
    if (scope=="year") value = YY;

    var collection1 = mode + type + scope.toUpperCase() + value;

    var map = function() {
        var key = this.host+"->"+this.TRANSCODE;
        var value = {
            TRANSCODE:'',
            calledsum:0,
            avg_gt_10s:0,
            avg_gt_5s:0,
            avg_gt_2s:0,
            avg_gt_2s_rate:0,
            count:0,
            max_gt_10s:0,
            max_gt_5s:0,
            max_gt_2s:0,
            max_gt_2s_rate:0,
            host:''
        };
        if(this.SVRNAME == 'avgcount')
            value.calledsum = this._count||0;
        else if(this.SVRNAME == 'avg_gt_10s')
            value.avg_gt_10s = this._count||0;
        else if(this.SVRNAME == 'avg_gt_5s')
            value.avg_gt_5s = this._count||0;
        else if(this.SVRNAME == 'avg_gt_2s')
            value.avg_gt_2s = this._count||0;
        else if(this.SVRNAME == 'maxcount')
            value.count = this._count||0;
        else if(this.SVRNAME == 'max_gt_10s')
            value.max_gt_10s = this._count||0;
        else if(this.SVRNAME == 'max_gt_5s')
            value.max_gt_5s = this._count||0;
        else if(this.SVRNAME == 'max_gt_2s')
            value.max_gt_2s = this._count||0;

        value.TRANSCODE =this.TRANSCODE;
        value.host =this.host;

        emit( key, value);
    };

    var reduce = function(k,values) {
        var reducedObject = {
            TRANSCODE:'',
            calledsum:0,
            avg_gt_10s:0,
            avg_gt_5s:0,
            avg_gt_2s:0,
            avg_gt_2s_rate:'0%',
            count:0,
            max_gt_10s:0,
            max_gt_5s:0,
            max_gt_2s:0,
            max_gt_2s_rate:'0%',
            host:''
        };

        values.forEach( function(value) {
            if(value.calledsum != 0)
                reducedObject.calledsum = value.calledsum;
            if(value.avg_gt_10s != 0)
                reducedObject.avg_gt_10s = value.avg_gt_10s;
            if(value.avg_gt_5s != 0)
                reducedObject.avg_gt_5s = value.avg_gt_5s;
            if(value.avg_gt_2s != 0)
                reducedObject.avg_gt_2s = value.avg_gt_2s;
            if(value.count != 0)
                reducedObject.count = value.count;
            if(value.max_gt_10s != 0)
                reducedObject.max_gt_10s = value.max_gt_10s;
            if(value.max_gt_5s != 0)
                reducedObject.max_gt_5s = value.max_gt_5s;
            if(value.max_gt_2s != 0)
                reducedObject.max_gt_2s = value.max_gt_2s;

            reducedObject.TRANSCODE =value.TRANSCODE;
            reducedObject.host =value.host;
        });

        if(reducedObject.calledsum != 0)
            reducedObject.avg_gt_2s_rate = (reducedObject.avg_gt_2s/reducedObject.calledsum *100).toFixed(2)+'%';
        if(reducedObject.count != 0)
            reducedObject.max_gt_2s_rate = (reducedObject.max_gt_2s/reducedObject.count *100).toFixed(2)+'%';

        if(reducedObject.avg_gt_2s/reducedObject.calledsum >= 0.1 || reducedObject.max_gt_2s/reducedObject.count >= 0.1)
            return reducedObject;
    };

    var queryStr = {};

    if (sSearch && sSearch != ""){

        var isIp = false;
        var patrn=/^[0-9]{1}[0-9]{0,2}[.]{1}[0-9]{1}[0-9]{0,2}[.]{1}[0-9]{1}[0-9]{0,2}[.]{1}[0-9]{1}[0-9]{0,2}$/;
        if (!patrn.exec(sSearch))
            isIp = false;
        else{
            var str_arr = Array();
            str_arr = sSearch.split(".")
            for( i = 0; i < str_arr.length; i++ ){
                if( str_arr[i] > 255 ) {
                    isIp = false;
                    break;
                }else{
                    isIp = true;
                }
            }
        }
        if(isIp == false)
            queryStr['TRANSCODE'] = sSearch;
        else
            queryStr['host'] = sSearch;

    }

    var command = {
        mapreduce: collection1,
        map: map.toString(),
        reduce: reduce.toString(),
        sort: {'_count':-1},
        query:queryStr,
        out:{inline:1}
    };


    db.db.executeDbCommand(command, function(err, results) {
        if(err)
            res.send("");

        var resultCnt = 0;
        var output = {};
        var temp = [];
        output.sEcho = parseInt(req.query.sEcho);
        output.aaData = [];
        if(results.documents[0].results){
            results.documents[0].results.forEach(function(item,idx){
                if(item.value != null){
                    resultCnt ++ ;
                    config[mode+type+subtype].colNames.forEach(function(col){
                        if(col == '#') {
                            temp.push(parseInt(iDisplayStart)+1+idx);
                        }else if(col == 'TRANSCODE' ) {
                            temp.push(item._id.split("->")[1]);
                        }else if(col == 'host') {
                            temp.push(item._id.split("->")[0]);
                        }else if(col == 'calledsum') {
                            temp.push(item.value.calledsum);
                        }else if(col == 'avg_gt_10s') {
                            temp.push(item.value.avg_gt_10s);
                        }else if(col == 'avg_gt_5s') {
                            temp.push(item.value.avg_gt_5s);
                        }else if(col == 'avg_gt_2s') {
                            temp.push(item.value.avg_gt_2s);
                        }else if(col == 'avg_gt_2s_rate') {
                            temp.push(item.value.avg_gt_2s_rate);
                        }else if(col == 'count') {
                            temp.push(item.value.count);
                        }else if(col == 'max_gt_10s') {
                            temp.push(item.value.max_gt_10s);
                        }else if(col == 'max_gt_5s') {
                            temp.push(item.value.max_gt_5s);
                        }else if(col == 'max_gt_2s') {
                            temp.push(item.value.max_gt_2s);
                        }else if(col == 'max_gt_2s_rate') {
                            temp.push(item.value.max_gt_2s_rate);
                        }

                    });
                    output.aaData.push(temp);
                    temp = [];
                }
            });
        }
        output.iTotalRecords = resultCnt;
        output.iTotalDisplayRecords = resultCnt;
        var response = JSON.stringify(output);
        res.send(response);

    });
}

function getTimeOutTopBakData(req,res,value,mode,type,subtype,scope,sSearch,host,iDisplayLength,iDisplayStart){

    var tabname = query.getTableName(mode, type, scope, value);

    if('' != host){
        tabname = tabname + '_' + host;
    }

    var tempConfig ={};
    type +=subtype;
    extend(true,tempConfig,config[mode+type]);


    var filter ={};
    if(tempConfig.filter)
        filter= tempConfig.filter;

    /*if (sSearch && sSearch != ""){
     filter.$or = [];
     tempConfig.filterColNames.forEach(function(col){

     var obj = {};
     obj[col] = new RegExp(sSearch);
     filter.$or.push(obj);
     });
     }     */
    tempConfig.filter = filter;

    tempConfig.limit = iDisplayLength;
    tempConfig.skip = iDisplayStart;

    var render = function(count,docs){
        var output = {};
        var temp = [];
        output.sEcho = parseInt(req.query.sEcho);
        output.iTotalRecords = count;
        output.iTotalDisplayRecords = count;
        output.aaData = [];
        docs.forEach(function(item,idx){
            var item1 ={};
            if(item._doc !== undefined){
                item1 = item._doc
            }else{
                item1 = JSON.parse(JSON.stringify(item));
            }

            tempConfig.colNames.forEach(function(col){
                if(col == '#') {
                    temp.push(parseInt(iDisplayStart)+1+idx);
                }else if(col == 'avg_gt_2s_rate') {
                    item1[col] =  '0%';
                    if(item1['avgcount'] != 0 && item1['avg_gt_2s'] != 0)
                        item1[col] = (item1['avg_gt_2s']/item1['avgcount']*100).toFixed(2)+'%';
                    temp.push(item1[col]);

                }else if(col == 'max_gt_2s_rate') {
                    item1[col] =  '0%';
                    if(item1['maxcount'] != 0 && item1['max_gt_2s'] != 0)
                        item1[col] = (item1['max_gt_2s']/item1['maxcount']*100).toFixed(2)+'%';
                    temp.push(item1[col]);
                }else{
                    temp.push(item1[col]);
                }
            });
            output.aaData.push(temp);
            temp = [];
        });
        var response = JSON.stringify(output);
        res.send(response);
    }
    var iDisplayEnd = parseInt(iDisplayStart) + parseInt(iDisplayLength) - 1,
        sortMax = false;
    for(var key in tempConfig.sort){
        if(tempConfig.sort[key] == -1 ){
            sortMax = true;
        }
    }
    async.parallel({
        count: function(cb){
            client.zcard([tabname], function(err, cnt){
                cb(null, cnt);
            })
        },
        docs: function(cb){
            if( sortMax ){
                client.zrevrange([tabname, iDisplayStart, iDisplayEnd], function(err, docs){
                    var redisRet = [];
                    for (var rsi = 0; rsi < docs.length; rsi++) {
                        var tmpObj = JSON.parse(docs[rsi]);
                        if(tmpObj['host'] == host || host == '') {
                            redisRet.push(tmpObj);
                        }
                    }
                    cb(null, redisRet);
                })
            }else{
                client.zrange([tabname, iDisplayStart, iDisplayEnd], function(err, docs){
                    var redisRet = [];
                    for (var rsi = 0; rsi < docs.length; rsi++) {
                        var tmpObj = JSON.parse(docs[rsi]);
                        if(tmpObj['host'] == host || host == '') {
                            redisRet.push(tmpObj);
                        }
                    }
                    cb(null, redisRet);
                })
            }
        }
    },function(err, results){
        if(err){
            logger.error(err)
        }
        render(results.count, results.docs);
    })

}

function getHistoryDetailData(req,res,value,mode, type,subtype,scope,sSearch,host,iDisplayLength,iDisplayStart,sortDir,sortIdx){

    var table = query.getTable(mode, type, scope, value)

    var tempConfig ={};
    type +=subtype;
    extend(true,tempConfig,config[mode+type]);


    var filter ={};
    if(tempConfig.filter)
        filter= tempConfig.filter;

    if (sSearch && sSearch != ""){
        filter.$or = [];
        tempConfig.filterColNames.forEach(function(col){

            var obj = {};
            try{
                obj[col] = new RegExp(sSearch);
            }catch(e){
                logger.debug("err=%s", e.message);
                var sSearchTemp  = /\sSearch/;
                obj[col] = sSearchTemp;
            }
            filter.$or.push(obj);
        });
    }
    tempConfig.filter = filter;

    if(host != ''){
        tempConfig.filter.host = host;
    }

    tempConfig.limit = iDisplayLength;
    tempConfig.skip = iDisplayStart;

    if(sortIdx !== -1 && sortDir !== '' && tempConfig.colNames !== undefined && tempConfig.colNames.length >= sortIdx){
        var sort = {};
        sortDir = sortDir === 'asc' ? 1 : -1;
        sort[tempConfig.colNames[sortIdx]] = sortDir;
        logger.error(sortIdx, sort);
        tempConfig.sort = sort;
    }


    var render = function(count,docs){
        var output = {};
        var temp = [];
        output.sEcho = parseInt(req.query.sEcho);
        output.iTotalRecords = count;
        output.iTotalDisplayRecords = count;
        output.aaData = [];
        docs.forEach(function(item,idx){
            var item1 ={};
            if(item._doc !== undefined){
                item1 = item._doc
            }else{
                item1 = JSON.parse(JSON.stringify(item));
            }

            tempConfig.colNames.forEach(function(col){
                if(col == '#') {
                    temp.push(parseInt(iDisplayStart)+1+idx);
                }else if(col === 'state'){
                    var state = item1.state || 0;
                    var tmp = state === 0 ? '已停止' : '采集中';
                    var cls = state === 0 ? 'btn-default' : 'btn-info';
                    temp.push('<button class="tuxhelp btn btn-small '+cls+'" data-state='+state+' style="width: 84px" data-hostMonitor="'+item1.host+'" data-lcu="'+item1.TRANSCODE+'">'+tmp+'</button>')
                }else if(col == 'avg_gt_2s_rate') {
                    item1[col] =  '0%';
                    if(item1['avgcount'] != 0 && item1['avg_gt_2s'] != 0)
                        item1[col] = (item1['avg_gt_2s']/item1['avgcount']*100).toFixed(2)+'%';
                    temp.push(item1[col]);

                }else if(col == 'max_gt_2s_rate') {
                    item1[col] =  '0%';
                    if(item1['maxcount'] != 0 && item1['max_gt_2s'] != 0)
                        item1[col] = (item1['max_gt_2s']/item1['maxcount']*100).toFixed(2)+'%';
                    temp.push(item1[col]);
                }else{
                    temp.push(item1[col]);
                }
            });
            output.aaData.push(temp);
            temp = [];
        });
        var response = JSON.stringify(output);
        res.send(response);
    }
    async.parallel({
        count: function(cb){
            table.getCount(tempConfig,function(cnt){
                cb(null, cnt);
            });
        },
        docs: function (cb) {
            table.list(tempConfig, cb);
        }
    }, function(err, results){
        if(err){
            logger.error(err)
        }
        render(results.count, results.docs);
    });
}


module.exports = function (app) {

    app.get('/common/detail/query/history.html', auth.requiresLogin, function(req, res) {
        var chartList = req.query.chartList;
        var value = req.query.date;
        var list = chart_list[chartList];
        var headTile = config[list[0].mode+list[0].type+list[0].subtype].name;
        var scope = config[list[0].mode+list[0].type+list[0].subtype].scopes[0];
        var hostDisFlag = config[list[0].mode+list[0].type+list[0].subtype].hostDisFlag;
        var retHosts = [];
        var lcuArr = req.query.lcuArr||'';
        if (hostDisFlag === undefined || hostDisFlag === 1 ){
            retHosts = hostsList;
        }
        var bVisibleFlag = config[list[0].mode+list[0].type+list[0].subtype].bVisibleFlag;
        var retBVisibleFlag = '';
        if (bVisibleFlag !== undefined){
            retBVisibleFlag = bVisibleFlag;
        }

        var detailTitle = config[list[0].mode+list[0].type+list[0].subtype].detailTitle;
        var retDetailTitle = '';
        if (detailTitle !== undefined){
            retDetailTitle = detailTitle;
        }
        logger.debug('date========%s',value);
        var queryUrl = "/historyQueryDetailData?mode="+list[0].mode+"&type="+list[0].type+"&scope="+scope+"&subtype="+list[0].subtype+"&date="+value;
        var lcuHost = '';
        var lcuName = '';
        if (lcuArr !== ''){
            var lcuArray = lcuArr.split("`");
            lcuHost = lcuArray.pop();
            lcuName = lcuArray.join('|');
            queryUrl += '&sSearch=' + lcuName+'|';
            queryUrl += '&hostMonitor=' + lcuHost;
        }
        res.renderPjax('plugin/common/detail/query/history',{
            titles: config[list[0].mode+list[0].type+list[0].subtype].titles,
            queryUrl:queryUrl,
            headTile:headTile,
            chartList:chartList,
            hosts:retHosts,
            bVisibleFlag:retBVisibleFlag,
            detailTitle:retDetailTitle,
            value: value,
            tabColNames: lpConfig.tabColNames,
            lcuName : lcuName,
            lcuHost : lcuHost
        });
    });

    app.get('/historyQueryDetailData', function(req, res,next) {
        var mode = req.query.mode;
        var type = req.query.type;
        var scope = req.query.scope;
        var value = req.query.date;
        var subtype = req.query.subtype || '';
        var iDisplayStart = req.query.iDisplayStart;
        var iDisplayLength = req.query.iDisplayLength;
        var sSearch = req.query.sSearch;
        var host = req.query.host || '';
        var sortIdx = req.query.iSortCol_0 || -1;
        var sortDir = req.query.sSortDir_0 || '';

        if(!iDisplayStart) iDisplayStart = 0;
        if(!iDisplayLength) iDisplayLength = 10;

        logger.debug('date========%s',value);
        if (!config[mode+type+subtype])
            return next(new Error('not found'));

        if (config[mode+type+subtype].queryType && config[mode+type+subtype].queryType =='mapreduce'){
            logger.debug('********getMapReduceData************');
            getMapReduceData(req,res,value,mode,type,subtype,scope,sSearch);
        }else if(mode == 'TuxState' && type == 'TimeOutTopBak' && (scope == 'day' || scope == 'month') ){
            logger.debug('********getTimeOutTopBakData************');
            getTimeOutTopBakData(req,res,value,mode,type,subtype,scope,sSearch,host,iDisplayLength,iDisplayStart);
        } else {
            logger.debug('********getHistoryDetailData************');
            getHistoryDetailData(req,res,value,mode, type,subtype,scope,sSearch,host,iDisplayLength,iDisplayStart,sortDir,sortIdx);
        }
    });

    app.get('/tuxlogHelperCmd', auth.requiresLogin, function (req, res) {
        var port = req.query.port || 7812;
        var host = sanitize(req.query.host).trim();
        host = sanitize(host).xss();
        var lcu = sanitize(req.query.Lcu).trim();
        lcu = sanitize(lcu).xss();
        var hosturl = host.split('_')[0] || '127.0.0.1';
        var usrname = host.split('_')[1] || 'tuxapp';
        //hosturl = '127.0.0.1';
        var shell = sanitize(sanitize(req.query.shell || './script/tuxloghelper.sh').trim()).xss();
        var path = sanitize(sanitize(req.query.path || '/ngbss/'+usrname+'/.logger.properties').trim()).xss();
        var cmdid = sanitize(sanitize(req.query.cmdid || '3c4a6a8bb16f5d810bc80d38e1ce0d1e').trim()).xss();
        var cmdtype = sanitize(sanitize(req.query.cmdtype || 'TuxLcuPointOperateCMD').trim()).xss();
        var state = parseInt(req.query.state);
        var newState = (state + 1) % 2;
        var init = req.query.init || 0;
        var chartList = req.query.chartList;
        var chartlist = chart_list[chartList][0];
        var date = mutil.formatDate(null, 'yyyy-MM-dd');
        var cConfig = config[chartlist.mode + chartlist.type + chartlist.subtype];
        var data = {
            port: port,
            host: hosturl,
            shell: shell,
            path: path,
            cmdId: cmdid,
            cmdType: cmdtype
        };
        if(init == 1){
            data.method = 'init';
            newState = 0;
        }else if(newState === 0){
            data.transcode = lcu;
            data.method = 'close';
        }else if(newState === 1){
            data.transcode = lcu;
            data.method = 'open';
        }
        var conf = {
            host: host
        };
        if(init == 1){
            delete conf.TRANSCODE;
        }else{
            conf.TRANSCODE = lcu;
        }
        var tablename = query.getTableName(chartlist.mode, chartlist.type, cConfig.scopes[0], date);

        commander.getCommander(req.session.user.user_name, host, data, function (err, cmdStr) {
            if(err){
                logger.error('==== tuxlogHelperCmd error ====', err);
            }
            db.collection(tablename).update(conf,{$set: {state: newState}}, {multi: true}, function (err, result) {
                if(err){
                    logger.error(err);
                    res.send({state: state, ok: false, msg: 'MongoDB update state fail.'});
                }else{
                    //logger.debug('===', cmdStr);
                    exec(cmdStr, {timeout: 8000}, function (err, stdout, stderr) {
                        if(err){
                            logger.error(err, stderr);
                            db.collection(tablename).update(conf,{$set: {state: state}}, {upsert:true, multi: true}, function (err, result) {
                                res.send({state: state, ok: false, msg: 'Monitor shell script exec fail.'});
                            })
                        }else{
                            //logger.debug('======',err, stdout, stderr);
                            res.send({state: newState, ok: true})
                        }
                    })
                }
            });
        });
    });

};
