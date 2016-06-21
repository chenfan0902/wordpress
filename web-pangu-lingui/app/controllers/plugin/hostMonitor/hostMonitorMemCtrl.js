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

  app.get('/hostMonitor/getTabDataOfMem', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;

    var hostList = hostConfig.hostList[module];
    var hosts = hostList.join('|');

    var currList = hostConfig.list[chartList].currMem;
    var currConfig = hostConfig.config[currList.mode + currList.type + currList.subtype];
    var currTbl = query.getTableName(currList.mode, currList.type, currConfig.scope[0], '');

    var weeklyList = hostConfig.list[chartList].weeklyMem;
    var weeklyConfig = hostConfig.config[weeklyList.mode + weeklyList.type + weeklyList.subtype];
    var weeklyTbl = query.getTableName(weeklyList.mode, weeklyList.type, weeklyConfig.scope[0], '');

    var currModel = db.model('HostMonitor', currTbl);
    var weeklyModel = db.model('HostMonitor', weeklyTbl);

    var output = {
      curr: {},
      week: {}
    };
    var week = {};
    var id;
    var hour;

    async.series([
      function queryWeekly(cb) {
        weeklyModel.find({ _id: new RegExp(hosts) })
            .sort({ STAMP: 1 })
            .exec(function execute(err, rst) {
              if (err) {
                logger.error(err);
                cb(err);
              }
              cb(null, rst);
            });
      },
      function queryCurrent(cb) {
        currModel.find({ _id: host }, { _id: 0, TIME: 0, STATUS: 0 })
            .exec(function execute(err, rst) {
              if (err) {
                logger.error(err);
                cb(err);
              }
              cb(null, rst);
            });
      }
    ], function getResults(err, results) {
      output.curr = results.pop()[0];
      results[0].forEach(function each(result) {
        id = result._id.split('`')[0];
        hour = new Date(result.STAMP);
        if (week[id] === undefined) {
          week[id] = {
            swapMin: [],
            swapMax: [],
            swapAvg: [],
            rszMin: [],
            rszMax: [],
            rszAvg: [],
            xAxis: []
          };
        }
        week[id].swapMin.push(result.SWAP_MIN);
        week[id].swapMax.push(result.SWAP_MAX);
        week[id].swapAvg.push((result.SWAP_TOTAL / result.COUNT).toFixed(2) - 0);
        week[id].rszMin.push(result.RSZ_MIN);
        week[id].rszMax.push(result.RSZ_MAX);
        week[id].rszAvg.push((result.RSZ_TOTAL / result.COUNT).toFixed(2) - 0);
        week[id].xAxis.push(
            hour.getMonth() + 1 + '/' + hour.getDate() + ' ' + hour.getHours() + ':00'
        );
      });
      output.week = week;
      res.send(output);
    });
  });

  app.get('/hostMonitor/getMemHoursData', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;
    var hour = req.query.hour;
    hour = hour.replace(/\s/, '/' + new Date(date).getFullYear() + ' ');

    var hoursList = hostConfig.list[chartList].hoursMem;
    var hoursConfig = hostConfig.config[hoursList.mode + hoursList.type + hoursList.subtype];
    var hoursTbl = query.getTableName(hoursList.mode, hoursList.type, hoursConfig.scope[0], hour);
    var hoursModel = db.model('HostMonitor', hoursTbl);
    logger.debug(hoursTbl);
    var output = {
      swap: [],
      rsz: [],
      xAxis: []
    };

    hoursModel.find({ _id: new RegExp(host) }, { TIME: 0, RSZ_STATUS: 0, SWAP_STATUS: 0 })
        .sort({ TIME: 1 })
        .exec(function execute(err, results) {
          results.forEach(function each(result) {
            output.swap.push(result.SWAP_RATE);
            output.rsz.push(result.RSZ_RATE);
            output.xAxis.push(result._id.split('`')[1] + ':00');
          });
          hour = new Date(hour);
          output.time = hour.getFullYear() + '年' + (hour.getMonth() + 1) + '月'
              + hour.getDate() + '日 ' + hour.getHours() + ':00:00';
          res.send(output);
        });
    });
};
