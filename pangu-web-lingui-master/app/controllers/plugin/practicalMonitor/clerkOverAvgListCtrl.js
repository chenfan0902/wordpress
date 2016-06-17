var db = require('../../connectFactory').getConnection('tuxedoDb');
var query = require('../../dbQuery');
var logger = require('../../log').logger;
var practicalConfig = require('../../plugin_config/hubei/practicalMonitor/config_practicalMonitor');
var auth = require('../../auth');

module.exports = function practicalMonitorClerk(app) {
  app.get('/practicalMonitor/clerkOverAvgList.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var names = ['开户', '二', '三'];
    var value = ['userTrade', 'b', 'c'];
    var i = 0;
    var business = [];
    for (; i < value.length; i++) {
      business.push({ value: value[i], name: names[i] });
    }
    res.renderPjax('plugin/practicalMonitor/clerkOverAvgList.html', {
      date: date,
      chartList: chartList,
      business: business
    });
  });
  app.get('/PracticalMonitor/getClerkOverAvgListData', auth.requiresLogin,
		function router(req, res) {
  var date = req.query.date;
  var chartList = req.query.chartList;
  var business = req.query.business;
  var list = practicalConfig.list[chartList][business][1];
  var config = practicalConfig.config[list.mode + list.type + list.subtype];
  var tbl = query.getTableName(list.mode, list.type, config.scopes[0], date);
  //  logger.debug(tbl);
  var model = db.model('practicalMonitor', tbl);
  var output = [];
  var j = 0;
  var i = 0;
  var sum = 0;
  var avg = 0;
  var obj = {};
  model.find({}).exec(function execute(err, results) {
    results.forEach(function each(item) {
      j++;
      sum = item.PTIME + sum;
      //  logger.debug(sum);
    });
    avg = sum / j;
    model.aggregate([{
      $group: {
        _id: '$CLERK',
        avgClerk: { $avg: '$PTIME' },
        businessHall: { $first: '$BUSINESS_HALL' },
        avg: { $first: avg }
      }
    }]).sort({ avgClerk: -1 }).exec(function (errMessage, rows) {
      rows.forEach(function each(item) {
        if (item.avgClerk > avg) {
          i++;
          obj = {
            sort: i,
            clerk: item._id,
            avgTime: avg.toFixed(0),
            pTime: item.avgClerk.toFixed(0),
            businessHall: item.businessHall
            //  sTime:item.STIME
          }
          output.push(obj);
          //  logger.debug(obj);
        }
      })
      //  logger.debug(output);
      res.send(output);
    });
  });
});
};
