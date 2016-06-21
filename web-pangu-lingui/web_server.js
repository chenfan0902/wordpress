/* eslint global-require: 0 */
var express = require('express');
var fs = require('fs');
// var cluster = require('cluster');
// var numCPUs = require('os').cpus().length;
var logger = require('./app/controllers/log').logger;
var connectFactory = require('./app/controllers/connectFactory');
var program = require('commander');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var schedule = require('node-schedule');
var cmdParams = config.params || [];
var app = express();
var db = {};
var scheduleList = [];
var scheduleInit = {};
var PORT;

/**
 * @wanzhou
 * next 7 lines, parse commander params from config.params
 */
program.version('0.0.1');
cmdParams.forEach(function loopFunc(item) {
  if (item.param) {
    program.option(item.param, item.commit || 'asiainfo default info.');
  }
});
program.parse(process.argv);

function returnQueryUrl(port, dbs, auth, host, user, passwd) {
  var a = auth || false;
  if (!a) {
    return 'mongodb://' + user + ':' + passwd + '@' + host + ':' + port + '/' + dbs;
  }
  return 'mongodb://' + host + ':' + port + '/' + dbs;
}

function noop() {} // eslint-disable-line

function loadPlugin(path, type, application) {
  var tmp;
  if (fs.statSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function loopFunc(item) {
      loadPlugin(path + '/' + item, type, application);
    });
  } else if (path.slice(-3) === '.js' && !~path.indexOf('.swp')) {
    tmp = require(path);
    if (application) {
      tmp(application);
    }
    switch (type) {
      case 'schedule':
        scheduleList.push([
          path,
          schedule.scheduleJob(tmp.cron || '0 0 10 * * *',
              tmp.getReloadFunc(connectFactory.getConnection(tmp.dbName || 'tuxedoDb')))
        ]);
        break;
      case 'schedule-init':
        // logger.info('====', tmp.dbName, tmp.initialize, tmp.getDbName);
        if (scheduleInit[tmp.dbName || 'tuxedoDb'] === undefined) {
          scheduleInit[tmp.dbName || 'tuxedoDb'] = [];
        }
        scheduleInit[tmp.dbName || 'tuxedoDb'].push(tmp.initialize);
        break;
      default:
    }
  }
}

Object.keys(config.db).forEach(function loopFunc(conDb) {
  var dbPort;
  if (!~config.db[conDb].port.indexOf('||')) {
    throw new Error('数据库连接配置有误，请检查配置！');
  }
  dbPort = program[config.db[conDb].port.split('||')[0]]
         || program[config.db[conDb].port.split('||')[1]]
         || config.db[conDb].port.split('||')[1];
  db[conDb] = returnQueryUrl(dbPort, config.db[conDb].db, program.noauth,
                             program.host || 'localhost', config.db[conDb].user,
                             config.db[conDb].passwd);
});

app.set('db', db);
// logger.info('config db:', db);

loadPlugin('./app/schedule', 'schedule-init');
// logger.info('schedule-init', scheduleInit);

app.set('schedule-init', scheduleInit);

// Bootstrap db connection
connectFactory.createConnection(app);

// Bootstrap models
loadPlugin(__dirname + '/app/models');

// express settings
require('./config/express')(app, config);

// plugin
loadPlugin(__dirname + '/app/controllers/plugin', null, app);

// Bootstrap routes
require('./config/routes')(app);

PORT = program.port || process.env.PORT || 3000;
app.listen(PORT);

/* server.on('connection', function(socket) {
    logger.debug("A new connection was made by a client");
    socket.setTimeout(30 * 1000);
    socket.on('end', function() {
        logger.debug("A  connection is end");
    });

});*/


logger.debug('pangu log analyse server started on port ' + PORT);

// expose app
exports = module.exports = app;
