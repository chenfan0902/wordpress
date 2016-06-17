var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var db = require('../../connectFactory').getConnection('tuxedoDb')
    , logger = require('../../log').logger
    , extend = require('extend')
    , query = require('../../dbQuery')
    , aConfig = require('../../plugin_config/'+sysConfig.province+'/webLogic/config_weblogic').config
    , aList = require('../../plugin_config/'+sysConfig.province+'/webLogic/config_weblogic').list
    , async = require('async');
var auth = require('../../auth');

module.exports = function (app) {

    app.get('/webLogic/main.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'],
            chartBList = req.query['chartBList'],
            chartList = req.query['chartList'],
            chart_blist = aList[chartBList][0],
            bConfig = aConfig[chart_blist.mode+chart_blist.type+chart_blist.subtype];

        res.renderPjax('plugin/webLogic/main', {
            title: bConfig.name,
            value: date,
            chartBList: chartBList,
            chartList: chartList,
            hosts: aConfig.hosts,
            tabColNames: bConfig.tabColNames
        });
    });

    app.get('/getNewestWebLogicData', function(req, res){
        var date = req.query['date'],
            host = req.query["host"],
            chartList = req.query["chartList"],
            chart_list = aList[chartList][0],
            gConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype],
            chartBList = req.query["chartBList"],
            chart_blist = aList[chartBList][0],
            sSearch = req.query["sSearch"];

        function isSelect(obj){
            var flag = false;
            if (!!sSearch && sSearch != '') {
                var reg = new RegExp('.*' + sSearch + '.*', 'i');
                for(var key in obj){
                    if(reg.test(obj[key])){
                        flag = true;
                    }
                }
                return flag;
            }else{
                return true;
            }
        }

        var tabName = query.getTableName(chart_list.mode, chart_list.type, gConfig.scopes[0], date),
            tabBName = query.getTabName(chart_blist, date, 0);
        //logger.debug("-----",tabName, tabBName, "-----");
        var table = db.collection(tabName);

        table.find({host: host}, {_id:0, host:0}, function(err, docs){
            if(err) {
                logger.error(err);
            }
            docs.toArray(function(err, rows){
                if(!rows || rows.length != 1){
                    logger.error("Error: === webLogic == No rows or Not only rows!");
                }
                var result = [];
                for(var key in rows[0]){
                    rows[0][key]["Server"] = key;
                    if(isSelect(rows[0][key])) {
                        result.push(rows[0][key]);
                    }
                }
                res.send({
                    aaData: result
                });
            });
        });
    });

};