var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../../config/config')[env];
var  debug = require('debug')('pangu:top')
  , util = require("util")
  , query = require('../../../../dbQuery')
  , config = require('../../../../plugin_config/'+sysConfig.province+'/common/graph/hostCompare/config_history').config
  , chart_list = require('../../../../plugin_config/'+sysConfig.province+'/common/graph/hostCompare/config_history').list
  , transcode_list = require('../../../../config/'+sysConfig.province+'/config_coreTranscodeList').coreTranscodeList
  , extend = require('extend');
var auth = require('../../../../auth');
var moduleName = require('../../../../plugin_config/'+sysConfig.province+'/common/graph/hostCompare/config_history').moduleName;

module.exports = function (app) {
    app.get('/common/graph/hostCompare/history.html', auth.requiresLogin, function(req, res) {
        var chartList = req.query.chartList;
        var isWhere = req.query.isWhere||'false';
        var listIndex = chart_list[chartList];
        var listCnt = chart_list[chartList].length;
        res.renderPjax('plugin/common/graph/hostCompare/history',{
            chartList: chartList,
            listIndex: listIndex,
            listCnt: listCnt,
            coreTranscodeList: transcode_list,
            isWhere: isWhere,
            moduleName: moduleName[chartList]
        });
    });

    app.get('/getHistoryGraphData', function(req, res) {

        var chartList = req.query.chartList;
        var value = req.query.date;
        var index = req.query.index || 0;
        var transCode =req.query.TRANSCODE||'';


        var tempConfig ={};
        extend(true,tempConfig,config);

        var list = [];
        var tempList = chart_list[chartList][index];
        extend(true,list,tempList);


        list.forEach(function(item) {
            if (!item.value) {
                item.value = value;
            }
            var filter ={};
            if(tempConfig[item.mode+item.type+item.subtype].filter)
                filter = tempConfig[item.mode+item.type+item.subtype].filter;
            tempConfig[item.mode+item.type+item.subtype].filterColNames.forEach(function(col){
                var obj = {};
                filter[col] = new RegExp(req.query[col]||'');
            });
            tempConfig[item.mode+item.type+item.subtype].filter = filter;
        });

        query.multiQuery(list, tempConfig, function(err, docs) {
            res.send(docs);
        });
    });
};
