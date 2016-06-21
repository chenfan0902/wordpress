/* eslint no-param-reassign: [2, { "props": false }] */
// var mongoose = require('mongoose');
var debug = require('debug')('pangu:sum');
var util = require('util');
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../config/config')[env];
var query = require('./dbQuery');
var config = require('./config/' + sysConfig.province + '/config_sum').config;
var cfgList = require('./config/' + sysConfig.province + '/config_sum').list;
var logger = require('./log').logger;
var extend = require('extend');
var formatDate = require('./util').formatDate;

var formatNum = function formatNum(num) {
  if (num > 1000000000) return (num / 1000000000).toFixed(2) + 'G';
  if (num > 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num > 1000) return (num / 1000).toFixed(2) + 'K';
  return num;
};

var accumulate = function accumulate(data) {
  var key;
  var list;
  var scope;
  var count;
  for (key in data) { //eslint-disable-line
    scope = data[key].scopes[0];
    list = data[key][scope];
    if (list.error) continue;

    count = 0;

		for (var i in list) { //eslint-disable-line
			count += list[i]._count; //eslint-disable-line
		}

		data[key]._count = formatNum(count); //eslint-disable-line
    data[key].count = count;
  }
};

exports.list = function list(req, res) {
  var value = req.query.date || '';
  var tempConfig = {};
  var tempList = [];
  var chartList = req.query.chartList;
  var chart_list = cfgList[chartList];  //eslint-disable-line

  value = value === '' ? formatDate(null, 'yyyy-MM-dd') : formatDate(value, 'yyyy-MM-dd');

  extend(true, tempConfig, config);

  extend(true, tempList, chart_list);

  tempList.forEach(function loopfunc(item) {
    var filter = {};
    if (!item.value) {
      item.value = value;
    }

    if (tempConfig[item.mode + item.type + item.subtype].filter) {
      filter = tempConfig[item.mode + item.type + item.subtype].filter;
    }
    tempConfig[item.mode + item.type + item.subtype].filterColNames.forEach(function tc(col) {
      if (req.query[col]) {
        filter[col] = req.query[col];
      }
    });

    tempConfig[item.mode + item.type + item.subtype].filter = filter;
    tempConfig[item.mode + item.type + item.subtype].caculateDate = value;
    headTitle = tempConfig[item.mode + item.type + item.subtype].name;  //eslint-disable-line
    logger.debug('tempConfig.filter=%s', JSON.stringify(
      tempConfig[item.mode + item.type + item.subtype].filter
    ));
    logger.debug('item.value=%s', item.value);
  });
  query.multiQuery(tempList, tempConfig, function mqcb(err, docs) {
    accumulate(docs);
    debug('doc:%s', util.inspect(docs));
    res.renderPjax('sum/' + chartList + '/list', { all: docs, caculateDate: value });
  });
};
