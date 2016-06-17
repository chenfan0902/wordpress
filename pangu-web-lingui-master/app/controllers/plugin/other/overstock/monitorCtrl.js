/**
 * Created with JetBrains WebStorm.
 * User: Jacky
 * Date: 14-4-14
 * Time: 下午5:06
 * To change this template use File | Settings | File Templates.
 */
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('tuxedoDb')
    , logger = require('../../../log').logger
    , osConfig = require('../../../plugin_config/'+sysConfig.province+'/other/overStock/config_overstock')
    , extend = require('extend')
    , query = require('../../../dbQuery')
    ;
var auth = require('../../../auth');
//var Overstock = require('../../models/overstock').Overstock;

module.exports = function (app) {

    app.get('/other/overStock/monitor.html', auth.requiresLogin, function(req, res) {

        var os = req.query.chartList;
        var value = req.query.date || '';
        var ajaxGetTag = req.query.ajaxGetTag || 'false';
        var transCode = req.query.TRANSCODE || '';
        var headTitle = '';

        var tabColNames = osConfig.overstock.tabColNames;

        res.renderPjax('plugin/other/overStock/monitor', {
//            layout:true,
            chartList: os,
            headTitle: '工单积压',
            tabColNames: tabColNames
        });

    });

    app.get('/getOverstockData', function(req, res) {


        var chartList = req.query['chartList'];
        //logger.debug('chartList=>' + chartList);

        var chartConfig = osConfig.overstock.lineChart[0];
        //logger.debug('chartConfig=>' + (chartConfig.mode + chartConfig.type + chartConfig.subtype));
        var tabName = chartConfig.mode + chartConfig.type + chartConfig.subtype;

        var table = db.model('orderoverstock', tabName);
        //logger.debug('table=>' + table);

        var curTime = new Date().getTime();
        //取当前一个小时数据

//        logger.debug('curTime=>' + curTime);
        var startTime = curTime - 900000;
//        logger.debug('startTime=>' + startTime);
        var time = new Date(startTime);

        var result = [];
        var detail = [];
        table.find({time: {$gte: startTime, $lte:curTime}}, function(err, rows) {
//            logger.debug('rows111=>' + rows);

            var tt;
            var num = 0;
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                tt = (!tt) ? row.time : tt;

                if (tt == row.time) {
                    num += row.count;

                    detail.push(row);
                } else {
                    //result.push(num);
                    var date = new Date(tt);
                    result.push([tt, num]);
                    tt = row.time;
                    num = row.count;

                    detail = [];
                    detail.push(row);
                }
                if (i == rows.length - 1) {
                    //result.push(num);
                    var date = new Date(tt);
                    result.push([tt, num]);
                }
            }
//            logger.debug('result=>' + result);
            res.send({success: 1, data: result, detail: detail, cols: osConfig.overstock.tabCols});
        });
    });
};