var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var db = require('../../connectFactory').getConnection('tuxedoDb');
var query = require('../../dbQuery');
var logger = require('../../log').logger;
var extend = require('extend');
var hostConfig = require('../../plugin_config/hubei/hostMonitor/config_HostMonitor');
var async = require('async');
var auth = require('../../auth');
var util = require('../../util');

module.exports = function hostMonitorTabCtrl(app) {

  app.get('/hostMonitor/getTabDataOfDisk', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;

    var list = hostConfig.list[chartList].currDisk;
    var config = hostConfig.config[list.mode + list.type + list.subtype];
    var tbl = query.getTableName(list.mode, list.type, config.scope[0], '');

    var model = db.model('HostMonitor', tbl);
    var output = {
      aaData: []
    };
    var obj;
    var time;

    model.find({ _id: new RegExp(host) }, { _id: 0, TOPS: 0 }).exec(function execute(err, results) {
      results.forEach(function each(item) {
        time = new Date(item.TIME);
        time = util.formatDate(time, 'yyyy-MM-dd HH:mm:ss');
        obj = {
          mount: item.MOUNT,
          block: item.BLOCK,
          used: item.USED,
          free: item.FREE,
          rate: item.RATE,
          status: item.STATUS,
          time: time
        }
        output.aaData.push(obj);
      });
      res.send(output);
    });
  });

  app.get('/hostMonitor/hostDiskDetail.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;
    var mount = req.query.mount;

    res.renderPjax('plugin/hostMonitor/hostDiskDetail.html', {
      date: date,
      chartList: chartList,
      module: module,
      host: host,
      mount: mount
    });

  });

  app.get('/hostMonitor/getDiskDetailData', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;
    var mount = req.query.mount;
    var id = host + '`' + mount;

    var list = hostConfig.list[chartList].currDisk;
    var config = hostConfig.config[list.mode + list.type + list.subtype];
    var tblName = query.getTableName(list.mode, list.type, config.scope[0], '');

    var model = db.model('HostMonitor', tblName);
    var output = {};

    model.find({ _id: id }).exec(function execute(err, results) {
      output = results[0];
      res.send(output);
    });

  });

};