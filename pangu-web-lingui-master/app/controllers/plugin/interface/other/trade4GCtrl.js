var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('soapDb');
var logger = require('../../../log').logger;
var tConfig = require('../../../plugin_config/'+sysConfig.province+'/interface/other/config_trade4G').trade;
var extend = require('extend');
var query = require('../../../dbQuery');
var QueueAnalyze = require('../../../../models/trade4GModel');
var async = require('async');
var auth = require('../../../auth');

module.exports = function (app) {
    app.get('/interface/other/trade4G.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'] || "2015-02-10";
        var hosts = tConfig.hosts;
        var type = tConfig.selType,
            operate = tConfig.operate;
        res.renderPjax('plugin/interface/other/trade4G', {
            hosts: hosts,
            value: date,
            type: type,
            operate: operate
        });
    });

    app.get('/getTrade4GData', function(req, res){
        var host = req.query['host'],
            date = req.query['date'],
            _operate = req.query['_operate'],
            type = req.query['type'];
        var cadesc = tConfig.codeAddDesc[0];

        var obj = {};

        if( 'all' == _operate) {
            obj = {
                SERVICE_NAME: 'UserTransferSer'
            };
        }else{
            obj = {
                OPERATE_NAME: _operate
            };
        }
        if( 'all' != host ){
            obj.host = host;
        }

        var chartConfig = tConfig.trade4G[0],
            groupConfig = tConfig.trade4GList[0];
        var tabName = chartConfig.mode + chartConfig.type + chartConfig.subtype + date.replace(/-/g, ''),
            tabListName = groupConfig.mode + groupConfig.type + groupConfig.subtype + date.replace(/-/g, '').substr(2);
        var table = db.model('Trade4GModel', tabName),
            tableList = db.collection(tabListName);

        function sortObj(arr){
            if(0 == arr.length){
                return [];
            }
            var left = [],
                right = [],
                pivot = arr[0]['count'],
                pivotObj = arr[0];

            for(var i=1; i<arr.length; i++){
                arr[i]['count'] > pivot ? left.push(arr[i]) : right.push(arr[i]);
            }
            return sortObj(left).concat(pivotObj, sortObj(right));
        }
        function mExtend(dest, src){
            var tmp = {};
            for(var i in dest){
                tmp[i] = dest[i];
            }
            for(var idx in src){
                tmp[idx] = src[idx];
            }
            return tmp;
        }

        async.parallel({
            base: function(callback){
                var q = mExtend(obj,{type: type});
                tableList.find(q, {_id:0,OPERATE_NAME:0,host:0,type:0,SERVICE_NAME:0}, function(err, rest){
                    rest.toArray(function(err, rows){
                        var baseRest = [], total = 0;
                        if( 'all' == host ){
                            var tmpRows = {};
                            for(var i=0; i<rows.length; i++){
                                for(var idx in rows[i]){
                                    if( tmpRows[idx] ){
                                        tmpRows[idx] += rows[i][idx];
                                    }else{
                                        tmpRows[idx] = rows[i][idx];
                                    }
                                }
                            }
                            for(var idx in tmpRows){
                                if (type == "CODE") {
                                    baseRest.push({REQUSET_CODE: cadesc[idx], count: tmpRows[idx]});
                                } else {
                                    baseRest.push({REQUSET_DESC: idx, count: tmpRows[idx]});
                                }
                                total += tmpRows[idx];
                            }
                        }else {
                            for (var idx in rows[0]) {
                                if (type == "CODE") {
                                    baseRest.push({REQUSET_CODE: cadesc[idx], count: rows[0][idx]});
                                } else {
                                    baseRest.push({REQUSET_DESC: idx, count: rows[0][idx]});
                                }
                                total += rows[0][idx];
                            }
                        }
                        baseRest = sortObj(baseRest, 'count');
                        var tabColName = null;
                        if( 'CODE' == type){
                            tabColName = tConfig.tabColNames_CODE;
                        }else{
                            tabColName = tConfig.tabColNames_DESC;
                        }
                        callback(null, {results:baseRest, total: total, tabColName: tabColName});
                    });
                });
            },
            total: function(callback){
                table.count(obj, function(err, totalRest){
                    callback(null, totalRest);
                });
            },
            success: function(callback){
                var q = mExtend(obj,{RSP_CODE: '0000', REQUSET_INFO: []});
                table.count(q, function(err, successRest){
                    callback(null, successRest);
                });
            }
        },function(err, results){
            var rest = results.base,
                total = results.total,
                success = results.success,
                failure = total - success;
            rest.count = total;
            rest.success = success;
            rest.failure = failure;
            res.send(rest);
        });
    });
}