var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('tuxedoDb')
   ,logger = require('../../../log').logger
   ,barCfg = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/tuxCalled/config_lcusvrcalled').barConfig
   ,barList = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/tuxCalled/config_lcusvrcalled').barList
   ,extend = require('extend')
   ,query = require('../../../dbQuery')
   ,hosts = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').hosts;
var auth = require('../../../auth');

module.exports = function (app) {

    app.get('/tuxedo/lcu/svrCalled.html', auth.requiresLogin, function(req, res){
        var date = req.query.date
            , chartList = req.query.chartList
            , chartlist = barList[chartList][0]
            , cConfig = barCfg[chartlist.mode+chartlist.type+chartlist.subtype];
        res.renderPjax('plugin/tuxedo/lcu/svrCalled',{
            value: date,
            chartList: chartList,
            headTitle: cConfig.name,
            scopeNames: cConfig.scopeNames[cConfig.scopes[0]],
            hosts: hosts,
            tabColNames: cConfig.tabColNames
        });
    });

    app.get('/getLcuSvrDistinct', function(req, res){
        var date = req.query.date
            , host = req.query.host
            , chartList = req.query.chartList
            , chartlist = barList[chartList][0]
            , cConfig = barCfg[chartlist.mode+chartlist.type+chartlist.subtype]
            , tablename = query.getTableName(chartlist.mode, chartlist.type, cConfig.scopes[0], date);

        var table = db.model(cConfig.schemaName, tablename)
            , conf = {};
        conf.host = host;
        table.distinct(cConfig.filterColNames[0], conf, function(err, rows){
            res.send(rows);
        });
    });

    app.get('/getLcuSvrAjaxData', function(req, res){
        var date = req.query.date
            , host = req.query.host || "10.161.2.107_tuxapp1"
            , key = req.query.key
            , chartList = req.query.chartList
            , chartlist = barList[chartList][0]
            , cConfig = barCfg[chartlist.mode+chartlist.type+chartlist.subtype]
            , tablename = query.getTableName(chartlist.mode, chartlist.type, cConfig.scopes[0], date);

        var table = db.model(cConfig.schemaName, tablename)
            , conf = {};
        conf.host = host;
        conf[cConfig.filterColNames[0]] = key;
        table.find(conf, cConfig.colNames).sort(cConfig.sort).exec(function(err, rows){
            res.send(rows);
        });
    });
};