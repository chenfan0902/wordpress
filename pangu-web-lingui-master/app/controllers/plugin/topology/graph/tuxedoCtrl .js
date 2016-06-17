var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var mutil = require('../../../util');
var db = require('../../../connectFactory').getConnection('tuxedoDb')
    , logger = require('../../../log').logger
    , extend = require('extend')
    , query = require('../../../dbQuery')
    , async = require('async')
    , aConfig = require('../../../plugin_config/'+sysConfig.province+'/topology/graph/netTopologyGraph/config_net_topology').config
    , alConfig = require('../../../plugin_config/'+sysConfig.province+'/topology/graph/netTopologyGraph/config_net_topology')
    , aList = require('../../../plugin_config/'+sysConfig.province+'/topology/graph/netTopologyGraph/config_net_topology').list;
var auth = require('../../../auth');

module.exports = function (app) {
     app.get('/topology/graph/tuxedo.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'] || mutil.formatDate(null, 'yyyy-MM-dd'),
            chartList = req.query["chartList"],
            chart_list = aList[chartList][0],
            cConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype];

                res.renderPjax('plugin/topology/graph/tuxedo',{
                    value: date,
                    chartList: chartList,
                    title: cConfig["title"],
                    cConfig: JSON.stringify(cConfig),
                    tradeType: cConfig.tradeType,
                    lcuQueryUrl: cConfig.lcuQueryUrl,
                    warnQueryUrl: cConfig.warnQueryUrl,
                    tradeNorm: cConfig.tradeNorm,
                    regionType: cConfig.regionType,
                    regionNorm: cConfig.regionNorm,
                    lcuTableNames: cConfig.lcuTableNames,
                    warnTableNames: cConfig.warnTableNames
                });
                                          
    }); 
    app.get('/getStatDataByHost', function(req, res){
        var date = req.query.date || mutil.formatDate(null, 'yyyy-MM-dd'),
            host = req.query['host'];

        var conf = {};
        if(host.indexOf("`") != -1){
            var arr = host.split("`");
            conf.host = {
                "$in":  host.split("`")
            };
        }else{
            conf.host = host;
        }
        //logger.debug("=====",conf,"=====")

        var yy = ("000" + date.split('-')[0]).substr(-2),
            mm = ("000" + date.split('-')[1]).substr(-2),
            dd = ("000" + date.split('-')[2]).substr(-2);
        //console.log('=====',yy,mm,dd,'=====')

        var tabCallCnt = db.collection('TuxStateCalledSumByTimeByHostDAY' + yy + mm + dd),
            tabFailCnt = db.collection('TuxStateFailedSumByTimeByHostDAY' + yy + mm + dd);
        var render = function(FailDocs,CallDocs){
            //logger.debug(FailDocs, CallDocs)
            var failCnt = 0,
                callCnt = 0;
            for(var i=0; i<CallDocs.length; i++){
                if(CallDocs[i]['_count']){
                    callCnt += CallDocs[i]['_count'];
                }else{
                    callCnt += CallDocs[i]['count'];
                }
            }
            for(var i=0; i<FailDocs.length; i++){
                if(FailDocs[i]['_count']){
                    failCnt += FailDocs[i]['_count'];
                }else{
                    failCnt += FailDocs[i]['_count'];
                }
            }
            res.send({'CallCnt': callCnt, 'FailCnt': failCnt});
        };
        async.parallel({
            FailDocs: function(cb){
                tabFailCnt.find(conf, {_id:0, _count: 1, count: 1}, function(err, docs1){
                    docs1.toArray(cb);
                });
            },
            CallDocs: function(cb){
                tabCallCnt.find(conf, {_id:0, _count: 1, count: 1}, function(err, docs){
                    docs.toArray(cb);
                });
            }
        }, function(err, results){
            if(err){
                logger.error(err);
            }
            render(results.FailDocs, results.CallDocs);
        });

    });

    app.get('/getNTGNodes', function(req, res){
        var chartList = req.query["chartList"],
            chart_list = aList[chartList][0],
            cConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype],
            result = {};
        if(typeof cConfig["nodesName"] === "string"){
            res.send(alConfig[cConfig["nodesName"]]);
        }else {
            for (var key in cConfig["nodesName"]) {
                result[key] = alConfig[cConfig["nodesName"][key]];
            }
            //logger.debug(result)
            res.send(result);
        }
    });

    app.get('/getTuxedoTradeRegionData', function(req, res){
        var date = req.query.date || mutil.formatDate(null, 'yyyy-MM-dd');
        var chartList = req.query.chartList;
        var chartlist = aList[chartList][0];
        var cConfig = aConfig[chartlist.mode+chartlist.type+chartlist.subtype];
        var queryObj = {};

        var filter = {_id: 0, _count: 1, count: 1};
        var queryTable = function(tablename, conf, filter){
            return function(callback){
                var table = db.model('QueryResult', tablename);
                table.find(conf, filter, callback);
            };
        };

        var render = function(docs){
            var results = {};
            for(var key in docs){
                var sum = 0;
                for(var j=0; j<docs[key].length; j++){
                    sum += docs[key][j]._count;
                }
                results[key] = sum;
            }
            res.send(results);
        };

        var callSumTabName = query.getTableName('TuxState','CalledSumBySvrByHost', 'day', date);
        var failSumTabName = query.getTableName('TuxState','FailedSumSvrByHourByHost', 'day', date);
        for(var i=0; i<cConfig.tradeType.length; i++){
            var item = cConfig.tradeType[i];
            var tmpConf = {};
            tmpConf.host = {
                $in: item.host
            };
            queryObj['trade`'+item.key + '`call'] = queryTable(callSumTabName, tmpConf, filter);
            queryObj['trade`'+item.key + '`fail'] = queryTable(failSumTabName, tmpConf, filter);
        }
        for(var i=0; i<cConfig.regionType.length; i++){
            var item = cConfig.regionType[i];
            var tmpConf = {};
            tmpConf.host = item.region;
            queryObj['region`'+item.key + '`call'] = queryTable(callSumTabName, tmpConf, filter);
            queryObj['region`'+item.key + '`fail'] = queryTable(failSumTabName, tmpConf, filter);
        }
        async.parallel(queryObj, function(err, results){
            render(results);
        });
    });
};