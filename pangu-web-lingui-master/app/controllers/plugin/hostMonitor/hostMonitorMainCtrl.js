var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var db = require('../../connectFactory').getConnection('tuxedoDb');
var query = require('../../dbQuery');
var logger = require('../../log').logger;
var extend = require('extend');
var hostConfig = require('../../plugin_config/hubei/hostMonitor/config_HostMonitor');
var async = require('async');
var auth = require('../../auth');

function returnCountFunc(model, option, owner) {
  return function countFunc(cb) {
    model.count(option).exec(function execute(err, rst) {
      if (err) {
        cb(err);
      }
      rst = [owner, rst];
      cb(null, rst);
    });
  };
}

function returnQueryFunc(model, targer, item, action) {
  return function queryFunc(cb) {
    model.find(targer, item).exec(function execute(err, rst) {
      if (err) {
        cb(err);
      }
      if (action) {
        rst.push(action);
      }
      cb(null, rst);
    });
  };
}

module.exports = function hostMonitorMainCtrlCtrl(app) {
  app.get('/hostMonitor/hostMain.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var module = req.query.module;
    var modules = hostConfig.modules;

    res.renderPjax('plugin/hostMonitor/hostMain.html', {
      date: date,
      chartList: chartList,
      module: module,
      modules: modules
    });
  });

  app.get('/hostMonitor/loadModules', auth.requiresLogin, function router(req, res) {
    var chartList = req.query.chartList;
    var modules = hostConfig.modules;
    var hostList = hostConfig.hostList;
    var list = hostConfig.list[chartList].summaryStatus;
    var config = hostConfig.config[list.mode + list.type + list.subtype];
    var module = req.query.module || modules[0][0];
    var hosts = hostList[module];

    var tblName = query.getTableName(list.mode, list.type, config.scope[0], '');
    var option;
    var model = db.model('HostMonitor', tblName);
    var tasks = [];
    var output;

    Object.keys(hostList).forEach(function each(key) {
      option = {
        _id: { $in: hostList[key] },
        $or: [{ CPU_STATUS: 1 }, { RSZ_STATUS: 1 }, { SWAP_STATUS: 1 }, { DISK_STATUS: 1 }, { DIR_STATUS: 1 }]
      };
      tasks.push(returnCountFunc(model, option, key));
    });


    tasks.push(function totalFunc(cb) {
      model.count({ _id: { $in: hosts } }).exec(function execute(err, rst) {
        if (err) {
          cb(err);
        }
        rst = [module, rst];
        cb(null, rst);
      });
    });
    async.series(tasks, function getResults(err, results) {
      if (err) {
        logger.err(err);
        res.send(output);
      }
      output = {
        moduleData: results.pop(),
        modulesData: results,
        hosts: hosts
      };
      output.modulesData.forEach(function each(item) {
        if (item[0] === output.moduleData[0]) {
          output.moduleData.push(item[1]);
        }
      });
      return res.send(output);
    });
  });

  app.get('/hostMonitor/loadHosts', auth.requiresLogin, function router(req, res) {
    var chartList = req.query.chartList;
    var modules = hostConfig.modules;
    var hostList = hostConfig.hostList;

    var list = hostConfig.list[chartList].summaryStatus;
    var config = hostConfig.config[list.mode + list.type + list.subtype];
    var listCpu = hostConfig.list[chartList].currCpu;
    var configCpu = hostConfig.config[listCpu.mode + listCpu.type + listCpu.subtype];
    var listMem = hostConfig.list[chartList].currMem;
    var configMem = hostConfig.config[listMem.mode + listMem.type + listMem.subtype];
    var listDisk = hostConfig.list[chartList].currDisk;
    var configDisk = hostConfig.config[listDisk.mode + listDisk.type + listDisk.subtype];
    var listDir = hostConfig.list[chartList].currDir;
    var configDir = hostConfig.config[listDir.mode + listDir.type + listDir.subtype];

    var module = req.query.module || modules[0][0];
    var hosts = hostList[module];
    var host = req.query.host || hosts[0];

    var tasks = [];

    var tblName = query.getTableName(list.mode, list.type, config.scope[0], '');
    var tblCpu = query.getTableName(listCpu.mode, listCpu.type, configCpu.scope[0], '');
    var tblMem = query.getTableName(listMem.mode, listMem.type, configMem.scope[0], '');
    var tblDisk = query.getTableName(listDisk.mode, listDisk.type, configDisk.scope[0], '');
    var tblDir = query.getTableName(listDir.mode, listDir.type, configDir.scope[0], '');
    var option;

    var model = db.model('HostMonitor', tblName);
    var modelCpu = db.model('HostMonitor', tblCpu);
    var modelMem = db.model('HostMonitor', tblMem);
    var modelDisk = db.model('HostMonitor', tblDisk);
    var modelDir = db.model('HostMonitor', tblDir);

    var output = {};

    hosts.forEach(function each(ip) {
      tasks.push(returnQueryFunc(model,
          { _id: new RegExp(ip) },
          { CPU_STATUS: 1, RSZ_STATUS: 1, SWAP_STATUS: 1, DISK_STATUS: 1, DIR_STATUS: 1 }
      ));
    });

    option = { _id: new RegExp(host) };
    tasks.push(returnQueryFunc(modelCpu, option, { STATUS: 1, RATE: 1, _id: 0 }, 'cpu'));
    tasks.push(returnQueryFunc(modelMem, option,
        { RSZ_STATUS: 1, SWAP_STATUS: 1, RSZ_SIZE: 1, RSZ_USED: 1, SWAP_SIZE: 1, SWAP_USED: 1, _id: 0 }, 'mem'));
    tasks.push(returnQueryFunc(modelDisk, option, { RATE: 1, STATUS: 1, _id: 0 }, 'disk'));
    tasks.push(returnQueryFunc(modelDir, option, { RATE: 1, STATUS: 1, _id: 0 }, 'dir'));

    async.series(tasks, function getResults(err, results) {
      var i;
      var len;
      var result;
      var arr;
      var key;
      if (err) {
        logger.err(err);
        res.send(output);
      }
      output.hostsData = [];
      output.hostData = { host: host };
      for (i = 0, len = hosts.length; i < len; i++) {
        result = results[i][0];
        arr = [];
        arr.push(result._id);
        arr.push(
            result.CPU_STATUS || result.RSZ_STATUS || result.SWAP_STATUS || result.DISK_STATUS || result.DIR_STATUS
        );
        output.hostsData.push(arr);
      }
      for (i, len = results.length; i < len; i++) {
        result = results[i];
        key = result.pop();

        if (key === 'cpu') {
          output.hostData.cpu = {
            total: 100,
            adverse: result[0].RATE,
            status: result[0].STATUS
          };
        }

        if (key === 'mem') {
          output.hostData.rsz = {
            total: result[0].RSZ_SIZE,
            adverse: result[0].RSZ_USED,
            status: result[0].RSZ_STATUS
          };
          output.hostData.swap = {
            total: result[0].SWAP_SIZE,
            adverse: result[0].SWAP_USED,
            status: result[0].SWAP_STATUS
          };
        }

        if (key === 'disk') {
          output.hostData.disk = { total: result.length, adverse: 0, status: 0 };
          result.forEach(function each(item) {
            if (item.STATUS !== 0) {
              output.hostData.disk.adverse++;
              output.hostData.disk.status = 1;
            }
          });
        }

        if (key === 'dir') {
          output.hostData.dir = { total: result.length, adverse: 0, status: 0 };
          result.forEach(function each(item) {
            if (item.STATUS !== 0) {
              output.hostData.dir.adverse++;
              output.hostData.dir.status = 1;
            }
          });
        }
      }
      res.send(output);
    });
  });
};
