/**
 * Created by wanzhou on 15/8/7.
 */
 var env = process.env.NODE_ENV || 'development';
 var globalConfig = require('../../../../../config/config')[env];
 var util = require('util');
 var redis = require('ioredis');
 var async = require('async');
 var extend = require('extend');
 var query = require('../../../dbQuery');
 var config = require('../../../plugin_config/'+globalConfig.province+'/interface/soap/config_intf_oper_call_timeout').config;
 var chart_list = require('../../../plugin_config/'+globalConfig.province+'/interface/soap/config_intf_oper_call_timeout').list;
 var redisCfg = globalConfig.redisCluster;
 var client = new redis.Cluster(redisCfg.nodes, {password: redisCfg.password});
 var db = require('../../../connectFactory').getConnection('soapDb');
 var auth = require('../../../auth');
 
module.exports = function (app) {
    app.get('/interface/soap/operCallTimeOut.html', auth.requiresLogin, function (req, res) {
        var chartList = req.query.chartList;
        var value = req.query.date;
        var list = chart_list[chartList];
        var headTile = config[list[0].mode + list[0].type + list[0].subtype].name;
        //var scope = config[list[0].mode + list[0].type + list[0].subtype].scopes[0];

        res.renderPjax('plugin/interface/soap/operCallTimeOut', {
            titles: config[list[0].mode + list[0].type + list[0].subtype].titles,
            headTile: headTile,
            chartList: chartList,
            value: value,
            tabColNames: config[list[0].mode + list[0].type + list[0].subtype].colNames
        });
    });

    app.get('/getIntfSoapCallTimeOutData', function(req, res,next) {
        var chartList = req.query.chartList;
        var chartlist = chart_list[chartList][0];
        var chartConfig = config[chartlist.mode+chartlist.type+chartlist.subtype];
        var value = req.query.date;
        var sSearch = req.query.sSearch;
        var province = req.query.province || '70';
        var now = new Date().setDate('09');
        var startTime = now - chartConfig.allTime;
        //value = '2013-06-18';

        if (!chartConfig)
            return next(new Error('not found'));

        if (chartConfig.queryType === 'mapreduce') {

            var o = {};

            var collectionName = query.getTableName(chartlist.mode, chartlist.type, chartConfig.scopes[0], value);

            o.map = function () {
                var time = this.timestamp - this.timestamp % 300000;
                var key = this.OPERATE_NAME + '->' + time;
                var value = {
                    count: 0,
                    gt_10s: 0,
                    gt_5s: 0,
                    gt_2s: 0
                };

                var timeDiff = new Date(this.RSP_TIME).getTime() - new Date(this.REQ_TIME).getTime();
                timeDiff /= 1000;

                timeDiff >= 10 && (value.gt_10s = 1);
                timeDiff >= 5 && (value.gt_5s = 1);
                timeDiff >= 2 && (value.gt_2s = 1);
                value.count = 1;

                value.timestamp = this.timestamp;

                emit(key, value);
            };

            o.reduce = function (k, values) {
                var reducedObject = {
                    count: 0,
                    gt_10s: 0,
                    gt_5s: 0,
                    gt_2s: 0
                };
                //printjson(values)

                values.forEach(function (value) {
                    value.count !=0 && (reducedObject.count += value.count);

                    value.gt_10s !=0 && (reducedObject.gt_10s += value.gt_10s);
                    value.gt_5s !=0 && (reducedObject.gt_5s += value.gt_5s);
                    value.gt_2s !=0 && (reducedObject.gt_2s += value.gt_2s);

                    reducedObject.timestamp = value.timestamp;
                });

                //reducedObject.gt_2s_rate = (reducedObject.gt_2s / reducedObject.count * 100).toFixed(2) + '%';
                //reducedObject.gt_5s_rate = (reducedObject.gt_5s / reducedObject.count * 100).toFixed(2) + '%';
                //reducedObject.gt_10s_rate = (reducedObject.gt_10s / reducedObject.count * 100).toFixed(2) + '%';

                //if (reducedObject.gt_2s > 0 || reducedObject.gt_5s > 0 || reducedObject.gt_10s > 0) {
                return reducedObject;
                //}
            };
            o.query = {};

            if (sSearch && sSearch != '') {
                o.query.OPERATE_NAME = new RegExp('.*'+sSearch+'.*','i');
            }

            o.query.timestamp = {
                $gte: startTime,
                $lt: now
            };

            var table = db.model(chartConfig.schemaName, collectionName);

            table.mapReduce(o, function(err, rows){
                //console.log(rows, province);
                var output = {};
                var docs = [];
                var totalObj = {};
                var resultCnt = 0;
                var callSum = 0;
                for(var i=0; i<rows.length; i++){
                    var tmpK = rows[i]._id.split('->')[0];
                    var tmpT = rows[i]._id.split('->')[1];
                    var tmpV = rows[i].value;
                    //if(tmp && (tmp.gt_2s > 0 || tmp.gt_5s > 0 || tmp.gt_10s > 0)){
                    resultCnt ++;
                    callSum += tmpV.count;
                    output[tmpK] === undefined && (output[tmpK] = []);
                    output[tmpK].push(tmpV);
                    if(totalObj[tmpT] === undefined){
                        totalObj[tmpT] = { count: 0, gt_10s: 0, gt_5s: 0, gt_2s: 0 };
                    }
                    totalObj[tmpT].count += tmpV.count;
                    totalObj[tmpT].gt_10s += tmpV.gt_10s;
                    totalObj[tmpT].gt_5s += tmpV.gt_5s;
                    totalObj[tmpT].gt_2s += tmpV.gt_2s;
                    //output.aaData.push(tmp);
                    //}
                }

                output.all = [];

                for(var key in totalObj){
                    output.all.push({
                        count: totalObj[key].count,
                        gt_10s: totalObj[key].gt_10s,
                        gt_5s: totalObj[key].gt_5s,
                        gt_2s: totalObj[key].gt_2s,
                        timestamp: key
                    })
                }

                res.send({resultCnt: resultCnt, callSum: callSum, data: output});
            })

        }
    });

    app.get('/getIntfSoapCallTimeOutDataInterval', function(req, res,next) {
        //http://localhost:3000/getIntfSoapCallTimeOutDataInterval?value=2015-8-31&chartList=intfSoapCallTimeOutList
        // &sSearch=delRemoteCardInfo&province=76&start=2015-08-31 09:00:00&end=2015-08-31 18:20:59
        var chartList = req.query.chartList;
        var chartlist = chart_list[chartList][0];
        var chartConfig = config[chartlist.mode+chartlist.type+chartlist.subtype];
        var value = req.query.date;
        var sSearch = req.query.sSearch;
        var province = req.query.province || '70';
        var s = req.query.start;
        var e = req.query.end;
        var startstamp = new Date(s).getTime();
        var endstamp = new Date(e).getTime();

        if (!chartConfig)
            return next(new Error('not found'));

        if (chartConfig.queryType === 'mapreduce') {

            var o = {};

            var collectionName = query.getTableName(chartlist.mode, chartlist.type, chartConfig.scopes[0], value);

            o.map = function () {
                var key = this.OPERATE_NAME;
                var value = {
                    count: 0,
                    gt_10s: 0,
                    gt_5s: 0,
                    gt_2s: 0
                };

                var timeDiff = new Date(this.RSP_TIME).getTime() - new Date(this.REQ_TIME).getTime();
                timeDiff /= 1000;

                timeDiff >= 10 && (value.gt_10s = 1);
                timeDiff >= 5 && (value.gt_5s = 1);
                timeDiff >= 2 && (value.gt_2s = 1);
                value.count = 1;

                emit(key, value);
            };

            o.reduce = function (k, values) {
                var reducedObject = {
                    count: 0,
                    gt_10s: 0,
                    gt_5s: 0,
                    gt_2s: 0
                };
                //printjson(values)

                values.forEach(function (value) {
                    value.count !=0 && (reducedObject.count += value.count);

                    value.gt_10s !=0 && (reducedObject.gt_10s += value.gt_10s);
                    value.gt_5s !=0 && (reducedObject.gt_5s += value.gt_5s);
                    value.gt_2s !=0 && (reducedObject.gt_2s += value.gt_2s);
                });

                //reducedObject.gt_2s_rate = (reducedObject.gt_2s / reducedObject.count * 100).toFixed(2) + '%';
                //reducedObject.gt_5s_rate = (reducedObject.gt_5s / reducedObject.count * 100).toFixed(2) + '%';
                //reducedObject.gt_10s_rate = (reducedObject.gt_10s / reducedObject.count * 100).toFixed(2) + '%';

                //if (reducedObject.gt_2s > 0 || reducedObject.gt_5s > 0 || reducedObject.gt_10s > 0) {
                return reducedObject;
                //}
            };
            o.query = {};

            if (sSearch && sSearch !== '') {
                o.query.OPERATE_NAME = new RegExp('.*'+sSearch+'.*','i');
            }

            o.query.timestamp = {
                $gte: startstamp,
                $lt: endstamp
            };

            var table = db.model(chartConfig.schemaName, collectionName);

            table.mapReduce(o, function(err, rows){

                res.send(rows);
            });

        }
    });
};
