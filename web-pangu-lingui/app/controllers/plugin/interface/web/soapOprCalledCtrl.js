//var mongoose = require('mongoose');
var logger = require('../../../log').logger;
var query = require('../../../dbQuery');
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var aConfig = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').config;
var aList = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').list;
var operateName = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_other').operateName;
var province = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_other').province;
//var operateColor = require('../../plugin_config/interfaceWeb/config_interface_other').operateColor;
var  async = require('async');
var db = require('../../../connectFactory').getConnection('soapDb');
var auth = require('../../../auth');

module.exports = function (app) {

    app.get('/interface/web/soapOprCalled.html', auth.requiresLogin, function(req, res){
        var chartCList = req.query.chartList;
        res.renderPjax('plugin/interface/web/soapOprCalled',{
            retSet:[],
            oprateList:operateName,
            chartList:chartCList
        });

    });

    app.get('/getInterfaceSoapOprCalled.html', function(req, res){

        var date = req.query.date;
        var chartCList = req.query.chartList;
        var pChartList = aList[chartCList][0];
        var cConfig = aConfig[pChartList.mode+pChartList.type+pChartList.subtype];
        var filterCode  = req.query.filterCode;
        // 查询基础表用 getTabName，统计表用getTableName
        var queryObj = {};
        var queryTable = function (mode,type,scope,dateParam,param){
            return function(callback) {
                var tabname = query.getTableName(mode, type, scope, dateParam, param);
                //logger.debug('tabname=' + tabname);
                var table = db.model(cConfig.schemaName, tabname);
                var filter = {};
                //filter.type = 'provCodeOprNameCallSum';
                if (filterCode !== undefined && filterCode !== '') {
                    filter._id = filterCode;
                }else{
                    filter._id = {$in: operateName};
                }
                table.find(filter, function (err, docs) {
                    if (err) {
                        logger.error(err);
                    }
                    callback(null, docs);
                    //logger.debug(JSON.stringify(docs));
                });
            };
        };
        for ( var proItem in province) {
            queryObj[proItem] = queryTable(pChartList.mode, pChartList.type, cConfig.scopes[0], date);
        }

        var render = function(resultSet){
            //logger.debug(JSON.stringify(resultSet));
            var retSet = [];
            if (filterCode !== undefined && filterCode !== '') {
                var retTemp = {};
                retTemp.name = filterCode;
                retTemp.data = [];
                retSet.push(retTemp);
            }else{
                operateName.forEach(function (opr) {
                    var retTemp = {};
                    retTemp.name = opr;
                    retTemp.data = [];
                    retSet.push(retTemp);
                });
            }

            for ( var itemKey in resultSet) {
                resultSet[itemKey].forEach(function(itemSet){
                    retSet.forEach(function(retSetItem) {
                        if (itemSet._id === retSetItem.name) {
                            var innerTemp = {};
                            innerTemp.y = 0;
                            innerTemp.x = 0;
                            innerTemp.z = 0;
                            innerTemp.m = 0;
                            innerTemp.name = province[itemKey];
                            if (itemSet.CALLED !== undefined) {
                                innerTemp.y = itemSet.CALLED;
                            }
                            if (itemSet.FAILED !== undefined) {
                                innerTemp.x = itemSet.FAILED;
                                innerTemp.z = itemSet.FAILED;
                            }if (itemSet.CALLED !== undefined) {
                                if (itemSet.FAILED !== undefined) {
                                    innerTemp.z = parseFloat((innerTemp.x) / innerTemp.y * 100).toFixed(2);
                                }else {
                                    innerTemp.z = 0;
                                }
                            }
                            if (itemSet.CALLED !== undefined) {
                                retSetItem.data.push(innerTemp);
                            }
                        }
                    });
                });
            }
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
};