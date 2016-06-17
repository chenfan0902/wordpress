var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var db = require('../../connectFactory').getConnection('tuxedoDb');
var query = require('../../dbQuery');
var logger = require('../../log').logger;
var extend = require('extend');
var hostConfig = require('../../plugin_config/hubei/hostMonitor/config_HostMonitor');
var async = require('async');
var auth = require('../../auth');


module.exports = function hostMonitorTabCtrl(app) {
  app.get('/hostMonitor/hostTab.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;
    var action = req.query.action;


    res.renderPjax('plugin/hostMonitor/hostTab.html', {
      date: date,
      chartList: chartList,
      module: module,
      host: host,
      action: action
    });

  });

};