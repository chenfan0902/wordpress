var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var commParams = [
  { param: '-p, --port <port>', commit: 'Web Server Listen Port!' },
  { param: '--host [hostMonitor]', commit: 'MongoDB ip address!' },
  { param: '--noauth', commit: 'Wether Authentiate or Not, default has auth' },
  { param: '-s, --soap [port]', commit: 'soap 数据库端口, 默认库名soaplog' },
  { param: '-h, --http [port]', commit: 'http 数据库端口, 默认库名httplog' },
  { param: '-2, --htwo [port]', commit: 'h2 数据库端口, 默认库名h2log' },
  { param: '-w, --web [port]', commit: 'webligic 数据库端口, 默认库名weblog' },
  { param: '-t, --tuxedo [port]', commit: 'tuxedo 数据库端口, 默认库名tuxlog' },
  { param: '-d, --database [port]', commit: 'database 数据库端口, 默认库名dblog' },
  { param: '-i, --ip [port]', commit: 'weblogic accesslog 数据库端口, 默认库名iplog' },
  { param: '-c, --cmd [port]', commit: 'cmd 数据库端口, cmddb' }
];
var province = 'hubei';

module.exports = {
  development: {
    session_secret: 'tuxlog',
    auth_cookie_name: 'USER_INFO_COOKIE',
    admins: { admin: true, wanzhou: true, tangsz: true, tangzhi: true, wanghui: true },
    root: rootPath,
    client_opts: {
      url: 'http://localhost:8082',
      sockjs_opts: { devel: true, debug: true, websocket: true }
    },
    faye: '127.0.0.1:8003',
    redisCluster: {
      nodes: [
        { host: '127.0.0.1', port: '6379' }
      ],
      password: 'flredis123'
    },
    province: province,
    params: commParams,
    db: {
      soapDb: { db: 'soaplog', port: 'soap||27000', user: 'flSoaplogRW', passwd: 'fldbrw123' },
      httpDb: { db: 'httplog', port: 'http||soap', user: 'flHttplogRW', passwd: 'fldbrw123' },
      htwoDb: { db: 'h2log', port: 'htwo||soap', user: 'flH2logRW', passwd: 'fldbrw123' },
      tuxedoDb: { db: 'tuxlog', port: 'tuxedo||27000', user: 'flTuxlogRW', passwd: 'fldbrw123' },
      databaseDb: { db: 'dblog', port: 'database||tuxedo', user: 'flDblogRW', passwd: 'fldbrw123' },
      cmdDb: { db: 'cmddb', port: 'cmd||tuxedo', user: 'flCmddbRW', passwd: 'fldbrw123' },
      custservDb: { db: 'iplog', port: 'ip||soap', user: 'flIplogRW', passwd: 'fldbrw123' }
    }
  },
  product: {
    session_secret: 'tuxlog',
    auth_cookie_name: 'USER_INFO_COOKIE',
    admins: { admin: true, phoenix: true },
    root: rootPath,
    client_opts: {
      url: 'http://localhost:8082',
      sockjs_opts: {
        devel: true,
        debug: true,
        websocket: true
      }
    },
    faye: '134.200.25.60:8003',
    redisCluster: {
      nodes: [
        { host: '134.200.25.60', port: '6380', password: 'Fl!Redis123@' },
        { host: '134.200.25.60', port: '6381', password: 'Fl!Redis123@' },
        { host: '134.200.25.61', port: '7380', password: 'Fl!Redis123@' },
        { host: '134.200.25.61', port: '7381', password: 'Fl!Redis123@' }
      ],
      password: 'Fl!Redis123@'
    },
    province: province,
    params: commParams,
    db: {
      soapDb: { db: 'soaplog', port: 'soap||27000', user: 'flSoaplogRW', passwd: 'fldbrw123' },
      httpDb: { db: 'httplog', port: 'http||soap', user: 'flHttplogRW', passwd: 'fldbrw123' },
      htwoDb: { db: 'h2log', port: 'htwo||soap', user: 'flH2logRW', passwd: 'fldbrw123' },
      tuxedoDb: { db: 'tuxlog', port: 'tuxedo||27000', user: 'flTuxlogRW', passwd: 'fldbrw123' },
      databaseDb: { db: 'dblog', port: 'database||tuxedo', user: 'flDblogRW', passwd: 'fldbrw123' },
      cmdDb: { db: 'cmddb', port: 'cmd||tuxedo', user: 'flCmddbRW', passwd: 'fldbrw123' },
      custservDb: { db: 'iplog', port: 'ip||soap', user: 'flIplogRW', passwd: 'fldbrw123' }
    }
  }
};
