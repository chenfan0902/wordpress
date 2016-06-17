var debug = require('debug')('pangu:top');
var util = require('util');
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../config/config')[env];
var config = require('./config/' + sysConfig.province + '/config_top').cfgDetail;
var cfgTop = require('./config/' + sysConfig.province + '/config_top').cfgTop;
var query = require('./dbQuery');
var extend = require('extend');
var redisCfg = require('../../config/config')[env].redisCluster;
var redis = require('ioredis');
var client = new redis.Cluster(redisCfg.nodes, { password: redisCfg.password });
var async = require('async');
var logger = require('./log').logger;
var province = require('./config/' + sysConfig.province + '/config_multi').province;
// var multiDbQuery = require('./dbQuery');

exports.initDetail = function initDetail(req, res, next) { //eslint-disable-line
  var mode = req.query.mode;
  var type = req.query.type;
  var scope = req.query.scope;
  var value = req.query.date;
  var subtype = req.query.subtype || '';
  var clientIp = req.query.clientIp || '';
  var dbCon;
  var queryUrl;

  var headTile = cfgTop[mode + type + subtype].name;
  if (scope === 'hours') headTile = headTile + '(时)';
  else if (scope === 'day') headTile = headTile + '(日)';
  else if (scope === 'month') headTile = headTile + '(月)';
  else if (scope === 'year') headTile = headTile + '(年)';

  dbCon = cfgTop[mode + type + subtype].db || 'tuxedoDb';

  queryUrl = '/topDetail.html?mode=' + mode + '&type=' + type + '&scope=' + scope
    + '&subtype=' + subtype + '&date=' + value + '&clientIp=' + clientIp + '&dbCon=' + dbCon;
  res.renderPjax('top/detail', {
    titles: config[mode + type + subtype].titles,
    queryUrl: queryUrl,
    headTile: headTile
  });
};

exports.lcuList = function lcuList(req, res) {
  var value = req.query.date;
  var list = [
    { mode: 'TuxState', type: 'CalledSumByLcu', subtype: '', value: value },
    { mode: 'CustservCalled', type: 'SumByIPDay', subtype: '', value: value },
    { mode: 'TuxState', type: 'AllTime', subtype: 'ByLcu', value: value }
  ];
  var list1 = [{ mode: 'TuxState', type: 'TimeOutTop', value: value }];
  /**
   * redisQuery ==> multiQuery 将原存于redis中的排名改到mongodb中
   */
  query.multiQuery(list1, cfgTop, 10, function mqcb(err, docs1) {
    query.multiQuery(list, cfgTop, 10, function mqcb1(err1, docs) {
      extend(true, docs, docs1);
      debug('doc:%s', util.inspect(docs));
      res.renderPjax('top/lcuList', { all: docs });
    });
  });
};

exports.svcList = function svcList(req, res) {
  var value = req.query.date;
  var list = [
    { mode: 'TuxState', type: 'AllTime', subtype: 'BySvr', value: value },
    { mode: 'TuxState', type: 'CalledSumBySvr', subtype: '', value: value },
    { mode: 'TuxState', type: 'FailedSumBySvr', subtype: '', value: value }
  ];


  query.multiQuery(list, cfgTop, 10, function mqcb(err, docs) {
    debug('doc:%s', util.inspect(docs));
    res.renderPjax('top/svcList', { all: docs });
  });
};


exports.detail = function detail(req, res, next) { //eslint-disable-line
  var mode = req.query.mode;
  var type = req.query.type;
  var scope = req.query.scope;
  var value = req.query.date;
  var subtype = req.query.subtype || '';
  var iDisplayStart = req.query.iDisplayStart;
  var iDisplayLength = req.query.iDisplayLength;
  var sSearch = req.query.sSearch;
  var dbCon = req.query.dbCon;
  var clientIp = req.query.clientIp || '';
  var table;
  var tabname;
  var filter;
  var render;
  var tempConfig = {};
  var iDisplayEnd;
  var sortMax;
  var key;
  var rsi;

  if (!iDisplayStart) iDisplayStart = 0;
  if (!iDisplayLength) iDisplayLength = 10;

  if (dbCon !== 'tuxedoDb' && dbCon !== undefined) {
    table = query.getTable(mode, type, scope, value, dbCon);
    tabname = query.getTableName(mode, type, scope, value);
  } else {
    table = query.getTable(mode, type, scope, value);
    tabname = query.getTableName(mode, type, scope, value);
  }

  type += subtype;

  if (!config[mode + type]) return next(new Error('not found'));

  extend(true, tempConfig, config[mode + type]);

  if (sSearch && sSearch !== '') {
    filter = {};
    if (tempConfig.filter) filter = tempConfig.filter;
    filter.$or = [];
    tempConfig.filterColNames.forEach(function tpfcn(col) {
      var obj = {};
      try {
        obj[col] = new RegExp(sSearch);
      } catch (e) {
        logger.debug('err=%s', e.message);
        // var sSearchTemp = /\sSearch/;
        obj[col] = /\sSearch/;
      }
      filter.$or.push(obj);
    });
    tempConfig.filter = filter;
  }

  if (clientIp !== '') {
    if (tempConfig.filter === undefined) {
      tempConfig.filter = {};
    }
    tempConfig.filter.ip = clientIp;
  }
  tempConfig.limit = iDisplayLength;
  tempConfig.skip = iDisplayStart;

  render = function tmpr(count, docs) {
    var output = {};
    var temp = [];
    output.sEcho = parseInt(req.query.sEcho); //eslint-disable-line
    output.iTotalRecords = count;
    output.iTotalDisplayRecords = count;
    output.aaData = [];

    docs && docs.forEach(function docsfe(item, idx) {
      tempConfig.colNames.forEach(function tccnfe(col) {
        if (col === '#') {
          temp.push(parseInt(iDisplayStart) + 1 + idx); //eslint-disable-line
        } else if (col === 'provinceCode') {
          temp.push(province[item[col]]);
        } else {
          temp.push(item[col]);
        }
      });
      output.aaData.push(temp);
      temp = [];
    });
    // var response = JSON.stringify(output);
    res.send(JSON.stringify(output));
  };

  /**
   * redisQuery ==> multiQuery 将原存于redis中的排名改到mongodb中
   */
  if (mode === 'TuxState' && type === 'TimeOutTopRedis' && (scope === 'day' || scope === 'month')) {
    iDisplayEnd = parseInt(iDisplayStart) + parseInt(iDisplayLength) - 1; //eslint-disable-line
    sortMax = false;
    for (key in tempConfig.sort) { //eslint-disable-line
      if (tempConfig.sort[key] === -1) {
        sortMax = true;
      }
    }
    async.parallel({
      docs: function docscb(callback) {
        if (sortMax) {
          client.zrevrange([tabname, iDisplayStart, iDisplayEnd], function czrcb(err, docs) {
            var redisRet = [];
            for (rsi = 0; rsi < docs.length; rsi++) {
              redisRet.push(JSON.parse(docs[rsi]));
            }
            callback(null, redisRet);
          });
        } else {
          client.zrange([tabname, iDisplayStart, iDisplayEnd], function czcb(err, docs) {
            var redisRet = [];
            for (rsi = 0; rsi < docs.length; rsi++) {
              redisRet.push(JSON.parse(docs[rsi]));
            }
            callback(null, redisRet);
          });
        }
      },
      count: function count(callback) {
        client.zcard([tabname], callback);
      }
    }, function rstfunc(err, results) {
      if (err) {
        logger.error(err);
      }
      render(results.count, results.docs);
    });
  } else {
    async.parallel({
      count: function count(callback) {
        table.getCount(tempConfig, function tgccb(cnt) {
          callback(null, cnt);
        });
      },
      docs: function docscb(callback) {
        table.list(tempConfig, callback);
      }
    }, function rstfunc(err, results) {
      if (err) {
        logger.error(err);
      }
      return render(results.count, results.docs);
    });
  }
};
