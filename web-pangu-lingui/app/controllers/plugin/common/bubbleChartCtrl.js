var logger = require('../../log').logger;
var query = require('../../dbQuery');
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var aConfig = require('../../plugin_config/'+sysConfig.province+'/common/bubbleConfig').config;
var aList = require('../../plugin_config/'+sysConfig.province+'/common/bubbleConfig').list;
var  async = require('async');
var auth = require('../../auth');


module.exports = function(app) {


    app.get('/common/bubbleChart.html', auth.requiresLogin, function(req, res){
        var date = req.query.date;
        var chartCList = req.query.chartList;
        var axleXCfgList = aList[chartCList][0];
        var axleXCfg = aConfig[axleXCfgList.mode+axleXCfgList.type+axleXCfgList.subtype];

        var axleYCfgList = aList[chartCList][1];
        var axleYCfg = aConfig[axleYCfgList.mode+axleYCfgList.type+axleYCfgList.subtype];
        var retSet = [];
        var title = axleXCfg.name;
        logger.debug(axleXCfg.filterArray2);
        res.renderPjax('plugin/common/bubbleChart',{
            retSet:JSON.stringify(retSet),
            title:title,
            host:axleXCfg.filterHost,
            codeList:axleXCfg.filterCode,
            chartList:chartCList
        });

    });

    app.get('/getBubbleChartData.html', function(req, res){

        var date = req.query.date;
        var chartCList = req.query.chartList;
        var filterHost = req.query.filterHost;
        var filterCode  = req.query.filterCode;
        var axleXCfgList = aList[chartCList][0];
        var axleXCfg = aConfig[axleXCfgList.mode+axleXCfgList.type+axleXCfgList.subtype];

        var axleYCfgList = aList[chartCList][1];
        var axleYCfg = aConfig[axleYCfgList.mode+axleYCfgList.type+axleYCfgList.subtype];
        // 查询基础表用 getTabName，统计表用getTableName

        var title = axleXCfg.name;
        var queryObj = {};
        var queryTable = function (mode,type,scope,date,filterColHost,filterColCode){
            return function(callback) {
                var table = query.getTable(mode, type, scope, date);
                //logger.debug('table=' + table);
                var filter = {};
                filter[filterColHost] = filterHost;
                if (filterCode !== undefined && filterCode !== '') {
                    filter[filterColCode] = filterCode;
                }else{
                    filter[filterColCode] = {$in: axleXCfg.filterCode};
                }
                table.find(filter, function (err, docs) {
                    if (err) {
                        logger.error(err);
                    }
                    //logger.debug('docs='+JSON.stringify(docs));
                    callback(null, docs);

                });
            };
        };
        queryObj.axleX = queryTable(axleXCfgList.mode, axleXCfgList.type, axleXCfg.scopes[0], date,axleXCfg.filterColHost,axleXCfg.filterColCode);
        queryObj.axleY = queryTable(axleYCfgList.mode, axleYCfgList.type, axleYCfg.scopes[0], date,axleYCfg.filterColHost,axleYCfg.filterColCode);

        var render = function(resultSet){
            //logger.debug(JSON.stringify(resultSet));
            var retSet = [];
            //axleXCfg.filterColHost.forEach(function(filArray){
            var retTemp ={};
            retTemp.name = filterHost;
            retTemp.data = [];
            retSet.push(retTemp);
            //});

            resultSet.axleX.forEach(function(itemSetX){
                retSet.forEach(function(retSetItem) {
                    if (itemSetX[axleXCfg.filterColHost] === retSetItem.name) {
                        var innerTemp = {};
                        innerTemp.y = 0;
                        innerTemp.x = 0;
                        innerTemp.z = 0;
                        innerTemp.m = 0;
                        innerTemp.name = itemSetX[axleXCfg.bubbleName];
                        if (itemSetX[axleXCfg.axleZ] !== undefined) {
                            innerTemp.x = itemSetX[axleXCfg.axleZ];
                        }
                        resultSet.axleY.forEach(function(itemSetY){
                            if(itemSetX[axleXCfg.filterColHost] === itemSetY[axleXCfg.filterColHost] &&
                                itemSetX[axleXCfg.filterColCode] === itemSetY[axleXCfg.filterColCode] &&
                                itemSetX[axleXCfg.axleX] === itemSetY[axleXCfg.axleX]){
                                if (itemSetY[axleYCfg.axleY] !== undefined) {
                                    innerTemp.y = itemSetY[axleYCfg.axleY];
                                }
                                innerTemp.m = itemSetX[axleXCfg.axleZ];

                                if (itemSetX[axleXCfg.axleZ] !== undefined) {
                                    innerTemp.z = parseFloat((innerTemp.m) / innerTemp.y * 100).toFixed(2);
                                }else {
                                    innerTemp.z = 0;
                                }

                                if (itemSetX[axleXCfg.axleX] !== undefined) {
                                    retSetItem.data.push(innerTemp);
                                }
                            }

                        });

                    }
                });
            });
            //logger.debug('retSet='+JSON.stringify(retSet));
            res.send(retSet);
        };
        async.parallel(queryObj,function(err, results) {
            if (err) {
                logger.error(err);
            }
            async.apply(render, results)();
        });
    });
}