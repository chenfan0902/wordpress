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

  app.get('/hostMonitor/getTabDataOfDir', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;

    var list = hostConfig.list[chartList].currDir;
    var config = hostConfig.config[list.mode + list.type + list.subtype];
    var tbl = query.getTableName(list.mode, list.type, config.scope[0], '');

    var model = db.model('HostMonitor', tbl);
    var output = [];
    var time;

    model.find({ _id: new RegExp(host) }, { _id: 0, TOPS: 0 }).exec(function execute(err, results) {
      results.forEach(function each(item) {
        time = new Date(item.TIME);
        time = util.formatDate(time, 'yyyy-MM-dd HH:mm:ss');
        obj = {
          dir: item.DIR,
          dirSize: item.DIR_SIZE,
          vg: item.VG,
          vgSize: item.VG_SIZE,
          rate: (item.DIR_SIZE / item.VG_SIZE * 100).toFixed(2) - 0,
          status: item.STATUS,
          time: time

        }
        output.push(obj);
      });
      res.send(output);
    });
  });

  app.get('/hostMonitor/hostDirDetail.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;
    var dir = req.query.dir;

    res.renderPjax('plugin/hostMonitor/hostDirDetail.html', {
      date: date,
      chartList: chartList,
      module: module,
      host: host,
      dir: dir
    });
  });

  app.get('/hostMonitor/getDirDetailData', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;
    var dir = req.query.dir;
    var id = host + '`' + dir;

    var list = hostConfig.list[chartList].currDir;
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
