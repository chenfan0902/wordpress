var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../../config/config')[env];
var db = require('../../../../connectFactory').getConnection('tuxedoDb');
var debug = require('debug')('pangu:top');
var util = require("util");
var query = require('../../../../dbQuery');
var config = require('../../../../plugin_config/'+sysConfig.province+'/common/detail/query/config_realTimeDetail').detailConfig;
var chart_list = require('../../../../plugin_config/'+sysConfig.province+'/common/detail/query/config_realTimeDetail').detailList;
var async = require('async');
var extend = require('extend');
var logger = require('../../../../log').logger;
var auth = require('../../../../auth');
var hostsList = require('../../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').queue.hosts;
var mutil = require('../../../../util');

var provinceRegion = require('../../../../config/'+sysConfig.province+'/regionConfig').provinceRegion;
var hostRegion = require('../../../../config/'+sysConfig.province+'/regionConfig').hostRegion;
var formatDate = require('../../../../util').formatDate;

module.exports = function (app) {

    app.get('/common/detail/query/realtime.html', auth.requiresLogin, function(req, res) {
        var chartList = req.query.chartList;
        var value = mutil.formatDate(null, 'yyyy-MM-dd');
        var list = chart_list[chartList];

        logger.debug("value=%s",value);
        var headTile = config[list[0].mode+list[0].type+list[0].subtype].name;
        var displayLength = config[list[0].mode+list[0].type+list[0].subtype].displayLength;
        var scope = config[list[0].mode+list[0].type+list[0].subtype].scopes[0];
        var queryUrl = "/realtimeQueryDetailData?mode="+list[0].mode+"&type="+list[0].type+"&scope="+scope+"&subtype="+list[0].subtype+"&date="+value;
        logger.debug("queryUrl------------=%s",queryUrl);
        res.renderPjax('plugin/common/detail/query/realtime',{
            titles: config[list[0].mode+list[0].type+list[0].subtype].titles,
            queryUrl:queryUrl,
            headTile:headTile,
            hosts:hostsList,
            value: value,
            chartList: chartList,
            displayLength:displayLength
        });
    });

    var getUserRight = function (req,cb){

        var pareTime = formatDate();
        var queryObj ={};
        var queryTable = function (role) {
            return function (callback) {
                var table = db.model('roleWarningRight', 'roleWarningRight');
                table.find({'role': role, 'mode': 'webWarning'}, function (err, rightRow) {
                    if (err) {
                        logger.error(err);
                    }
                    callback(null, rightRow);
                });
            };
        };

        async.waterfall([
            function(callback){
                var table = db.model('userWarningRole','userWarningRole');
                table.find({'user_name':req.session.user.user_name,'start_time':{$lte: pareTime},'end_time':{$gte: pareTime}}, function(err, roleRow){
                    if (err) {
                        logger.error(err);
                    }
                    if(roleRow){
                        callback(null,roleRow);
                    }else{
                        callback(null,[]);
                    }
                });
            },function(roleRow,callback){
                roleRow.forEach(function (item) {
                    queryObj[item.role] = queryTable(item.role);
                });
                function retResult(tempResult){
                    callback(null,tempResult);
                }
                async.parallel(queryObj,function(err, results0) {
                    if (err) {
                        logger.error(err);
                    }
                    async.apply(retResult, results0)();
                });
            }
        ],function(err, results) {
            var retSet = [];
            if (err) {
                logger.error(err);
            }
            var subscribeRegion = '';
            for(var regionKey in provinceRegion){
                if(~provinceRegion[regionKey].join(',').indexOf(req.session.user.provinceCode)){
                    subscribeRegion = regionKey;
                    break;
                }
            }
            (req.session.user.is_admin) &&  (subscribeRegion = 'admin');
            for ( var retItem in results) {
                results[retItem].forEach(function (rightItem) {
                    var tempRight = {};
                    var rightLevel  = rightItem.level;
                    var tempLevel =[];
                    while(rightLevel > 0){
                        tempLevel.push(rightLevel);
                        rightLevel --;
                    }
                    tempRight.level = tempLevel;
                    tempRight.type  =  rightItem.type;
                    tempRight.subscribeRegion = subscribeRegion;
                    if(subscribeRegion !== 'admin'){
                        if(hostRegion[subscribeRegion] !== undefined){
                            tempRight.host = hostRegion[subscribeRegion];
                        }else{
                            tempRight.host =[];
                        }
                    }else{
                        tempRight.host =[];
                    }
                    retSet.push(tempRight);
                });
            }

            cb(retSet);
        });

    };

    app.get('/realtimeQueryDetailData', function(req, res,next) {
        var queryData = function(rightParam) {
            var mode = req.query.mode;
            var type = req.query.type;
            var scope = req.query.scope;
            var value = req.query.date;
            var subtype = req.query.subtype || '';
            var iDisplayStart = req.query.iDisplayStart;
            var iDisplayLength = req.query.iDisplayLength;
            var sSearch = req.query.sSearch;
            var host = req.query.host;
            var t = req.query.t;

            if (!iDisplayStart) iDisplayStart = 0;
            //iDisplayLength = config[mode+type+subtype].displayLength;

            var now = new Date().getTime();

            var table = query.getTable(mode, type, scope, value);

            type += subtype;

            //logger.debug("value------------=%s", value);
            //logger.debug("mode------------=%s", mode);
            //logger.debug("type------------=%s", type);
            //logger.debug("subtype------------=%s", subtype);
            logger.debug("rightParam------------", rightParam);
            if (!config[mode + type])
                return next(new Error('not found'));

            var tempConfig = {};
            extend(true, tempConfig, config[mode + type]);


            var filter = {};
            if (tempConfig.filter) {
                filter = tempConfig.filter;
            }

            tempConfig.filterColNames.forEach(function (col) {
                if (col === "timestamp") {
                    filter[col] = {$gte: now - tempConfig.delayTime, $lte: now + 1000};
                } else if (col === 'time') {
                    var gtTime = new Date(now - tempConfig.delayTime);
                    var ltTime = new Date(now + 1000);
                    var pareGtTime = (gtTime.getFullYear()) + '-' + ('00' + (gtTime.getMonth() + 1)).substr(-2) + '-' + ('00' + gtTime.getDate()).substr(-2) + ' ' +
                        ('00' + gtTime.getHours()).substr(-2) + ':' + ('00' + gtTime.getMinutes()).substr(-2);

                    var pareltTime = (ltTime.getFullYear()) + '-' + ('00' + (ltTime.getMonth() + 1)).substr(-2) + '-' + ('00' + ltTime.getDate()).substr(-2) + ' ' +
                        ('00' + ltTime.getHours()).substr(-2) + ':' + ('00' + ltTime.getMinutes()).substr(-2);

                    filter[col] = {$gte: pareGtTime, $lte: pareltTime};
                }
            });
            if (sSearch && sSearch !== "" && rightParam === undefined) {
                (filter.$or === undefined) &&  (filter.$or = []);
                tempConfig.filterColNames.forEach(function (col) {
                    if (col !== "timestamp" && col !== "time") {
                        var obj = {};
                        try{
                            obj[col] = new RegExp(sSearch);
                        }catch(e){
                            logger.debug("err=%s", e.message);
                            var sSearchTemp  = /\sSearch/;
                            obj[col] = sSearchTemp;
                        }
                        filter.$or.push(obj);
                    }
                });

            }

            if(rightParam !== undefined){
                (filter.$or === undefined) &&  (filter.$or = []);
                var len  = (filter.$or).length;
                logger.debug("(filter.$or).length=%s", (filter.$or).length);
                rightParam.forEach(function (right) {
                    var rightFilter = {};
                    rightFilter.type = right.type;
                    rightFilter.level = {$in: right.level};
                    if (right.subscribeRegion !== 'admin') {
                        rightFilter.host = {$in: right.host};
                    }
                    if (sSearch && sSearch !== ""){
                        try {
                            rightFilter.detail = new RegExp(sSearch);
                        }catch(e){
                            logger.debug("err=%s", e.message);
                            var sSearchTemp  = /\sSearch/;
                            rightFilter.detail = sSearchTemp;
                        }
                    }
                    filter.$or.push(rightFilter);
                });

            }
            tempConfig.filter = filter;
            if (filter.$or && filter.$or.length <= 0) {
                delete filter.$or;
            }
            logger.debug("tempConfig.filter=%s", JSON.stringify(tempConfig.filter));
            tempConfig.limit = iDisplayLength;
            tempConfig.skip = iDisplayStart;
            if(filter.$or === undefined || filter.$or.length === 0){
                delete filter.$or;
            }
            if(queryType === 'warningByTime') {
                if (host !== '*') {
                    filter.host = host;
                } else {
                    delete filter.host;
                }
                host !== '*' && (filter.host = host);
                host === '*' && (delete filter.host);
                t === 'lcu' && (filter.detail = /流程/);
                t === 'svr' && (filter.detail = /服务/);
                t === '*' && (delete filter.detail);
            }

            var render = function (count, docs) {
                var output = {};
                var temp = [];
                output.sEcho = parseInt(req.query.sEcho);
                output.iTotalRecords = count;
                output.iTotalDisplayRecords = count;
                output.aaData = [];

                docs.forEach(function (item, idx) {
                    tempConfig.colNames.forEach(function (col) {
                        if (col === '#') {
                            temp.push(parseInt(iDisplayStart) + 1 + idx);
                        } else {
                            if (item[col] !== undefined) {
                                temp.push(item[col]);
                            }else {
                                temp.push(item._doc[col]);
                            }
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
                }
            }, function (err, results) {
                if (err) {
                    logger.error(err);
                }
                logger.debug("realtimeQueryDetail==docs------------=%s", JSON.stringify(results.docs));
                render(results.count, results.docs);
            });
        };

        var queryType = req.query.mode + req.query.type + req.query.subtype||'';
        if(queryType === 'warningByTime'){
            getUserRight(req,queryData);
        }else{
            queryData();
        }
    });

}
