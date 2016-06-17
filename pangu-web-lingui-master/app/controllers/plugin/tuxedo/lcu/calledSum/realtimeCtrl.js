var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../../config/config')[env];
var  debug = require('debug')('pangu:top')
  , util = require("util")
  , query = require('../../../../dbQuery')
  , config = require('../../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/calledSum/config_realTime').graphConfig
  , chart_list = require('../../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/calledSum/config_realTime').graphList
  , transcode_list = require('../../../../config/'+sysConfig.province+'/config_coreTranscodeList').coreTranscodeList
  , server_list = require('../../../../config/'+sysConfig.province+'/config_coreServerList').coreServerList
  , extend = require('extend')
  , logger = require('../../../../log').logger
  , formatDate = require('../../../../util').formatDate;
var auth = require('../../../../auth');

module.exports = function (app) {

    app.get('/tuxedo/lcu/calledSum/realtime.html', auth.requiresLogin, function(req, res) {
        var chartList = req.query.chartList;
        var list = chart_list[chartList];
        var collectTimeList = [];
        var coreList = [];
        var headTitle ='';
        list.forEach(function(item){
            headTitle = config[item.mode+item.type+item.subtype].name;
            if(config[item.mode+item.type+item.subtype].collectTimeList)
                collectTimeList = config[item.mode+item.type+item.subtype].collectTimeList;
            if(config[item.mode+item.type+item.subtype].statType =='LCU')
                coreList =  transcode_list;
            else if(config[item.mode+item.type+item.subtype].statType =='SVR')
                coreList =  server_list;
        });
        res.renderPjax('plugin/tuxedo/lcu/calledSum/realtime',{
            chartList: chartList,
            collectTimeList: collectTimeList,
            coreTranscodeList: coreList,
            headTitle: headTitle
        });
    });

    app.get('/getRealtimeLcuCalledSumData', function(req, res) {

        var chartList = req.query.chartList
            ,value =  ''
            ,collectTime = req.query.collectTime||'';
        var now = new Date().getTime();
        logger.debug("collectTime=%s",collectTime);
        if(collectTime != '') {
            now = now - (parseInt(collectTime) * 1000 * 60);
        }

        var tempConfig ={};
        extend(true,tempConfig,config);
        value = formatDate(null, 'yyyy-MM-dd');
        var list = [];
        var tempList = chart_list[chartList];
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
                    //logger.debug("delayTime=%s",tempConfig[item.mode+item.type+item.subtype].delayTime);
                    filter[col] = {$gte: now-tempConfig[item.mode+item.type+item.subtype].delayTime,$lte: now+1000};
                }else{
                    var obj = {};
                    //logger.debug("req.query[col]=%s",req.query['TRANSCODE']);
                    //logger.debug("col=%s",col);
                    if(req.query['TRANSCODE']||'' != '')
                        filter[col] = req.query['TRANSCODE'];
                }
            });
            tempConfig[item.mode+item.type+item.subtype].filter = filter;
            //logger.debug("tempConfig.filter=%s",JSON.stringify(tempConfig[item.mode+item.type+item.subtype].filter));

        });

        query.multiQuery(list, tempConfig, function(err, docs) {
            //logger.debug("docs=%s",JSON.stringify(docs));
            res.send(docs);
        });
    });
};