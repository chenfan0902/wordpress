var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var mongoose = require('mongoose');
var debug = require('debug')('pangu:top');
var util = require("util");
var query = require('../../dbQuery');
var config = require('../../plugin_config/'+sysConfig.province+'/interface/outMag/config_interfaceOutMag').detailConfig;
var chart_list = require('../../plugin_config/'+sysConfig.province+'/interface/outMag/config_interfaceOutMag').detailList;
var async = require('async');
var extend = require('extend');
var redisCfg = sysConfig.redisCluster;
var redis = require('ioredis');
var client = new redis.Cluster(redisCfg.nodes, {password: redisCfg.password});
var logger = require('../../log').logger;
var formatDate = require('../../util').formatDate;

module.exports = function(app) {


    app.get('/interface/outMag.html', function(req, res){
        var chartList = req.query.chartList;
        var value = req.query.date||'';
        var list = chart_list[chartList];

        value = formatDate(null, 'yyyy-MM-dd');

        logger.debug(list[0].mode);
        logger.debug(list[0].type);
        logger.debug(list[0].subtype);

        var headTile = config[list[0].mode+list[0].type+list[0].subtype].name;

        var displayLength = config[list[0].mode+list[0].type+list[0].subtype].displayLength;
        if( typeof(scope) == "undefined"  ){
            var queryUrl = "/getInterfaceOutMagData?mode="+list[0].mode+"&type="+list[0].type+"&subtype="+list[0].subtype+"&date="+value+"&iDisplayLength="+displayLength;

        }else{
            var queryUrl = "/getInterfaceOutMagData?mode="+list[0].mode+"&type="+list[0].type+"&scope="+scope+"&subtype="+list[0].subtype+"&date="+value+"&iDisplayLength="+displayLength;
        }

        res.renderPjax('plugin/interface/outMag',{
            titles: config[list[0].mode+list[0].type+list[0].subtype].titles,
            queryUrl:queryUrl,
            headTile:headTile,
            displayLength:displayLength

        });
    });


    //变更接口为迁出   1是迁出  0是未迁出
    app.get('/changeInterfaceOutData', function(req, res){

        //取得 YYYY-MM-DD HH:MM:SS形式的当前时间
        var now = new Date().getTime();
        var dateCa = new Date(now);
        var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
        var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
        var year = dateCa.getFullYear();
        var HH = dateCa.getHours() < 10 ? "0" + dateCa.getHours() :dateCa.getHours();
        var MM = dateCa.getMinutes() < 10 ? "0" + dateCa.getMinutes() :dateCa.getMinutes();
        var SS = dateCa.getSeconds() < 10 ? "0" + dateCa.getSeconds() :dateCa.getSeconds();
        value = year+"-"+month+"-"+date+" "+HH+":"+MM+":"+SS;
        var keys = req.query.keys;
        keys = keys.substring(0,keys.length-1);
        //console.log("changeInterfaceOutData@@@@@@@@@@@@@@@@@@@@@@" + keys);

        var keysArr = keys.toString().split(",");
        //console.log("keysArr@@@@@@@@@@@@@@@@@@@@@@" + keysArr.length);
        var info = {};
        info.status = 1;
        info.date    = value;

        var queryObj = {};
        var queryTable = function (key){
          //  console.log("key@@@@@@@@@@@@@@@@@@@@@@" + key);
            return function(callback) {
                client.hmset(key, info, callback);
            };
        };

        keysArr.forEach(function(key){
            queryObj[key] = queryTable(key);
        })

        async.parallel(queryObj,function(err, results) {
            if (err) {
                logger.error(err);
            }
            res.send("success");
        });


    });


    //变更接口为未迁出   1是迁出  0是未迁出
    app.get('/changeInterfaceNotOutData', function(req, res){

        //取得 YYYY-MM-DD HH:MM:SS形式的当前时间
        var now = new Date().getTime();
        var dateCa = new Date(now);
        var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
        var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
        var year = dateCa.getFullYear();
        var HH = dateCa.getHours() < 10 ? "0" + dateCa.getHours() :dateCa.getHours();
        var MM = dateCa.getMinutes() < 10 ? "0" + dateCa.getMinutes() :dateCa.getMinutes();
        var SS = dateCa.getSeconds() < 10 ? "0" + dateCa.getSeconds() :dateCa.getSeconds();
        value = year+"-"+month+"-"+date+" "+HH+":"+MM+":"+SS;
        var keys = req.query.keys;
        keys = keys.substring(0,keys.length-1);

        var keysArr = keys.toString().split(",");
        var info = {};
        info.status = 0;
        info.date    = value;

        var queryObj = {};
        var queryTable = function (key){
            return function(callback) {
                client.hmset(key, info, callback);
            };
        };

        keysArr.forEach(function(key){
            queryObj[key] = queryTable(key);
        })

        async.parallel(queryObj,function(err, results) {
            if (err) {
                logger.error(err);
            }
            res.send("success");
        });

    });



    app.get('/addInterfaceOutData', function(req, res){
        var now = new Date().getTime();
        var dateCa = new Date(now);
        var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
        var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
        var year = dateCa.getFullYear();
        var HH = dateCa.getHours() < 10 ? "0" + dateCa.getHours() :dateCa.getHours();
        var MM = dateCa.getMinutes() < 10 ? "0" + dateCa.getMinutes() :dateCa.getMinutes();
        var SS = dateCa.getSeconds() < 10 ? "0" + dateCa.getSeconds() :dateCa.getSeconds();
        value = year+"-"+month+"-"+date+" "+HH+":"+MM+":"+SS;

        var proviceCode = req.query.proviceCode;
        var sysCode = req.query.sysCode;
        var svcCode = req.query.svcCode;
        var errorCode = req.query.errorCode;
        var state = req.query.state;

        var key = "OUT."+proviceCode+"."+sysCode+"."+svcCode;

        var info = {};
        info.status = state;
        info.date    = value;
        info.errorCode=errorCode;
        client.hmset(key, info, function(err, results) {
            if (err) {
                logger.error(err);
            }
            res.send("success");

        });

    });

    app.get('/delInterfaceOutData', function(req, res){

        var keys = req.query.keys;
        keys = keys.substring(0,keys.length-1);

        var keysArr = keys.toString().split(",");

        var queryObj = {};
        var queryTable = function (key){
            return function(callback) {
                client.del( key, callback);
            };
        };
        keysArr.forEach(function(key){
            queryObj[key] = queryTable(key);
        })

        async.parallel(queryObj,function(err, results) {
            if (err) {
                logger.error(err);
            }
            res.send("success");
        });


    });


    app.get('/getInterfaceOutMagData', function(req, res){

        //取得 YYYY-MM-DD HH:MM:SS形式的当前时间
        var now = new Date().getTime();
        var dateCa = new Date(now);
        var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
        var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
        var year = dateCa.getFullYear();
        var HH = dateCa.getHours() < 10 ? "0" + dateCa.getHours() :dateCa.getHours();
        var MM = dateCa.getMinutes() < 10 ? "0" + dateCa.getMinutes() :dateCa.getMinutes();
        var SS = dateCa.getSeconds() < 10 ? "0" + dateCa.getSeconds() :dateCa.getSeconds();
        value = year+"-"+month+"-"+date+" "+HH+":"+MM+":"+SS;


        client.keys('OUT.*.*.*', function (err, keys) {
        //client.zrange(['OUT.*.*.*', 0, 5], function (err, keys) {
            logger.info("keys--------"+keys);
            var keysArr = keys.toString().split(",");

            if(keys!=''){
                var queryObj = {};
                var queryTable = function (key){
                    return function(callback) {
                        //client.hmget(key, '*', callback);
                        client.hgetall(key, callback);
                        //client.get(key, callback);
                    };
                };

                keysArr.forEach(function(key){
                    queryObj[key] = queryTable(key);
                })

                async.parallel(queryObj,function(err, results) {
                    if (err) {
                        logger.error(err);
                    }

                    var output = {};
                    output.sEcho = 20;
                    //output.iTotalRecords = 2;
                    output.iTotalDisplayRecords = keysArr.length;   //多少条记录
                    output.aaData = [];

                    temp = [];
                    logger.info("keysArr.length------"+keysArr.length);
                    if(keysArr.length>0){
                        keysArr.forEach(function(key){

                            var proviceCode = key.toString().split(".")[1];
                            var status = JSON.stringify(results[key]['status']).replace('"','').replace('"','');
                            var errorCode = JSON.stringify(results[key]['errorCode']).replace('"','').replace('"','');
                            var date = JSON.stringify(results[key]['date']).replace('"','').replace('"','');
                            temp.push('<input type="checkbox" value='+key+'  name="chkJob" />');
                            temp.push(key);
                            temp.push(proviceCode);
                            if(status == "1"){
                                temp.push("迁出");
                            }else{
                                temp.push("未迁出");
                            }
                            temp.push(errorCode);
                            temp.push(date);
                            output.aaData.push(temp);
                            temp = [];
                        });
                        var response = JSON.stringify(output);
                        res.send(response);
                    }



                });

            }

        });

    });
}
