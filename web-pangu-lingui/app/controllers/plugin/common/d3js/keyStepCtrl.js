var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('soapDb');
var logger = require('../../../log').logger;
var extend = require('extend');
var query = require('../../../dbQuery');
var async = require('async');
var aConfig = require('../../../plugin_config/'+sysConfig.province+'/common/d3js/config_d3js_key_step').config;
var alConfig = require('../../../plugin_config/'+sysConfig.province+'/common/d3js/config_d3js_key_step');
var aList = require('../../../plugin_config/'+sysConfig.province+'/common/d3js/config_d3js_key_step').list;
var mutil = require('../../../util');
var auth = require('../../../auth');


module.exports = function(app) {

    app.get('/common/d3js/keyStep.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'] || '2015-05-19';
        var chartList = req.query['chartList'];
        var chart_list = aList[chartList][0];
        var cConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype];
        var nodesName = cConfig['nodesName'];
        var nodesInfo = alConfig[nodesName];
        res.renderPjax('plugin/common/d3js/keyStep',{
            value: date,
            chartList: chartList,
            title: cConfig['title'],
            nodesInfo: JSON.stringify(nodesInfo),
            //cConfig: JSON.stringify(cConfig),
            style: cConfig['style'],
            maxNormLen: cConfig.maxNormLen || 4,
            hosts: cConfig['hosts'],
            fieldsName: cConfig.fieldsName
        });
    });

    app.get('/getD3JSTradeKeyStepDetail', function(req, res){
        var date = req.query['date'];
        var type = req.query.type || 'callPerMinute'; // whole_day or five_minute
        var chartList = req.query.chartList;
        var chart_list = aList[chartList][0];
        var cConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype];
        var queryMethod = cConfig.queryMethod || 'Table';
        var schemaName = cConfig.schemaName || '';
        var _query = req.query._query || '{}';
        var fieldsName = req.query.fieldsName || [];
        var conf;

        try{
            conf = _query != '{}' && JSON.parse(_query) || {};
        }catch (e){
            logger.debug('[d3jsStep Error] json parse failure. ' + _query)
        }

        var tablename;
        var table;
        queryMethod == 'Table' && (tablename = query.getTableName(chart_list.mode, chart_list.type, cConfig.scopes[0], date))
        || (tablename = query.getTabName(chart_list, date, 0));
        schemaName != '' && (table = db.model(schemaName, tablename)) || (table = db.collection(tablename));
        var now = new Date();
        //now.setDate(16);
        var nowstamp = now.getTime() - now.getTime() % 60000;
        if( 'callFiveMinute' === type){
            conf.hour = now.getHours();
        }else{
            delete conf.hour;
        }

        //logger.debug('=====',conf, tablename,province,'=====');
        if(schemaName == ''){
            table = db.collection(tablename);
            table.find(conf).toArray(function(err, rows){
                render(rows);
            })
        }else{
            table = db.model(schemaName, tablename);
            table.find(conf, function(err, rows){
                render(rows);
            });
        }

        var render = function(docs){
            if( 'provCodeOprNameCallSum' === type ){
                docs.length != 0 && res.send(docs[0]);
            }
            if( 'callFiveMinute' === type){
                var output = {};
                var cur = 0;
                for(var i=0; i<fieldsName.length; i++){
                    var key = fieldsName[i][2];
                    docs.length != 0 && (output[key] = docs[0][nowstamp+'`'+key]) || (output[key] = 0);
                    if(key !== 'CALLED' && key !== 'other' && output[key] !== undefined){
                        cur += output[key];
                    }
                }
                //docs.length != 0 && (output.CALLED =  docs[0].CALLED);
                output.other = output.CALLED - cur;
                res.send(output);
            }
        };
    });

    app.get('/getD3JSTradeKeyStepAllData', function(req, res){
        var date = req.query.date || mutil.formatDate(null, 'yyyy-MM-dd');
        var chartList = req.query.chartList;
        var chart_list = aList[chartList][0];
        var cConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype];
        var typeList = req.query.typeList || 'calledPerMinuteList';
        var idx = req.query.idx || 2;

        var year = parseInt(date.split('-')[0]);
        var month = parseInt(date.split('-')[1] - 1);
        var day = parseInt(date.split('-')[2]);
        var now = new Date();
        now.setFullYear(year);
        now.setMonth(month);
        now.setDate(day);
        var nowstamp = now.getTime();
        var startstamp = nowstamp - 15 * 60 * 1000;

        var queryList = alConfig[cConfig.nodesName];
        var queryObj = {};
        var queryTable = function (tablename, conf, schema, filter){
            filter = filter || {};
            return function(callback) {
                var table = db.model(schema, tablename);
                table.find(conf, filter, callback);
            };
        };
        var queryOrderTable = function (tablename, conf, schema, filter){
            filter = filter || {};
            return function(callback) {
                var table = db.model(schema, tablename);
                table.find(conf, filter).sort({_id: -1}).limit(2).exec(callback);
            };
        };
        var render = function(rows){
            if(typeList === 'calledPerMinuteList'){
                var output = {};
                for(var key in rows){
                    output[key] = rows[key] && rows[key];
                }
                res.send(rows);
            }
            if(typeList === 'calledOperateDayList'){
                var output = {};
                for(var key in rows){
                    output[key] = rows[key] && rows[key][0];
                }
                res.send(output);
            }
        };

        for(var i=0; i<queryList.length; i++){
            var item = queryList[i];
            var conf = {
                _id: item.key
            };
            var tL = aList[typeList];
            var tl;
            !item.isOrder && (tl = tL[idx]) || (tl = tL[1]);
            var tcg = aConfig[tl.mode + tl.type + tl.subtype];
            var schemaName = tcg.schemaName || 'IntfMultiSchema';
            if(typeList === 'calledPerMinuteList'){
                conf.timestamp = {
                    $gt: startstamp,
                    $lt: nowstamp
                };
                idx === 0 && (conf.type = 'callPerMinute') || (delete conf.type);
            }
            if(item.isOrder){
                conf = {
                    _id: new RegExp(item.key)
                };
            }
            var tablename = query.getTableName(tl.mode, tl.type, tcg.scopes[0], date);
            //logger.debug('===', typeList, tL, tl, tcg, '===');
            //logger.debug('===', conf, '===');
            !item.isOrder && (queryObj[queryList[i].webId] = queryTable(tablename, conf, schemaName, {_id:0,type:0,key:0,timestamp:0}));
            item.isOrder && (queryObj[queryList[i].webId] = queryOrderTable(tablename, conf, schemaName, {type:0,key:0,timestamp:0}));
        }
        async.parallel(queryObj, function(err, results){
            if(err){
                logger.error(err);
            }
            render(results);
        });
    });
}