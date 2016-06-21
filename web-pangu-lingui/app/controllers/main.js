/* eslint no-param-reassign: [1, { "props": false }] */
/* eslint no-underscore-dangle: [2, { "allowAfterThis": true }] */

// var mongoose = require('mongoose')
// var debug = require('debug')('pangu:sum');
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../config/config')[env];
// var util = require('util');
var query = require('./dbQuery');
var config = require('./config/' + sysConfig.province + '/config_sum').config;
var cfgTop = require('./config/' + sysConfig.province + '/config_top').cfgTop;
var cfgDetail = require('./config/' + sysConfig.province + '/config_top').cfgDetail;
var barCfg = require('./config/' + sysConfig.province + '/config_column').config;
var meterCfg = require('./config/' + sysConfig.province + '/config_meter').config;
var extend = require('extend');
var redis = require('ioredis');
var redisCfg = require('../../config/config')[env].redisCluster;
var client = new redis.Cluster(redisCfg.nodes, { password: redisCfg.password });
var logger = require('./log').logger;
var cfgSumList = require('./config/' + sysConfig.province + '/config_sum').list;
var configSum = require('./config/' + sysConfig.province + '/config_sum').config;

var provinceRegion = require('./config/' + sysConfig.province + '/regionConfig').provinceRegion;
var formatDate = require('./util').formatDate;
var mongoose = require('./connectFactory').getConnection('tuxedoDb');
var db = mongoose;
var async = require('async'); /* eslint-disable */
// client = new redis(6379, 'localhost', { password: redisCfg.password }); // 单例redis测试
var config_index = require('./config/' + sysConfig.province + '/config_index').config;
var list_index = require('./config/' + sysConfig.province + '/config_index').list;/* eslint-enable */

var formatNum = function formatNum(num) {
  if (num > 1000000000) return (num / 1000000000).toFixed(2) + 'G';
  if (num > 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num > 1000) return (num / 1000).toFixed(2) + 'K';
  return num;
};

var accumulate = function accumulate(data) {
  var scope;
  var list;
  var count;
  for (var key in data) { // eslint-disable-line
    scope = data[key].scopes[0];
    list = data[key][scope];
    if (list.error) continue;

    count = 0;

    for(var i in list) { // eslint-disable-line
      count += list[i]._count; // eslint-disable-line
    }

    data[key]._count = formatNum(count); // eslint-disable-line
    data[key].count = count; // eslint-disable-line
  }
};

exports.getStatData = function getStatData(req, res) {
  var value;
  var dateMonth;
  var statObject;
  var tempConfig;
  var list;
  var chartList;
  var filter;
  var render;
  // var configKey;
  // var client = redis.createClient(redisCfg.port,redisCfg.hostMonitor);
  try {
    value = req.query.date || '';
    // value ='2013-06-18';
    dateMonth = value === '' ? formatDate(null, 'yyyy-MM') : formatDate(value, 'yyyy-MM');

    statObject = {};
    tempConfig = {};
    extend(true, tempConfig, configSum);

    list = [];
    chartList = cfgSumList.lcuCalledSumChart;
    extend(true, list, chartList);

    // configKey = '';
    list.forEach(function lfe(item) {
      if (!item.value) item.value = value;

      filter = {};
      if (tempConfig[item.mode + item.type + item.subtype].filter) {
        filter = tempConfig[item.mode + item.type + item.subtype].filter;
      }
      tempConfig[item.mode + item.type + item.subtype].filterColNames.forEach(function tcfe(col) {
        // var obj = {};
        if (req.query[col]) {
          filter[col] = req.query[col];
        }
      });

      tempConfig[item.mode + item.type + item.subtype].filter = filter;
    });

    render = function () {
      query.multiQuery(list, tempConfig, function qmqcb(err, docs) {
        var statMonthObject;
        var temp;
        accumulate(docs);
        // logger.debug("docs=%s",JSON.stringify(docs));
        statObject.DayCalledSum = docs.TuxStateCalledSumByTimeByHour.count;
        statObject.DayFailedSum = docs.TuxStateFailedSumByTimeByHour.count;
        statObject.DaySuccessRate = (statObject.DayCalledSum - statObject.DayFailedSum)
          / statObject.DayCalledSum * 100;
        statObject.DayCalledSum = docs.TuxStateCalledSumByTimeByHour._count;
        statObject.DayFailedSum = docs.TuxStateFailedSumByTimeByHour._count;
        if (statObject.DayCalledSum === 0) {
          statObject.DaySuccessRate = '0%';
        } else {
          statObject.DaySuccessRate = statObject.DaySuccessRate.toFixed(2) + '%';
        }


        statMonthObject = {};
        statMonthObject.MonCalledSum = docs.TuxStateCalledSumByTimeAtDay.count;
        statMonthObject.MonFailedSum = docs.TuxStateFailedSumByTimeAtDay.count;
        statMonthObject.MonSuccessRate = (
          statMonthObject.MonCalledSum - statMonthObject.MonFailedSum
        ) / statMonthObject.MonCalledSum * 100;
        statMonthObject.MonCalledSum = docs.TuxStateCalledSumByTimeAtDay._count;
        statMonthObject.MonFailedSum = docs.TuxStateFailedSumByTimeAtDay._count;
        if (statMonthObject.MonCalledSum === 0) {
          statMonthObject.MonSuccessRate = '0%';
        } else {
          statMonthObject.MonSuccessRate = statMonthObject.MonSuccessRate.toFixed(2) + '%';
        }

              // logger.debug("statObject=%s",JSON.stringify(statObject));
              // logger.debug("statMonthObject=%s",JSON.stringify(statMonthObject));

        client.set('stat-' + value, JSON.stringify(statObject));
        client.set('stat-' + dateMonth, JSON.stringify(statMonthObject));
        client.expire('stat-' + value, 300);
        client.expire('stat-' + dateMonth, 300);
        temp = {};
        extend(true, temp, statObject);
        extend(true, temp, statMonthObject);
        // var response = JSON.stringify(temp);
        // client.end();
        res.send(JSON.stringify(temp));
      });
    };

    client.get('stat-' + value, function cgscb(err, obj) {
      var temp;
      // logger.debug("obj=%s",obj);
      if (obj) {
        temp = {};
        extend(true, temp, JSON.parse(obj));
        client.get('stat-' + dateMonth, function cgcb(err1, ret) {
          if (ret) {
            extend(true, temp, JSON.parse(ret));
            // var response = JSON.stringify(temp);
            // logger.debug("statObject-0=%s",JSON.stringify(temp));
            // client.quit();
            res.send(JSON.stringify(temp));
          } else {
            render();
          }
        });
      } else {
        render();
      }
    });
  } catch (error) {
    // client.quit();
    logger.debug('client.quit()');
  }
};


// 用户订阅类型
exports.getUserSubscribeType = function getUserSubscribeType(req, res, next) { //eslint-disable-line
  var pareTime = formatDate();
  var queryObj = {};
  var queryTable = function queryTable(role) {
    return function qtcb(callback) {
      var table = mongoose.model('roleWarningRight', 'roleWarningRight');
      table.find({ role: role, mode: 'webWarning' }, function tfcb(err, rightRow) {
        if (err) {
          logger.error(err);
        }
        callback(null, rightRow);
      });
    };
  };
  async.waterfall([
    function wfcb1(callback) {
      var table = mongoose.model('userWarningRole', 'userWarningRole');
      table.find({
        user_name: req.session.user.user_name,
        start_time: { $lte: pareTime },
        end_time: { $gte: pareTime }
      }, function tfcb(err, roleRow) {
        if (err) {
          logger.error(err);
        }
        if (roleRow) {
          callback(null, roleRow);
        } else {
          callback(null, []);
        }
      });
    },
    function wfcb2(roleRow, callback) {
      roleRow.forEach(function rrfe(item) {
        queryObj[item.role] = queryTable(item.role);
      });
      function retResult(tempResult) {
        callback(null, tempResult);
      }
      async.parallel(queryObj, function apcb(err, results0) {
        if (err) {
          logger.error(err);
        }
        async.apply(retResult, results0)();
      });
    }
  ], function rsfunc(err, results) {
    var retSet = [];
    var subscribeRegion = '';
    if (err) {
      logger.error(err);
    }
    for (var regionKey in provinceRegion) { //eslint-disable-line
      if (~provinceRegion[regionKey].join(',').indexOf(req.session.user.provinceCode)) {
        subscribeRegion = regionKey;
        break;
      }
    }
    if (req.session.user.is_admin) {
      subscribeRegion = 'admin';
    }
    // (req.session.user.is_admin) && (subscribeRegion = 'admin');
    for (var retItem in results) { //eslint-disable-line
      results[retItem].forEach(function rrife(rightItem) {
        var rightLevel = rightItem.level;
        var tempRight;
        while (rightLevel > 0) {
          tempRight = {};
          tempRight.type = rightItem.type;
          tempRight.level = rightLevel;
          tempRight.region = subscribeRegion;
          retSet.push(tempRight);
          rightLevel --;
        }
      });
    }
    res.send(JSON.stringify(retSet));
  });
};

// 收件箱
exports.getInbox = function getInbox(req, res, next) {
  var userName = '';
  var table;
  try {
    userName = req.session.user.user_name;
  } catch (error) {
    res.ContentType = 'text/plain';
    res.StatusCode = 500;
    res.write('会话超时，请重新登录！');
    res.end();
    return;
  }
  table = mongoose.model('UserSubscriptionRel', 'UserSubscriptionRel');
  table.find({ user_name: userName }, function tfcb(err, resultRow) {
    if (err) return next(err);
    // if (resultRow) {
    //   var response = JSON.stringify(resultRow);
    // }
    return res.send(JSON.stringify(resultRow));
  }).sort({ Unread: -1 }).limit(10);
};

// 邮件信息
exports.getMailDetail = function getMailDetail(req, res, next) {
  var userName = '';
  var collection;
  var table
  try {
    userName = req.session.user.user_name;
  } catch(error) {
    res.ContentType = 'text/plain';
    res.StatusCode = 500;
    res.write('会话超时，请重新登录！');
    res.end();
    return;
  }
  collection = 'warning' + formatDate(req.query.date, 'yy-MM-dd');
  table = mongoose.model('warningInfo', collection);
  table.findOne({ '_id': req.query.warningId }, function tfocb(err, warningInfo) {
    var table1;
    if (err) return next(err);
    if (warningInfo) {
      table1 = mongoose.model('UserSubscriptionRel', 'UserSubscriptionRel');
      table1.update({
        user_name: userName,
        SubscriptionId: req.query.warningId
      }, { $set: { Unread: '1' } }, function tbucb(err1) {
        if (err1) return next(err1);
        return next();
      });
      warningInfo.type = '';
      // var response = JSON.stringify(warningInfo);
      res.send(JSON.stringify(warningInfo));
    }
  });
};

exports.index = function index(req, res) {
  var value = req.query.date || '';
  var now = new Date().getTime();
  value = value === '' ? formatDate(null, 'yyyy-MM-dd') : formatDate(value, 'yyyy-MM-dd');

    // 曲线图
  var list = [{ mode:'TuxState', type:'CalledSumByTimeByHour', subtype: '', value:value },
                 { mode:'TuxState', type:'FailedSumByTimeByHour', subtype: '', value:value }];

    // 排名
  var list1 = [{ mode:'TuxState', type:'CalledSumByLcu', subtype: '', value:value },
                // {mode:'CustservCalled', type:'SumByIPDay', subtype: '',value:value,dbCon:'custservDb'}]
                { mode:'TuxState', type:'FailedSumByLcu', subtype: '', value:value }];
    // 柱状图
  var list2 = [{ mode:'TuxState', type:'CalledSumByTimeByHost', subtype: 'At197198', value:value },
                { mode:'TuxState', type:'CalledSumByTimeByHost', subtype: 'At4445', value:value },
                { mode:'TuxState', type:'CalledSumByTimeByHost', subtype: 'At2324', value:value }];

    // 计量表
  var list3 = [{ mode:'TuxState', type:'CalledSumByTimeByHour', subtype: 'AtHours0', value:value },
                { mode:'TuxState', type:'CalledSumByTimeByHour', subtype: 'AtHours1', value:value },
                { mode:'TuxState', type:'CalledSumByTimeByHour', subtype: 'AtHours2', value:value }, ];

  var list4 = [{ mode:'TuxState', type:'TimeOutTop', value:value }];
  var list5 = [{ mode:'CustservCalled', type:'SumByIPMin', value:value }];


  var queryUrl = '/topDetail.html?mode=TuxState' + '&type=TimeOutTop' + '&scope=day' + '&date=' + value;
  var visitCntUrl = '/visitCntDetail.html?mode=TuxState' + '&type=TimeOutTop' + '&scope=day' + '&date=' + value;

  var render = function (results) {
    var retObject = {};
    extend(true, retObject, results.queryIndexBase);
    extend(true, retObject, results.queryBar);
    extend(true, retObject, results.queryMeter);
        // logger.debug('retObject=%s', JSON.stringify(retObject))
    res.renderPjax('main/index', {
      all: retObject,
      caculateDate: value,
      queryUrl: queryUrl,
      visitCntUrl: visitCntUrl,
      TimeOutTopTitles: cfgDetail['TuxStateTimeOutTop'].titles,
      visitCntUrlTitles: cfgDetail['TuxStateVisitCount'].titles,
      value:value
    });
  };
  var queryIndexBase = function (callback) {
    query.multiQuery(list, config, function (err, docs) {
      query.multiQuery(list1, cfgTop, 10, function (err, docs1) {
        accumulate(docs);
        extend(true, docs1, docs);
                /**
                 * redisQuery ==> multiQuery 将原存于redis中的排名改到mongodb中
                 */
        query.multiQuery(list4, cfgTop, 10, function (err, docs4) {
          extend(true, docs4, docs1);
          callback(null, docs4);
        });
      });

    });
  };
  var queryIpTopByMin = function queryIptopByDay(callback) {
    var queryMinTabName = query.getTableName('CustservCalled', 'SumByIPMin', 'day', value);
    var now = new Date();
    var nowstamp = now.getTime() - now.getTime() % 60000;
    var table = db.collection(queryMinTabName);
    table.find({ hour:now.getHours() }).toArray(function (err, rows) {
      callback(null, rows);
    });
  };

  var queryBar = function queryMeter(callback) {
    query.multiQuery(list2, barCfg, function (err, docs2) {
      callback(null, docs2);
    });
  };

  var queryMeter = function queryMeter(callback) {
    query.multiQuery(list3, meterCfg, function (err, docs3) {
      callback(null, docs3);
    });
  };

  var queryObj = {};
  queryObj.queryIndexBase = queryIndexBase;
    // queryObj.queryIpTopByMin = queryIpTopByMin;
  queryObj.queryMeter = queryMeter;
  queryObj.queryBar = queryBar;
  async.parallel(queryObj, function (err, results) {
    if (err) {
      logger.error(err);
    }
    async.apply(render, results)();
  });

};

exports.visitCntDetail = function (req, res) {

  var now = new Date().getTime();
  var value = req.query.date;
  value = value === '' ? formatDate(null, 'yyyy-MM-dd') : formatDate(value, 'yyyy-MM-dd');

  var iDisplayStart = req.query.iDisplayStart || 0;
  var iDisplayLength = req.query.iDisplayLength || 10;

    // var client = new redis.Cluster(redisCfg.nodes, {password: redisCfg.password});

  var menus = [];
  var disMenus = {};
  try{
    menus = req.session.user.menus;
  }catch(error)
    {
      ContentType = 'text/plain';
      res.StatusCode = 500;
      res.write('会话超时，请重新登录！');
      res.end();
      return;
    }
  if(req.session.user.disMenus === undefined) {
        // disMenus['/index.html'] = '首页';
    menus.forEach(function (menu) {
      if(menu.url !== undefined) {
        disMenus[menu.url] = menu.title;
      }
      menu.list.forEach(function (item) {
        if(item.list !== undefined && item.list.length > 0) {
          item.list.forEach(function (docs) {
              disMenus[docs.url] = docs.title;
            });
        }else{
          disMenus[item.url] = item.title;
        }
      });
    });
    req.session.user.disMenus = disMenus;
  }else{
    disMenus = req.session.user.disMenus;
  }

  try
    {
      client.get('system-visit-count-' + value, function (err, result) {
        var output = {};
        var temp = [];
        var tempOut = new Array();
        var count = 0;

        var obj = JSON.parse(result || null);
        if(obj) {
          for(var item in obj) {
            if(item != 'allCnt' && disMenus[item.substr(7)]) {
              cfgDetail['TuxStateVisitCount'].colNames.forEach(function (col) {
                  if(col == '#') {
                      temp.push(1 + count);
                    }else if(col == 'URL') {
                        temp.push(item.substr(7) + '&date=' + value);
                      }else if(col == 'name') {
                          temp.push(disMenus[item.substr(7)]);
                        }else if(col == 'count') {
                            temp.push(obj[item]);
                          }
                });

              tempOut.push(temp);

              temp = [];
              count++;
            }
          }

        }
        output.aaData = [];
        tempOut.sort(function (a, b) {
          return (a[a.length - 1] < b[b.length - 1]) ? 1 : -1;
        });
        var end = parseInt(iDisplayStart) + parseInt(iDisplayLength);
        output.aaData = tempOut.slice(iDisplayStart, end);
            // client.quit();
        output.sEcho = parseInt(req.query.sEcho);
        output.iTotalRecords = count;
        output.iTotalDisplayRecords = count;

        var response = JSON.stringify(output);
        res.send(response);
      });

    }catch(error)
    {
        // client.quit();
      logger.debug('client.quit()');
    }
};
