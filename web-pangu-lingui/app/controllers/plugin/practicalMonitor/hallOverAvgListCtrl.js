var db = require('../../connectFactory').getConnection('tuxedoDb');
var query = require('../../dbQuery');
var logger = require('../../log').logger;
var practicalConfig = require('../../plugin_config/hubei/practicalMonitor/config_practicalMonitor');
var auth = require('../../auth');

module.exports = function practicalMonitorClerk(app) {
  app.get('/practicalMonitor/hallOverAvgList.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var business = req.query.selectVal;
    res.renderPjax('plugin/practicalMonitor/hallOverAvgList.html', {
      date: date,
      chartList: chartList,
      business: business
    });
  });
  app.get('/PracticalMonitor/getHallOverAvgListData', auth.requiresLogin,
    function router(req, res) {
      var date = req.query.date;
      var chartList = req.query.chartList;
      var business = req.query.business;
      if (business == null) {
        business = 'userTrade';
			}
      var list = practicalConfig.list[chartList][business][2];
      var config = practicalConfig.config[list.mode + list.type + list.subtype];
      var tbl = query.getTableName(list.mode, list.type, config.scopes[0], date);
      logger.debug(tbl);
      var model = db.model('practicalMonitor', tbl);
      var output = [];
			var i = 0;
			var sum = 0;
      var obj = {};
      model.find({}).sort({ AVG_BUSINESS: -1 }).exec(function execute(err, results) {
				// logger.debug(results);
        results.forEach(function each(item) {
          //  item.sort=j;
          //  logger.debug(item);				
          i++;
          obj = {
            sorts: i,
            businessHall: item.BUSINESS_HALL,
            avgHall: item.AVG_BUSINESS,
            sTime: item.STIME
          };
          output.push(obj);
        });
        res.send(output);
      });
    });
};
