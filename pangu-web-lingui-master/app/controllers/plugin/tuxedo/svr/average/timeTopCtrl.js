var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../../config/config')[env];
var db = require('../../../../connectFactory').getConnection('tuxedoDb');
var logger = require('../../../../log').logger;
var aConfig = require('../../../../plugin_config/'+sysConfig.province+'/tuxedo/svr/average/config_timeTop').config;
var aList = require('../../../../plugin_config/'+sysConfig.province+'/tuxedo/svr/average/config_timeTop').list;
var extend = require('extend');
var query = require('../../../../dbQuery');
var cHosts = require('../../../../plugin_config/'+sysConfig.province+'/config_hosts');
var auth = require('../../../../auth');
var mutil = require('../../../../util');
var async = require('async');

module.exports = function (app) {

    function returnQueryFnc(mode, type, scope, date, host, sort) {
        var tabname = '';
        if (scope === 'yyyyMMdd') {
            tabname = mode + type + mutil.formatDate(date, 'yyyyMMdd');
        } else {
            tabname = query.getTableName(mode, type, scope, date);
        }
        var table = db.model('QueryResult', tabname);
        return function (cb) {
            table.aggregate([
                {$match: {host: host}},
                {$group: {_id: "$SVRNAME", AVERAGE: {$max: "$AVERAGE"}}}
            ]).exec(cb);
            //table.find({hostMonitor: hostMonitor},{SVRNAME:1, AVERAGE: 1, _id:0}).sort(sort).limit(10).exec(cb);
        }
    }

    app.get('/tuxedo/svr/average/timeTop.html', auth.requiresLogin, function (req, res) {
        var chartList = req.query.chartList;
        var date = req.query.date;
        var list = aList[chartList][0];
        var config = aConfig[list.mode + list.type + list.subtype];
        var queryObj = {};

        config.hosts.forEach(function (item) {
            queryObj[item] = returnQueryFnc(list.mode, list.type, config.scopes[0], date, item, config.sort);
        });

        async.parallel(queryObj, function (err, results) {
            var resArr = {};
            config.hosts.forEach(function(host){
                resArr[host] = results[host].sort(function compare(a, b) {
                    return b.AVERAGE - a.AVERAGE;
                }).slice(0,10);
            });
            async.apply(render, resArr)();
        });
        var render = function (docs) {
            res.renderPjax('plugin/tuxedo/svr/average/timeTop', {
                headTitle: config.headTitle,
                chartList: chartList,
                hosts: config.hosts,
                date: date,
                all: docs
            });
        };
    });

    app.get('/tuxedo/svr/average/timeDetail.html', auth.requiresLogin, function (req, res) {
        var chartList = req.query.chartList;
        var host = req.query.host;
        var date = req.query.date;
        var list = aList[chartList][0];
        var config = aConfig[list.mode + list.type + list.subtype];

        var tabname = '';
        if (config.scopes[0] === 'yyyyMMdd') {
            tabname = list.mode + list.type + mutil.formatDate(date, 'yyyyMMdd');
        } else {
            tabname = query.getTableName(list.mode, list.type, config.scopes[0], date);
        }
        var table = db.model('QueryResult', tabname);
        table.aggregate([
            {$match: {host: host}},
            {$group: {_id: "$SVRNAME", AVERAGE: {$max: "$AVERAGE"}}}
        ]).exec(function (err, docs) {
            var result = docs.sort(function compare(a, b) {
                return b.AVERAGE - a.AVERAGE;
            });
            async.apply(render, result)();
        });

        var render = function (docs) {
            res.renderPjax('plugin/tuxedo/svr/average/timeTopDetail', {
                headTitle: config.headTitle,
                chartList: chartList,
                date: date,
                host: host,
                all: docs
            });
        };
    });

    app.get('/tuxedo/svr/average/timeGraph.html', auth.requiresLogin, function (req, res) {
        var chartList = req.query.chartList;
        var host = req.query.host;
        var SVRNAME = req.query.SVRNAME;
        var date = req.query.date;
        var list = aList[chartList][0];
        var config = aConfig[list.mode + list.type + list.subtype];
        res.renderPjax('plugin/tuxedo/svr/average/timeTopGraph', {
            headTitle: config.headTitle,
            chartList: chartList,
            date: date,
            host: host,
            SVRNAME: SVRNAME
        });
    });

    app.get('/getSvrAverageTimeGraphData', auth.requiresLogin, function (req, res) {
        var chartList = req.query.chartList;
        var host = req.query.host;
        var SVRNAME = req.query.SVRNAME;
        var date = req.query.date;
        var list = aList[chartList][0];
        var config = aConfig[list.mode + list.type + list.subtype];
        var tabname = '';
        if (config.scopes[0] === 'yyyyMMdd') {
            tabname = list.mode + list.type + mutil.formatDate(date, 'yyyyMMdd');
        } else {
            tabname = query.getTableName(list.mode, list.type, config.scopes[0], date);
        }
        var table = db.model('QueryResult', tabname);
        console.log(tabname, host, SVRNAME);
        table.find({host: host, SVRNAME: SVRNAME}, {_id: 0, timestamp: 1, AVERAGE: 1}, function (err, rows) {
            res.send([]);
        });
    });
};