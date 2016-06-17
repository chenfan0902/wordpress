var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../../config/config')[env];
var debug = require('debug')('pangu:top')
  , util = require("util")
  , query = require('../../../../dbQuery')
  , config = require('../../../../plugin_config/'+sysConfig.province+'/common/graph/hostCompare/config_realTime').graphConfig
  , chart_list = require('../../../../plugin_config/'+sysConfig.province+'/common/graph/hostCompare/config_realTime').graphList
  , transcode_list = require('../../../../config/'+sysConfig.province+'/config_coreTranscodeList').coreTranscodeList
  , extend = require('extend')
  , logger = require('../../../../log').logger
  , formatDate = require('../../../../util').formatDate
  , auth = require('../../../../auth');

module.exports = function (app) {

    app.get('/common/graph/hostCompare/realtime.html', auth.requiresLogin, function(req, res) {

        var chartList = req.query.chartList;
        var listIndex = chart_list[chartList];
        var listCnt = chart_list[chartList].length;
        res.renderPjax('plugin/common/graph/hostCompare/realtime',{chartList:chartList,listIndex:listIndex,listCnt:listCnt})
    });

    app.get('/getRealTimeCompareData', function(req, res) {

        var chartList = req.query.chartList
            ,value = ''
            ,index = req.query.index||0
            ,time = req.query.time||'';


        logger.debug("index=%d",index);
        var tempConfig ={};
        extend(true,tempConfig,config);

        var now = new Date().getTime();
        value = formatDate(null, 'yyyy-MM-dd');

        var list = [];
        var tempList = chart_list[chartList][index];
        extend(true,list,tempList);

        list.forEach(function(item){
            if(!item.value) {
                item.value = value;
            }

            var filter ={};
            if(tempConfig[item.mode+item.type+item.subtype].filter) {
                filter = tempConfig[item.mode + item.type + item.subtype].filter;
            }
            tempConfig[item.mode+item.type+item.subtype].filterColNames.forEach(function(col){
                if (col === "timestamp"){
                    var obj = {};
                    filter[col] = {$gte: now-tempConfig[item.mode+item.type+item.subtype].delayTime,$lte: now+1000};
                }else{
                    var obj = {};
                    filter[col] = new RegExp(req.query[col]||'');
                }
            });
            tempConfig[item.mode+item.type+item.subtype].filter = filter;
        });

        query.multiQuery(list, tempConfig, function(err, docs) {
            res.send(docs);
        });
    });
};
