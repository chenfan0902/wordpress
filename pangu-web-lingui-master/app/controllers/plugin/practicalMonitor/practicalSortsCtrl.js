var db = require('../../connectFactory').getConnection('tuxedoDb');
var query = require('../../dbQuery');
var logger = require('../../log').logger;
var practicalConfig = require('../../plugin_config/hubei/practicalMonitor/config_practicalMonitor');
var auth = require('../../auth');
var async = require('async');

module.exports = function practicalMonitorClerk(app) {
  app.get('/practicalMonitor/practicalSorts.html', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
    var chartList = req.query.chartList;
    var selected = req.query.selected;
    //下拉框选项
    var business = [];
    var names = ['开户', '二', '三'];
    var value = ['userTrade', 'b', 'c'];

    var i = 0;
    for (; i < value.length; i++) {
      business.push({value: value[i], name: names[i]});
    }

    if (selected == null)
    {
      selected = business[0].value;
    }
    var trade= selected;

    var list1 = practicalConfig.list[chartList][trade][0];
    var config1 = practicalConfig.config[list1.mode + list1.type + list1.subtype];
    var tbl = query.getTableName(list1.mode, list1.type, config1.scopes[0], date);
    var model1 = db.model('practicalMonitor', tbl);
    var list2 = practicalConfig.list[chartList][trade][1];
    var config2 = practicalConfig.config[list2.mode + list2.type + list2.subtype];
    var tb2 = query.getTableName(list2.mode, list2.type, config2.scopes[0], date);
    var model2 = db.model('practicalMonitor', tb2);
    var list3 = practicalConfig.list[chartList][trade][2];
    var config3 = practicalConfig.config[list3.mode + list3.type + list3.subtype];
    var tb3 = query.getTableName(list3.mode, list3.type, config3.scopes[0], date);
    var model3 = db.model('practicalMonitor', tb3);
    var output = [];
    var output1 = [];
    var output2 = [];
    var obj = {};
    var j = 0;
    var sum = 0;
    var avg = 0;

    async.series([
      function queryClerk(cb) {
        model1.find({}).sort({ PTIME: -1 }).exec(function execute(err, results) {
          results.forEach(function each(item) {
            //  item.sort=j;
            //  logger.debug(item);
            obj = {
              sort: j, clerk: item.CLERK, pTime: item.PTIME, businessHall: item.BUSINESS_HALL, sTime: item.STIME
            };
            //  logger.debug(obj);
            output.push(obj);
            // output.push(item.PTIME);
          });
          cb(null, output);
        });
      },
      function queryClerkAvg(cb) {
        //  logger.debug(model);
        model2.find({}).exec(function execute(err, results) {
					logger.debug(results);
          results.forEach(function each(item) {
            j++;
            sum = item.PTIME + sum;
            //  logger.debug(sum);
          });
          avg = sum / j;
          model2.aggregate([{
            $group: {
              _id: '$CLERK', avgClerk: {$avg: '$PTIME'}
            }
          }]).sort({ avgClerk: -1 }).exec(function (errMessage, rows) {
            rows.forEach(function each(item) {
              if (item.avgClerk > avg) {
                i++;
                obj = {
                  clerk: item._id, pTime: item.avgClerk.toFixed(0)//  sTime:item.STIME
                }
                output1.push(obj);
                //  logger.debug(obj);
              }
            });
          });
          cb(null, output1);
        });
      },
      function queryHall(cb) {
        model3.find({}).sort({ AVG_BUSINESS: -1 }).exec(function execute(err, results) {
          results.forEach(function each(item) {
            //  item.sort=j;
            //  logger.debug(item);
            obj = {
              businessHall: item.BUSINESS_HALL, avgHall: item.AVG_BUSINESS, sTime: item.STIME
            };
            //  logger.debug(obj);
            output2.push(obj);
            // output.push(item.PTIME);
          });
          cb(null, output2);
        });
      }
    ], function getResults(err, results) {
      logger.debug(results);
      res.renderPjax('plugin/practicalMonitor/practicalSorts.html', {
        date: date, chartList: chartList, business: business, output: results[0], output1: results[1], output2: results[2]
      });
    });
  });
	app.get('/practicalMonitor/practicalSortsChange', auth.requiresLogin, function router(req, res) {
    var date = req.query.date;
		var chartList = req.query.chartList;
		var selected = req.query.selected;
		logger.debug(selected);
		var trade= selected;
		logger.debug("_____________________"+trade);
		var business = [];
		var names = ['开户', '二', '三'];
		var value = ['userTrade', 'b', 'c'];
		for (; i < value.length; i++) {
			business.push({value: value[i], name: names[i]});
		}
		var list1 = practicalConfig.list[chartList][trade][0];
		var config1 = practicalConfig.config[list1.mode + list1.type + list1.subtype];
		var tbl = query.getTableName(list1.mode, list1.type, config1.scopes[0], date);
		var model1 = db.model('practicalMonitor', tbl);
		var list2 = practicalConfig.list[chartList][trade][1];
		var config2 = practicalConfig.config[list2.mode + list2.type + list2.subtype];
		var tb2 = query.getTableName(list2.mode, list2.type, config2.scopes[0], date);
		var model2 = db.model('practicalMonitor', tb2);
		var list3 = practicalConfig.list[chartList][trade][2];
		var config3 = practicalConfig.config[list3.mode + list3.type + list3.subtype];
		var tb3 = query.getTableName(list3.mode, list3.type, config3.scopes[0], date);
		var model3 = db.model('practicalMonitor', tb3);
		var output = [];
		var output1 = [];
		var output2 = [];
		var obj = {};
		var j = 0;
		var sum = 0;
		var avg = 0;
    var i = 0;
		async.series([
			function queryClerk(cb) {
				model1.find({}).sort({PTIME: -1}).exec(function execute(err, results) {
					results.forEach(function each(item) {
						j++
						//  item.sort=j;
						//  logger.debug(item);
						obj = {
							sort: j, clerk: item.CLERK, pTime: item.PTIME, businessHall: item.BUSINESS_HALL, sTime: item.STIME
						};
						//  logger.debug(obj);
						output.push(obj);
						// output.push(item.PTIME);
					});
					cb(null, output);
				});
			},
			function queryClerkAvg(cb) {
				//  logger.debug(model);
				model2.find({}).exec(function execute(err, results) {
					results.forEach(function each(item) {
						j++;
						sum = item.PTIME + sum;
						//  logger.debug(sum);
					});
					avg = sum / j;
					model2.aggregate([{
						$group: {
							_id: '$CLERK', avgClerk: {$avg: '$PTIME'}
						}
					}]).sort({avgClerk: -1}).exec(function (errMessage, rows) {
						rows.forEach(function each(item) {
							if (item.avgClerk > avg) {
								i++;
								obj = {
									clerk: item._id, pTime: item.avgClerk.toFixed(0)//  sTime:item.STIME
								}
								output1.push(obj);
								//  logger.debug(obj);
							}
						});
					});
					cb(null, output1);
				});
			},
			function queryHall(cb) {
				model3.find({}).sort({ AVG_BUSINESS: -1 }).exec(function execute(err, results) {
					results.forEach(function each(item) {
						//  item.sort=j;
						//  logger.debug(item);
						obj = {
							businessHall: item.BUSINESS_HALL, avgHall: item.AVG_BUSINESS, sTime: item.STIME
						};
						//  logger.debug(obj);
						output2.push(obj);
						// output.push(item.PTIME);
					});
					cb(null, output2);
				});
			}
		], function getResults(err, results) {
			res.send({
				output: results[0], output1: results[1], output2: results[2]
			});
		});

	})
}

