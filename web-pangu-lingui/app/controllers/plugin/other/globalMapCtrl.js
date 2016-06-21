var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var logger = require('../../log').logger
    , extend = require('extend')
    , async = require('async');

var db = require('../../connectFactory').getConnection('tuxedoDb');
var formatDate = require('../../util').formatDate;



module.exports = function(app) {

    app.get('/other/globalMap.html', function(req, res){
        res.render('plugin/other/globalMap',{
            layout:false

        });

    });

    app.get('/getGlobalMapMainFormat.html', function(req, res){

        var conf = {};
        conf["recover_type"] = "1";

        var tableName =  "spt_b_mapofchina";
        tableName =  tableName + formatDate(null, 'yyMMdd');

        db.collection(tableName).find(conf, {_id: 0}).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows)
            if(rows.length <= 0){

                return;
            }

            var result = [];


            for(var key in rows){
                var row=rows[key];
                if(row.monitor_type=="tuxedo"&&row.detail_monitor_type=="Que"){
                    result.push({
                        type:row.monitor_type+"_"+row.detail_monitor_type,
                        relation_id:row.relation_id,
                        titlemain: row.titlemain,
                        title1:row.title1+row.title1_text,
                        title1_1:row.host,
                        title1_2:row.server_file,
                        title1_3:row.domain_code+"域",
                        title1_4:row.detail_cot.serve,
                        title1_5:row.cot,
                        title1_6:row.fireman,
                        title2:row.title2,
                        title2_1:row.detail_cot.lcu.split(','),

                        title3:row.title3,
                        title3_1:row.detail_cot2.his,
                        status:row.status

                    });
                }else if(row.monitor_type=="oracle"&&row.detail_monitor_type=="Session"){
                    result.push({
                        type:row.monitor_type+"_"+row.detail_monitor_type,
                        relation_id:row.relation_id,
                        titlemain: row.titlemain,
                        title1:row.title1+row.title1_text,
                        title1_1:row.host,
                        title1_2:row.server_file,
                        title1_3:row.detail_monitor_type,
                        title1_4:row.domain_code+"域",
                        title1_5:row.cot,
                        title1_6:row.fireman,
                        title2:row.title2,
                        title2_1:row.detail_cot.five_mi_his,

                        title3:row.title3,
                        title3_1:row.detail_cot2.five_hour_his,
                        status:row.status

                    });
                }else if(row.monitor_type=="intf"&&row.detail_monitor_type=="Soap"){
                    result.push({
                        type:row.monitor_type+"_"+row.detail_monitor_type,
                        relation_id:row.relation_id,
                        titlemain: row.titlemain,
                        title1:row.title1+row.title1_text,
                        title1_1:row.server_file,
                        title1_2:row.detail_monitor_type,
                        title1_3:row.domain_code+"域",
                        title1_4:row.provice_name,
                        title1_5:row.datafrom,
                        title1_6:row.fireman,
                        title2:row.title2,
                        title2_1:row.detail_cot,

                        title3:row.title3,
                        title3_1:row.detail_cot2.his,
                        status:row.status

                    });
                }

            }

            res.send(result);
        });

    });

    app.get('/getGlobalMapMainByRelationId.html', function(req, res){
        var  date = req.query['date'];
        var  relation_id = req.query['relation_id'];
        var  conf = {};
        conf["relation_id"] = relation_id;

        var tableName =  "spt_b_mapofchina";

        db.collection(tableName).find(conf, {_id: 0}).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows)
            if(rows.length <= 0){

                return;
            }

            var result = [];
            //for(var key in rows){
            var row=rows[0];
            if(row.monitor_type=="tuxedo"&&row.detail_monitor_type=="Que"){
                result.push({
                    type:row.monitor_type+"_"+row.detail_monitor_type,
                    relation_id:row.relation_id,
                    titlemain: row.titlemain,
                    title1:row.title1+row.title1_text,
                    title1_1:row.host,
                    title1_2:row.server_file,
                    title1_3:row.domain_code+"域",
                    title1_4:row.detail_cot.serve,
                    title1_5:row.cot,
                    title1_6:row.fireman,
                    title2:row.title2,
                    title2_1:row.detail_cot.lcu.split(','),

                    title3:row.title3,
                    title3_1:row.detail_cot2.his,
                    status:row.status

                });
            }else if(row.monitor_type=="oracle"&&row.detail_monitor_type=="Session"){
                result.push({
                    type:row.monitor_type+"_"+row.detail_monitor_type,
                    relation_id:row.relation_id,
                    titlemain: row.titlemain,
                    title1:row.title1+row.title1_text,
                    title1_1:row.host,
                    title1_2:row.server_file,
                    title1_3:row.detail_monitor_type,
                    title1_4:row.domain_code+"域",
                    title1_5:row.cot,
                    title1_6:row.fireman,
                    title2:row.title2,
                    title2_1:row.detail_cot.five_mi_his,

                    title3:row.title3,
                    title3_1:row.detail_cot2.five_hour_his,
                    status:row.status

                });
            }else if(row.monitor_type=="intf"&&row.detail_monitor_type=="Soap"){
                result.push({
                    type:row.monitor_type+"_"+row.detail_monitor_type,
                    relation_id:row.relation_id,
                    titlemain: row.titlemain,
                    title1:row.title1+row.title1_text,
                    title1_1:row.server_file,
                    title1_2:row.detail_monitor_type,
                    title1_3:row.domain_code+"域",
                    title1_4:row.provice_name,
                    title1_5:row.datafrom,
                    title1_6:row.fireman,
                    title2:row.title2,
                    title2_1:row.detail_cot,

                    title3:row.title3,
                    title3_1:row.detail_cot2.his,
                    status:row.status

                });
            }

            res.send(result[0]);
        });

    });

    app.get('/getGlobalMapRelationByRelationId.html', function(req, res){
        //var  date = req.query['date'];
        var  relation_id = req.query['relation_id'];
        var  conf = {};
        conf["relation_id"] = relation_id;
        var tableName =  "spt_b_mapofchina_relation";
        tableName =  tableName + formatDate(null, 'yyMMdd');

        db.collection(tableName).find(conf, {_id: 0}).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows)
            if(rows.length <= 0){
                return;
            }
            var result = [];
            for(var key in rows) {
                var row = rows[key];
                result.push({
                    relation_detial: row.relation_detial,
                    update_time: row.update_time
                });

            }

            res.send(result);
        });

    });

    app.get('/getGlobalMapAllId.html', function(req, res){
        var   conf = {};
        var tableName =  "spt_b_mapofchina";
        tableName =  tableName+ formatDate(null, 'yyMMdd')

        db.collection(tableName).find(conf, {_id: 0}).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows)
            if(rows.length <= 0){

                return;
            }

            var result = [];
            for(var key in rows){
                var row=rows[key];

                result.push({
                    detail:row.start_time+"_"+row.detail+row.title1_text,
                    relation_id:row.relation_id,
                    recover_type:row.recover_type,
                    monitor_type:row.monitor_type
                });

            }

            res.send(result);
        });

    });



    app.get('/getGlobalMapByType.html', function(req, res){//根据类型查找所有
        var   conf = {};
        var   monitor_type = req.query.monitor_type;
        conf.monitor_type = monitor_type;
        conf.recover_type = "1";
        var tableName =  "spt_b_mapofchina";
        tableName =  tableName + formatDate(null, 'yyMMdd');

        db.collection(tableName).find(conf, {_id: 0}).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows);
            if(rows.length <= 0){

                return;
            }

            var result = [];
            for(var key in rows){
                var row=rows[key];

                result.push({
                    detail:row.start_time+"_"+row.detail+row.title1_text,
                    relation_id:row.relation_id,
                    recover_type:row.recover_type,
                    monitor_type:row.monitor_type
                });

            }

            res.send(result);
        });

    });


    app.get('/getGlobalMapRspState.html', function(req, res){
        var   conf = {};
        conf["type"] = 'all_state';
        var tableName =  "spt_b_mapofchina_all_state";
        tableName =  tableName + formatDate(null, 'yyMMdd')

        db.collection(tableName).find(conf).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows)
            if(rows.length <= 0){

                return;
            }

            var result = [];
            for(var key in rows){
                var row=rows[key];
                if(row.monitor_type!='crm'){
                    result.push({
                        monitor_type:row.monitor_type,
                        times:row.times,
                        flag:row.flag,
                        text:row.text
                    });
                }


            }

            res.send(result);
        });

    });

    app.get('/getWarmCodes.html', function(req, res){//取得一个数组包括所有告警的省份编码
        var   conf = {};
        conf["type"] = 'provice_codes';
        var tableName =  "spt_b_mapofchina_all_state";
        tableName =  tableName + formatDate(null, 'yyMMdd');
        //logger.info("tableName----"+tableName);
        db.collection(tableName).find(conf).toArray(function(err, rows){
            if(err){
                logger.error(err)
            }
            logger.debug(rows)
            if(rows.length <= 0){

                return;
            }

            var result = [];
            for(var key in rows){
                var row=rows[key];


                result.push({
                    WarmCodes:row.ls
                });

            }

            res.send(result);
        })

    });

    app.get('/getGlobalMapPolling.html', function(req, res){

        var tableName =  "spt_b_mapofchina_all_state";
        tableName =  tableName + formatDate(null, 'yyMMdd');
        var strings="";
        db.collection(tableName).find().toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows)
            if(rows.length <= 0){

                return;
            }
            var result = [];
            for(var key in rows){
                var row=rows[key];

                result.push({
                    monitor_type:row.monitor_type,
                    times:row.times,
                    flag:row.flag,
                    text:row.text
                });

            }
            res.send(result);
        })

    })
}