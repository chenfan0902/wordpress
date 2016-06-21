var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var mongoose = require('mongoose');
var logger = require('../../../log').logger;
var qConfig = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').config;
var qList = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').list;
var hosts = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').hosts;
var extend = require('extend');
var query = require('../../../dbQuery');
var QueueAnalyze = require('../../../../models/queueanalyze');
var QueueDetail = require('../../../../models/queuedetail');
var auth = require('../../../auth');
var mutil = require('../../../util');
var async = require('async');
var db = require('../../../connectFactory').getConnection('tuxedoDb');

module.exports = function (app) {

    app.get('/tuxedo/queue/analyze.html', auth.requiresLogin, function(req, res) {

        var date = req.query.date,
            chartList = req.query['chartList'],
            chartBList = req.query['chartBList'],
            chart_list = qList[chartList][0],
            mConfig = qConfig[chart_list.mode+chart_list.type+chart_list.subtype];

        res.renderPjax('plugin/tuxedo/queue/analyze', {
            tabColNames: mConfig['titles'],
            hosts: hosts,
            value: date,
            chartList: chartList,
            chartBList: chartBList,
            title: mConfig['name']
        });
    });

    app.get('/queueAnalyzeDay', function(req, res) {

        var date = req.query.date;
        var tab = qConfig.anaListTab[0];
        var table = query.getTab('QueueAnalyze', tab, date, 2);
        table.find({}, function(err, rows) {
            console.log(rows);
            res.send({success: 1, data: rows});
        });
    });

    app.get('/queueAnalyzeDayPage', function(req, res) {
        var iDisplayStart = req.query.iDisplayStart | 0;
        var iDisplayLength = req.query.iDisplayLength | 10;
        var sEcho = req.query.sEcho;
        var sSearch = req.query.sSearch;
        var chartList = req.query['chartList'];
        var chartBList = req.query['chartBList'];
        var chart_list = qList[chartList][0];
        var mConfig = qConfig[chart_list.mode+chart_list.type+chart_list.subtype];
        var date = req.query['date'];
        var host = req.query['host'];
        var conf = {};
        conf.limit = iDisplayLength;
        conf.skip = iDisplayStart;
        //logger.debug('===',mConfig,'===')
        conf.sort = mConfig['sort'][0];

        //var tab = qConfig.anaListTab[0];
        //logger.debug('===',query.getTabName(chart_list, date, 2, 4),'===')
        var table = null;
        if("queueAnalyzeListDAY" == chartList) {
            table = query.getTab('QueueAnalyze', chart_list, date, 2);
        }else{
            table = query.getTab('QueueAnalyze', chart_list, date, 2, 4);
        }
        //logger.debug(table)
        var sum = 0;

        //logger.debug(date,hostMonitor)

        table.count({host: host}, function(err, count) {
            sum = count;
            var _q = {host: host};
            if (!!sSearch && sSearch != '') {
                try {
                    var reg = new RegExp('.*' + sSearch + '.*', 'i');
                }catch(e){
                }
                _q['$or'] = [{
                    server: reg
                }, {
                    queue: reg
                }];
            }
            table.find(_q, {
                _id: 0
            }, conf, function(err, rows) {
                res.send({
                    sEcho: sEcho,
                    iTotalRecords: iDisplayLength,
                    iTotalDisplayRecords: sum,
                    aaData: rows
                });
            });
        });

    });

    app.get('/getAnalyzeDayDetail', function(req, res) {
        var server = req.query.server;
        var queue = req.query.queue;
        var chartList = req.query.chartList;
        var chartBList = req.query.chartBList;
        var chart_blist = qList[chartBList][0];
        var dConfig = qConfig[chart_blist.mode+chart_blist.type+chart_blist.subtype];
        var date = req.query['date'];
        var host = req.query['host'];

        if( chartBList === 'queueAnalyzeMaxList'){
            var queryTable = function (table) {
                return function(callback){
                    table.find({name: server, queue: queue, host: host}, {_id:0, avg: 0}).sort({queued: -1}).limit(1).exec(function(err, docs){
                        //table.find({serve: server, queue: queue, hostMonitor: hostMonitor},function(err, docs){
                        if(err){
                            logger.error('===== analyzeCtrl ===', err.message);
                        }
                        docs && callback(null, docs[0]);
                    })
                };
            };
            var queryObj = {};
            var now = new Date().getTime();
            var today = mutil.formatDate(now, 'yyyy-MM-dd');
            var yyyymm = today.substring(0, 8);
            var startdate = yyyymm + '01';
            var cnt = (new Date(today).getTime() - new Date(startdate).getTime() ) / 1000 / 3600 / 24 + 1;
            for(var i=1; i<=cnt; i++){
                var dt = yyyymm + i;
                console.log(i, dt);
                var tmp = query.getTab('QueueDetail', chart_blist, dt, 0);
                queryObj[dt] = queryTable(tmp);
            }
            async.parallel(queryObj, function (err, results) {
                res.send(results);
            });
        }else {
            var table = query.getTab('QueueDetail', chart_blist, date, 0);

            table.find({
                host: host,
                name: server,
                queue: queue
            }, {
                _id: 0,
                ave: 0
            }, {}, function (err, rows) {
                res.send(rows);
            });
        }
    });

    app.get('/getAnalyzeLcu',function(req,res) {
        var name = req.query.name;
        var host = req.query.host;
        var value = req.query.date||'';
        var chartList = req.query.chartList;
        var chartBList = req.query.chartBList;
        var iDisplayStart = req.query.iDisplayStart | 0;
        var iDisplayLength = req.query.iDisplayLength | 10;
        var sEcho = req.query.sEcho;
        if(value == ''){
            var now = new Date().getTime();
            var dateCa = new Date(now);
            var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
            var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
            var year = dateCa.getFullYear();
            value = year+"-"+month+"-"+date;
        };
        //logger.info(value);
        var tabAnalyze = 'TuxStateBase' + mutil.formatDate(value, 'yyyyMMdd');
        var conf = {};
        logger.info(tabAnalyze);
        conf.host = host;
        conf.SVRNAME = name;
        db.collection(tabAnalyze).distinct('TRANSCODE',conf, function(err, rows){
            var list = [];
            var cnt = 0;
            for(i in rows){
                var map = {};
                map["key"]= cnt;
                map["name"]=rows[i];
                list.push(map);
                cnt++;
            }
            var sum =cnt;
//            rows = JSON.stringify(list)
            res.send({
                sEcho: sEcho,
                iTotalRecords: iDisplayLength,
                iTotalDisplayRecords: sum,
                aaData: list
            });
        });
    });

};