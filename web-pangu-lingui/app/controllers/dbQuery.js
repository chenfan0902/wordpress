/* eslint no-param-reassign: 0 */
/* eslint global-require: 0 */
var debug = require('debug')('pangu:query');
var logger = require('./log').logger;
var env = process.env.NODE_ENV || 'development';
var redisCfg = require('../../config/config')[env].redisCluster;
var redis = require('ioredis');
var client = new redis.Cluster(redisCfg.nodes, { password: redisCfg.password });
var mongoose = require('./connectFactory').getConnection('tuxedoDb');
// var async = require('async');
// var mongoose = require('mongoose');

var getTabName = function getTabName(tab, date, ind, len) {
  var mode = tab.mode;
  var type = tab.type;
  var subtype = tab.subtype;
  var time;
  var day;
  var tabName;

  if (!mode || !type || !subtype || !date) throw new Error('参数不全');
  time = date.split('-');
  day = time[0]
      + (time[1].length < 2 ? '0' + time[1] : time[1])
      + (time[2].length < 2 ? '0' + time[2] : time[2]);
  if (ind > 0) {
    len = len && len || (day.length - ind);
    // len = len ? len : day.length - ind;
  }

  tabName = mode + type + subtype + (ind > 0 ? day.substr(ind, len) : day);
  return tabName;
};

var getTableName = function getTableName(mode, type, scope, value, param) {
  var dt;
  var YY;
  var MM;
  var DD;
  var HH;
  var YYYY;
  var arr;
  var i;
  var collection;
  if (!mode || !type || !scope) throw new Error('参数不全');

  if (typeof value === 'object') {
    param = value;
    value = null;
  }
  if (!value) {
    dt = new Date('2013-06-18'); // debug
  } else {
    dt = new Date(value);
  }

  YY = ('00' + dt.getFullYear() % 100).substr(-2);
  MM = ('00' + (dt.getMonth() + 1)).substr(-2);
  DD = ('00' + dt.getDate()).substr(-2);
  HH = ('00' + dt.getHours()).substr(-2);
  YYYY = dt.getFullYear();
  if (scope === 'hours') value = YY + MM + DD + HH;
  if (scope === 'day') value = YY + MM + DD;
  if (scope === 'month') value = YY + MM;
  if (scope === 'year') value = YY;
  if (param) {
    arr = scope.split(',');
    value = '';
    for (i = 0; i < arr.length; i++) {
      param[arr[i]] !== undefined && (value += '_' + param[arr[i]]); //eslint-disable-line
    }
    value += '_' + YY + MM + DD;
    scope = arr.join('');
  }

  collection = '';
  if (scope === 'noHave') {
    collection = mode + type + value.replace(/-/g, '');
  } else if (scope === 'fullSuffix') {
    collection = mode + type + value.replace(/-/g, '');
  } else if (scope === 'suffix') {
    if (value.length !== 10) {
      value = YYYY + '-' + MM + '-' + DD;
    }
    collection = mode + type + value.replace(/-/g, '').substr(2);
  } else {
    collection = mode + type + scope.toUpperCase() + value;
  }
  debug('collection:%s.', collection);

  return collection;
};

var getTable = function getTable(mode, type, scope, value, dbCon, model) {
  var table;
  var selfMDB = require('./connectFactory').getConnection(dbCon || 'tuxedoDb');
  var collection = getTableName(mode, type, scope, value);
  debug('collection:%s.', collection);
  try {
    table = selfMDB.model(model || 'QueryResult', collection);
  } catch (e) {
    logger.error(e.stack);
    throw new Error('not found');
  }
  logger.debug('tuxedoDb collection=%s', collection);
  return table;
};

// limit 查询记录数,可选参数,不传则使用config.limit||0
exports.multiQuery = function multiQuery(list, config, limit, callback) {
  var count = 0;
  var mode;
  var type;
  var value;
  var subtype;
  var scope;
  var i;
  var j;
  var cfg;
  var idx;
  var result = {};
  var dbCon;
  var model;

  if (typeof limit === 'function') {
    callback = limit;
    limit = false;
  }

  // 统计个数
  for (i = 0, j = list.length; i < j; ++i) {
    mode = list[i].mode;
    type = list[i].type;
    value = list[i].value || false;
    subtype = list[i].subtype || '';

    cfg = config[mode + type + subtype];

    if (!cfg) throw new Error('not found');

    for (idx in cfg.scopes) { //eslint-disable-line
      scope = cfg.scopes[idx];
      if (!list[i].scope || list[i].scope === scope) {
        ++count;
      }
    }
  }

  for (i = 0, j = list.length; i < j; ++i) {
    mode = list[i].mode;
    type = list[i].type;
    value = list[i].value || false;
    subtype = list[i].subtype || '';

    cfg = config[mode + type + subtype];
    if (limit) {
      cfg.limit = limit;
    }

    if (!cfg) throw new Error('not found');

    for (idx in cfg.scopes) { //eslint-disable-line
      scope = cfg.scopes[idx];
      dbCon = list[i].dbCon || cfg.dbCon;
      model = cfg.model;
      if (!list[i].scope || list[i].scope === scope) {
        getTable(mode, type, scope, value, dbCon, model)
        .list(cfg, (function(mode, type, subtype, scope, cfg, result) { //eslint-disable-line
          return function gtlcb(err, docs) {
            --count;

            if (docs) {
              result[mode + type + subtype] = result[mode + type + subtype] || cfg;
              result[mode + type + subtype][scope] = docs;
            }
            if (err) {
              result[mode + type + subtype] = result[mode + type + subtype] || cfg;
              result[mode + type + subtype][scope] = { error: err };
            }

            if (!count) {
              callback(null, result);
            }
          };
        })(mode, type, subtype, scope, cfg, result));
      }
    }
  }
};

// redis query
exports.redisMQuery = function redisMQuery(list, config, limit, callback) {
  var count = 0;
  var i;
  var j;
  var mode;
  var type;
  var value;
  var subtype;
  var idx;
  var cfg;
  var result = {};
  var scope;
  var tabname;
  // var cfgSort;
  var sortMax;
  var redStart;
  var redEnd;
  var rsi;

  if (typeof limit === 'function') {
    callback = limit;
    limit = false;
  }

  // 统计个数
  for (i = 0, j = list.length; i < j; ++i) {
    mode = list[i].mode;
    type = list[i].type;
    value = list[i].value || false;
    subtype = list[i].subtype || '';

    cfg = config[mode + type + subtype];

    if (!cfg) throw new Error('not found');

    for (idx in cfg.scopes) { //eslint-disable-line
      scope = cfg.scopes[idx];
      if (!list[i].scope || list[i].scope === scope) {
        ++count;
      }
    }
  }

  for (i = 0, j = list.length; i < j; ++i) {
    mode = list[i].mode;
    type = list[i].type;
    value = list[i].value || false;
    subtype = list[i].subtype || '';

    cfg = config[mode + type + subtype];
    if (limit) {
      cfg.limit = limit;
    }

    if (!cfg) throw new Error('not found');

    for (idx in cfg.scopes) { //eslint-disable-line
      scope = cfg.scopes[idx];

      if (!list[i].scope || list[i].scope === scope) {
        logger.debug('subtype=%s', subtype);
        tabname = getTableName(mode, type, scope, value);
        // cfgSort = cfg.sort;
        sortMax = false;
        for(var key in cfg.sort){ //eslint-disable-line
          if (cfg.sort[key] === -1) {
            sortMax = true;
          }
        }
        // redStart = sortMax && -(cfg.limit && cfg.limit || 10) || 0;
        redStart = sortMax ? -(cfg.limit ? cfg.limit : 10) : 0;
        // redEnd = sortMax ? -1 : (cfg.limit ? cfg.limit : 10);
        redEnd = sortMax && -1 || (cfg.limit && cfg.limit || 10);
        client.zrange([
          tabname,
          redStart,
          redEnd
        ], (function(mode, type, subtype, scope, cfg, result) { //eslint-disable-line
          return function czrcb(err, docs) {
            var redisRet = [];
            if (sortMax) {
              for (rsi = docs.length - 1; rsi >= 0; rsi--) {
                redisRet.push(JSON.parse(docs[rsi]));
              }
            } else {
              for (rsi = 0; rsi < docs.length; rsi++) {
                redisRet.push(JSON.parse(docs[rsi]));
              }
            }
            --count;

            if (docs) {
              result[mode + type + subtype] = result[mode + type + subtype] || cfg;
              result[mode + type + subtype][scope] = redisRet;
            }
            if (err) {
              result[mode + type + subtype] = result[mode + type + subtype] || cfg;
              result[mode + type + subtype][scope] = { error: err };
            }

            if (!count) {
              callback(null, result);
            }
          };
        })(mode, type, subtype, scope, cfg, result));
      }
    }
  }
};

exports.getTab = function getTab(model, tab, date, ind, len) {
  var mode = tab.mode;
  var type = tab.type;
  var subtype = tab.subtype;
  var tabName;
  var table = null;

  if (!mode || !type || !subtype || !date || !model) throw new Error('参数不全');

  tabName = getTabName(tab, date, ind, len);

  try {
    table = mongoose.model(model, tabName);
  } catch (e) {
    logger.error(e.stack);
    throw new Error('not found');
  }

  return table;
};

exports.getTable = getTable;
exports.getTabName = getTabName;
exports.getTableName = getTableName;
