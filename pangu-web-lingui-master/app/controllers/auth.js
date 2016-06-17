var userAuth = require('./user_auth');
var gridfs = require('./gridfs');
var env = process.env.NODE_ENV || 'development';
var redis = require('ioredis');
var redisCfg = require('../../config/config')[env].redisCluster;
var logger = require('./log').logger;
var client = new redis.Cluster(redisCfg.nodes, { password: redisCfg.password });
var mongoose = require('mongoose');
var db = require('./connectFactory').getConnection('tuxedoDb');
var Grid = require('gridfs-stream');
var gfs = Grid(db.db, mongoose.mongo); // eslint-disable-line
var fs = require('fs');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
// 单例redis测试
client = new redis(6379, 'localhost', {password: redisCfg.password}); // eslint-disable-line

exports.requiresLogin = function requiresLogin(req, res, next) {
  if (!req.session || req.session.hasAuth !== true) {
    // req.session.returnTo = req.originalUrl
    return res.redirect('/login.html');
  }
  next();
};

exports.login = function login(req, res) {
  userAuth.login(req, res);
};

exports.auth = function auth(req, res, next) {
  userAuth.authUser(req, res, next);
};

exports.session = function session(req, res) {
  // if (req.session.returnTo) {
  // res.redirect(req.session.returnTo)
  // delete req.session.returnTo
  // return
  // }
  res.redirect('/');
};

exports.registerUser = function registerUser(req, res) {
  res.render('user/register', {
    layout: false,
    errors: req.flash('error')
  });
};


exports.auditUser = function auditUser(req, res) {
  userAuth.auditUser(req, res);
};

exports.audit = function audit(req, res) {
  userAuth.audit(req, res);
};


exports.getHeadPicture = function getHeadPicture(req, res) {
  if (req.session) {
    gridfs.getFile(req.session.user.user_name, function cbfunc(data) {
      if (typeof data.pipe === 'function') {
        data.pipe(res);
      } else {
        fs.createReadStream(rootPath + '/public/img/userpic.png').pipe(res);
      }
    });
  }
};


exports.getVisitCount = function getVisitCount(req, res) {
  var now;
  var dateCa;
  var date;
  var month;
  var year;
  var value;
  var statUrl;
  var visitCountObj = {};
  if (req.session) {
    // client = redis.createClient(redisCfg.port,redisCfg.hostMonitor);
    now = new Date().getTime();
    dateCa = new Date(now);
    date = dateCa.getDate() < 10 ? '0' + dateCa.getDate() : dateCa.getDate();
    month = (dateCa.getMonth() + 1) < 10 ? '0' + (dateCa.getMonth() + 1) : (dateCa.getMonth() + 1);
    year = dateCa.getFullYear();
    value = year + '-' + month + '-' + date;
    statUrl = req.query.statUrl;
    if (statUrl === '/') statUrl = '/index.html';
    if (req.query.type !== undefined) {
      statUrl = statUrl + '&type=' + req.query.type;
    }
    if (req.query.scope !== undefined) {
      statUrl = statUrl + '&scope=' + req.query.scope;
    }

    try {
      client.get('system-visit-count-' + value, function cbfunc(err, obj) {
        var tempObj;
        if (obj) {
          logger.debug('obj-0=%s', JSON.stringify(obj));
          tempObj = JSON.parse(obj);
          if (tempObj['dayCnt-' + statUrl]) {
            tempObj['dayCnt-' + statUrl] = parseInt(tempObj['dayCnt-' + statUrl]) + 1; // eslint-disable-line
          } else {
            tempObj['dayCnt-' + statUrl] = 1;
          }
          tempObj.allCnt = parseInt(tempObj.allCnt) + 1; // eslint-disable-line
          visitCountObj = tempObj;
          client.set('system-visit-count-' + value, JSON.stringify(tempObj));
        } else {
          tempObj = {};
          tempObj['dayCnt-' + statUrl] = 1;
          tempObj.allCnt = 1;
          visitCountObj = tempObj;
          logger.debug('visitCountObj=%s', JSON.stringify(visitCountObj));
          client.set('system-visit-count-' + value, JSON.stringify(tempObj));
        }
        res.send(JSON.stringify(visitCountObj));
      });
    } catch (error) {
      logger.debug('client.quit()');
    }
  }
};


exports.logout = function logout(req, res) {
  delete req.session.user; // eslint-disable-line
  req.session.hasAuth = false; // eslint-disable-line
  res.redirect('/login.html');
};


exports.resetPassword = function resetPassword(req, res) {
  res.render('user/resetPassword', {
    layout: false,
    errors: req.flash('error'),
    Prompts: req.flash('Prompt')
  });
};

exports.modifyPassword = function modifyPassword(req, res) {
  res.render('user/modifyPassword', {
    layout: false,
    errors: req.flash('error'),
    Prompts: req.flash('Prompt')
  });
};
