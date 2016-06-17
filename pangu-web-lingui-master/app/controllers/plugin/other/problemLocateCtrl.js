var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var logger = require('../../log').logger
   ,configZhiBiaoList = require('../../plugin_config/'+sysConfig.province+'/other/problemLocate/config_zhibiao_list').configZhiBiaoList
   ,config = require('../../plugin_config/'+sysConfig.province+'/other/problemLocate/config_showTarget').graphConfig
   ,chart_list = require('../../plugin_config/'+sysConfig.province+'/other/problemLocate/config_showTarget').graphList
   ,collectTimeList = require('../../plugin_config/'+sysConfig.province+'/other/problemLocate/config_showTarget').collectTimeList
   ,compareCfg = require('../../plugin_config/'+sysConfig.province+'/other/problemLocate/config_hostCompare').config
   ,compareList = require('../../plugin_config/'+sysConfig.province+'/other/problemLocate/config_hostCompare').list
   ,extend = require('extend')
   ,query = require('../../dbQuery');
var auth = require('../../auth');
var formatDate = require('../../util').formatDate;

module.exports = function (app) {

    app.get('/other/problemlocate/showHostCompare.html', auth.requiresLogin, function(req, res) {

        //主机对比页面
        res.render('plugin/other/problemlocate/showHostCompare',{
            layout: false,
            compareList:compareList,
            collectTimeList:collectTimeList
        });
    });

    app.get('/updateHostCompareData', function(req, res) {
        //主机对比数据
        var collectTime = req.query.collectTime||'';

        logger.debug("collectTime=%s",collectTime);
        var now = new Date().getTime();
        if(collectTime != '')
            now = now-(parseInt(collectTime)*1000*60);

        value =  formatDate(null, 'yyyy-MM-dd');

        var tempConfig ={};
        extend(true,tempConfig,compareCfg);

        var list = [];
        extend(true,list,compareList);

        list.forEach(function(item){
            if(!item.value)
                item.value = value;

            var filter ={};
            if(tempConfig[item.mode+item.type+item.subtype].filter)
                filter = tempConfig[item.mode+item.type+item.subtype].filter;
            tempConfig[item.mode+item.type+item.subtype].filterColNames.forEach(function(col){
                if (col == "timestamp"){
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
            logger.debug("docs=%s",JSON.stringify(docs));
            res.send(docs);
        })

    });

    app.get('/inputIp.html', auth.requiresLogin, function(req, res) {
        //输入ip
        var stepId = req.query.stepId||'';
        var stepAllData = req.query.stepAllData||'{}';
        res.render('plugin/problemlocate/inputIp',{
            layout: false,
            stepAllData: stepAllData
        });
    });

    app.get('/selectTarget.html', auth.requiresLogin, function(req, res) {
        //选择指标
        var stepId = req.query.stepId||'';
        var stepAllData = req.query.stepAllData||'{}';
        res.render('plugin/problemlocate/selectTarget',{
            layout: false,
            stepAllData: stepAllData,
            configZhiBiaoList:configZhiBiaoList
        });
    });

    app.get('/showTarget.html', auth.requiresLogin, function(req, res) {
        //展现指标页面
        try
        {
            var stepId = req.query.stepId||''
            var stepAllData = req.query.stepAllData||'{}'
            logger.debug("stepAllData=%s",stepAllData);
            var tempObj = JSON.parse(stepAllData);
            if(!tempObj.IP || !tempObj.targetValue)
                throw new Error('此节点前面节点传入的参数，请检查前面节点是否正确返回！');


            res.render('plugin/problemlocate/showTarget/'+tempObj.targetValue,{
                layout: false,
                stepAllData: stepAllData,
                hostIP:tempObj.IP,
                targetValue:tempObj.targetValue,
                collectTimeList:collectTimeList
            });
        } catch(error) {
            ContentType = "text/plain";
            res.StatusCode =500;
            res.write("<font color='red'>"+ error.message+" </font>");
            res.end();
        }
    });

    app.get('/updateTargetData', auth.requiresLogin, function(req, res) {
        var value = ''
            ,targetValue = req.query.targetValue
            ,collectTime = req.query.collectTime||'';

        logger.debug("targetValue=%s",targetValue);
        logger.debug("collectTime=%s",collectTime);
        var now = new Date().getTime();
        if(collectTime != '') {
            now = now - (parseInt(collectTime) * 1000 * 60);
        }

        value =  formatDate(null, 'yyyy-MM-dd');

        var tempConfig ={};
        extend(true,tempConfig,config);

        var list = [];
        var tempList = chart_list[targetValue];
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
                if (col == "timestamp"){
                    var obj = {};
                    filter[col] = {$gte: now-tempConfig[item.mode+item.type+item.subtype].delayTime,$lte: now+1000};
                }else{
                    var obj = {};
                    if(req.query[col]||'' != '') {
                        filter[col] = new RegExp(req.query[col]);
                    }
                }
            });
            tempConfig[item.mode+item.type+item.subtype].filter = filter;

        });

        query.multiQuery(list, tempConfig, function(err, docs) {
            logger.debug("docs=%s",JSON.stringify(docs));
            res.send(docs);
        });
    });

};