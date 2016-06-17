
var db = require('../../connectFactory').getConnection('tuxedoDb');
var query = require('../../dbQuery');
var logger = require('../../log').logger;
var practicalConfig = require('../../plugin_config/hubei/practicalMonitor/config_practicalMonitor');
var auth = require('../../auth');

module.exports = function practicalMonitorClerk(app) {
  app.get('/practicalMonitor/clerkSort.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var business = [];
    var names = ['开户', '二', '三'];
    var value = ['userTrade', 'b', 'c'];
    var i = 0;
    for (;i < value.length; i++) {
      business.push({ value: value[i], name: names[i] });
    }
    res.renderPjax('plugin/practicalMonitor/clerkSort.html', {
      date: date,
      chartList: chartList,
      business: business
    });
  });
  app.get('/PracticalMonitor/getClerkData', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var business = req.query.business;
    var list = practicalConfig.list[chartList][business][0];
    var config = practicalConfig.config[list.mode + list.type + list.subtype];
    var tbl = query.getTableName(list.mode, list.type, config.scopes[0], date);
    var model = db.model('practicalMonitor', tbl);
    var output = [];
    var obj = {};
    var j = 0;

    model.find({}).sort({ PTIME: -1 }).exec(function execute(err, results) {
      results.forEach(function each(item) {
        j++
        //  item.sort=j;
        logger.debug(item);
        obj = {
          sort: j,
          clerk: item.CLERK,
          pTime: item.PTIME,
          businessHall: item.BUSINESS_HALL,
          sTime: item.STIME
        }
        //  logger.debug(obj);
        output.push(obj);
        // output.push(item.PTIME);
      });
      //  logger.debug(output);
      res.send(output);
    });
  });
};
