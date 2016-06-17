var log4js = require('log4js');
var dateFileLog;
var consoleLog;

log4js.configure({

  appenders: [
    {
      type: 'console',
      category: 'console'

    }, // 控制台输出
    {
      type: 'dateFile',
      filename: 'logs/log.log',
      pattern: '.yyyy-MM-dd',
            // maxLogSize: 20480,
            // backups: 3,
      alwaysIncludePattern: true,
      category: 'dateFileLog'

    }// 日期文件格式
  ],
  replaceConsole: true,   // 替换console.log
  levels: {
    dateFileLog: 'debug',
    console: 'debug'
  }
});


dateFileLog = log4js.getLogger('dateFileLog');
consoleLog = log4js.getLogger('console');
exports.logger = consoleLog;
exports.filelog = dateFileLog;


exports.use = function usefunc(app) {
  app.use(log4js.connectLogger(consoleLog, { level: 'INFO', format: ':method :url' }));
};
