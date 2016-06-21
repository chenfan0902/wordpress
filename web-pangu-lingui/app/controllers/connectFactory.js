/**
 * Created by Administrator on 2015/9/1.
 */
// var env = process.env.NODE_ENV || 'development';
// var config = require('../../config/config')[env];
var mongoose = require('mongoose');
var logger = require('./log').logger;
var manager;

var createDbConnection = function createDbConnection(type) {
  return mongoose.createConnection(type);
};

var ConnectManager = function ConnectManager() {};
ConnectManager.prototype.createConnection = function createConnection(app) {
  var conns = {};
  var configDb = app.get('db');
  Object.keys(configDb).forEach(function loopfunc(con) {
    conns[con] = createDbConnection(configDb[con]);
  });
  this.connections = conns;
};

ConnectManager.prototype.getConnection = function getConnection(type) {
  var con;
  if (this.connections === undefined) {
    logger.error('数据库未建立连接，请检查程序配置！');
    con = this.connections[type] !== undefined ? this.connections[type] : null;
    return con;
  }
  return this.connections[type];
};

manager = new ConnectManager();
exports.createConnection = manager.createConnection;
exports.getConnection = manager.getConnection;
