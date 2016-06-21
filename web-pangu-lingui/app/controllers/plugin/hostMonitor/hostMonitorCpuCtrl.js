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

  app.get('/hostMonitor/getTabDataOfCpu', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;

    var hostList = hostConfig.hostList[module];
    var hosts = hostList.join('|');

    var currList = hostConfig.list[chartList].currCpu;
    var currConfig = hostConfig.config[currList.mode + currList.type + currList.subtype];
    var currTbl = query.getTableName(currList.mode, currList.type, currConfig.scope[0], '');

    var weeklyList = hostConfig.list[chartList].weeklyCpu;
    var weeklyConfig = hostConfig.config[weeklyList.mode + weeklyList.type + weeklyList.subtype];
    var weeklyTbl = query.getTableName(weeklyList.mode, weeklyList.type, weeklyConfig.scope[0], '');

    var currModel = db.model('HostMonitor', currTbl);
    var weeklyModel = db.model('HostMonitor', weeklyTbl);

    var id;
    var output = {
      curr: {},
      week: {}
    };
    var week = {};
    var sDate;

    async.series([
      function queryWeekly(cb) {
        weeklyModel.find({ _id: new RegExp(hosts) }).sort({ STAMP: 1 }).exec(function execute(err, rst) {
          if (err) {
            logger.error(err);
            cb(err);
          }
          cb(null, rst);
        });
      },
      function queryCurr(cb) {
        currModel.find({ _id: host }, { _id: 0, RATE: 1, TIME: 1 }).exec(function execute(err, rst) {
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
        sDate = new Date(result.STAMP);
        if (week[id] === undefined) {
          week[id] = {
            avg: [],
            max: [],
            min: [],
            xAxis: []
          };
        }
        week[id].avg.push((result.SUMCPU / result.COUNT).toFixed(2) - 0);
        week[id].max.push(result.MAXCPU);
        week[id].min.push(result.MINCPU === 0 ? 0.01 : result.MINCPU);
        week[id].xAxis.push(
            sDate.getMonth() + 1 + '/' + sDate.getDate() + ' ' + sDate.getHours() + ':00'
        );
      });
      output.week = week;
      res.send(output);
    });
  });

  app.get('/hostMonitor/getCpuHoursData', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var host = req.query.host;
    var hour = req.query.hour;
    hour = hour.replace(/\s/, '/' + new Date(date).getFullYear() + ' ');

    var hoursList = hostConfig.list[chartList].hoursCpu;
    var hoursConfig = hostConfig.config[hoursList.mode + hoursList.type + hoursList.subtype];
    var hoursTbl = query.getTableName(hoursList.mode, hoursList.type, hoursConfig.scope[0], hour);
    var hoursModel = db.model('HostMonitor', hoursTbl);
    var output = {
      data: [],
      xAxis: []
    };

    hoursModel.find({ _id: new RegExp(host) }, { TIME: 0, STATUS: 0 })
        .sort({ TIME: 1 })
        .exec(function execute(err, results) {
          results.forEach(function each(result) {
            output.data.push(result.RATE);
            output.xAxis.push(result._id.split('`')[1] + ':00');
          });
          hour = new Date(hour);
          output.time = hour.getFullYear() + '年' + (hour.getMonth() + 1) + '月'
              + hour.getDate() + '日 ' + hour.getHours() + ':00:00';
          res.send(output);
        });
  });

}
