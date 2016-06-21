/**
 * Created by wanzhou on 15/9/25.
 */
var logger = require('./log').logger;
var db = require('./connectFactory').getConnection('cmdDb');
var async = require('async');

var parseCommander = function parseCommander(cmd, data) {
  var expr;
  var path;
  var obj;
  var i;
  while (/\[:data\.(\w+)]/.test(cmd)) {
    expr = RegExp.$1;
    path = expr.split('.');
    obj = data;
    for (i = 0; i < path.length; ++i) {
      obj = obj[path[i]];
    }
    if (!obj) {
      obj = '';
    }
    cmd = cmd.replace(/\[:data\.(\w+)]/, obj);// eslint-disable-line
  }

  while (/<:data\.(\w+)>/.test(cmd)) {
    expr = RegExp.$1;
    path = expr.split('.');
    obj = data;
    for (i = 0; i < path.length; ++i) {
      obj = obj[path[i]];
    }
    if (!obj) {
      logger.error('参数错误，命令中必须传递的参数值不存在！');
    }
    cmd = cmd.replace(/<:data\.(\w+)>/, obj);// eslint-disable-line
  }
  return cmd;
};

var getCommander = function getCommander(user, host, data, fn) {
  var cmdType = data.cmdType;
  var cmdId = data.cmdId;
  async.auto({
    getRoleCnt: function getRoleCnt(callback) {
      db.collection('userCommandRole')
        .count({ user_name: user, role: cmdType, host: { $in: ['*', host] } },
        function cbfunc(err, cntall) {
          if (err) {
            logger.error('==== Commandar.js Async getCmdRole ====', err);
          } else {
            callback(null, cntall);
          }
        });
    },
    getCmd: ['getRoleCnt', function getCmd(callback, result) {
      if (result.getRoleCnt >= 1) {
        db.collection('roleCommandRight')
          .find({ role: cmdType, cmdId: cmdId }, { _id: 0, cmd: 1 })
          .toArray(function arrfunc(err, rows) {
            var cmd;
            if (err || !rows[0].cmd) {
              logger.error('==== Commandar.js Async getCmd ====', err);
            } else {
              cmd = parseCommander(rows[0].cmd, data);
              callback(null, cmd);
            }
          });
      } else {
        callback('Failed to authenticate!');
      }
    }]
  }, function rstfunc(err, results) {
    if (err) {
      logger.error('==== Commandar.js Error ====', err);
      fn(err, null);
    } else {
      fn(null, results.getCmd);
    }
  });
};

exports.parseCommander = parseCommander;
exports.getCommander = getCommander;
