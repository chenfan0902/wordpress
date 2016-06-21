var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var logger = require('../../../log').logger;
var extend = require('extend');
var query = require('../../../dbQuery');
var aConfig = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_web').config;
var aList = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_web').list;
var mutil = require('../../../util');
var async = require('async');
var auth = require('../../../auth');
var db = require('../../../connectFactory').getConnection('soapDb');

module.exports = function (app) {

    app.get('/interface/web/main.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'] || "2015-05-19",
            chartList = req.query['chartList'],
            chart_list = aList[chartList][0],
            rConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype],
            chartCList = req.query['chartCList'],
            chart_clist = aList[chartCList][0],
            cConfig = aConfig[chart_clist.mode+chart_clist.type+chart_clist.subtype];

        res.renderPjax('plugin/interface/web/main', {
            title: cConfig.name,
            value: date,
            host: req.query['host'],
            chartList: chartList,
            chartCList: chartCList
        });
    });

    app.get('/getInterfaceWEBHost', function(req, res){
        var date = req.query['date'],
            chartCList = req.query['chartCList'],
            chart_clist = aList[chartCList][0],
            cConfig = aConfig[chart_clist.mode+chart_clist.type+chart_clist.subtype];
        // 查询基础表用 getTabName，统计表用getTableName
        // 查询基础表用 getTabName，统计表用getTableName
        var tabname = query.getTableName(chart_clist.mode, chart_clist.type+chart_clist.subtype, cConfig.scopes[0], date);
        db.collection(tabname).distinct('host', function(err, docs){
            if(err){
                logger.error(err);
            }
            res.send(docs);
        });
    });

    app.get('/getInterfaceWEBService', function(req, res){
        var date = req.query['date'],
            host = req.query['host'],
            chartList = req.query['chartList'],
            chart_list = aList[chartList][0],
            rConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype];
        // 查询基础表用 getTabName，统计表用getTableName
        var tabname = query.getTableName(chart_list.mode, chart_list.type+chart_list.subtype, rConfig.scopes[0], date),
            conf = {};
        conf.host = host;
        db.collection(tabname).distinct('servicename', conf, function(err, docs){
            if(err){
                logger.error(err);
            }
            res.send(docs);
        });
    });

    app.get('/getInterfaceWEBOperate', function(req, res){
        var date = req.query['date'],
            host = req.query['host'],
            chartCList = req.query['chartCList'],
            _service = req.query['_service'],
            chart_clist = aList[chartCList][0],
            rConfig = aConfig[chart_clist.mode+chart_clist.type+chart_clist.subtype];
        // 查询基础表用 getTabName，统计表用getTableName
        var tabname = query.getTableName(chart_clist.mode, chart_clist.type+chart_clist.subtype, rConfig.scopes[0], date),
            conf = {};
        conf.host = host;
        conf.servicename = _service;
        db.collection(tabname).distinct('operatename', conf, function(err, docs){
            if(err){
                logger.error(err);
            }
            res.send(docs);
        });
    });

    app.get('/getInterfaceWEBData', function(req, res){
        var host = req.query['host'],
            date = req.query['date'],
            _operate = req.query['_operate'],
            _service = req.query['_service'],
            chartList = req.query['chartList'],
            chart_list = aList[chartList][0],
            gConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype],
            chartCList = req.query['chartCList'],
            chart_clist = aList[chartCList][0],
            cConfig = aConfig[chart_clist.mode+chart_clist.type+chart_clist.subtype];

        var filter = {},
            conf = {};

        if('all' == _operate && 'all' != _service){
            filter.servicename = _service;
            conf.servicename = _service;
            delete  filter.operatename;
            delete conf.operatename;
        }
        if('all' != _operate && 'all' != _service){
            filter.servicename = _service;
            filter.operatename = _operate;
            conf.operatename = _operate;
            delete conf.servicename;
        }
        if('all' == _service){
            delete  filter.servicename;
            delete  filter.operatename;
            conf = gConfig.filterService;
            delete  conf.operatename;
        }
        filter.host = host;
        conf.host = host;
        logger.debug("====",filter,conf,"====")

        var tableCalledName = query.getTableName(chart_clist.mode, chart_clist.type+chart_clist.subtype, cConfig.scopes[0], date),
            tableGroupName = query.getTableName(chart_list.mode, chart_list.type+chart_list.subtype, gConfig.scopes[0], date);
        var tableCalled = db.collection(tableCalledName),
            tableGroup = db.collection(tableGroupName);

        async.parallel({
            group: function(callback){
                tableGroup.find(filter, { _id: 0, host: 0, type: 0 }, function(err, rest){
                    rest.toArray(function(err, rows){
                        logger.debug('===',rows,'===')
                        var docs = [],relDocs = [], tmpR = {};
                        for(var i=0; i<rows.length; i++){
                            for(var idx in rows[i]){
                                if(idx != 'servicename' && idx != 'operatename') {
                                    docs.push({
                                        'servicename': rows[i]['servicename'],
                                        'operatename': rows[i]['operatename'],
                                        'rspcode': idx,
                                        'count': rows[i][idx]
                                    })
                                }
                            }
                        }
                        for(var i=0; i<docs.length; i++){
                            if(tmpR[docs[i]['rspcode']] === undefined){
                                tmpR[docs[i]['rspcode']] = docs[i]['count'];
                            }else{
                                tmpR[docs[i]['rspcode']] += docs[i]['count'];
                            }
                        }
                        for(var idx in tmpR){
                            relDocs.push({label: idx, data: tmpR[idx]});
                        }
                        docs = mutil.sortObj(docs, 'count');
                        var tabColName = gConfig.tabColNames_CODE;
                        callback(null, {relDocs:relDocs, results:docs, tabColName: tabColName});
                    });
                });
            },
            called: function(callback){
                tableCalled.find(conf, {"0000": 1, "_total": 1, _id:0},function(err, cRes){
                    cRes.toArray(function(err, rows){
                        var _total = 0,
                            _success = 0;
                        for(var i=0; i<rows.length; i++){
                            _total += rows[i]['_total'];
                            if(rows[i]['0000'] !== undefined) {
                                _success += rows[i]['0000'];
                            }
                        }
                        callback(null, {total: _total, success: _success});
                    });
                });
            }
        },function(err, results){
            var docs = results.group,
                total = results.called.total,
                success = results.called.success,
                failure = total - success;
            docs.count = total;
            docs.failure = failure;
            docs.success = success;
            res.send(docs);
        });
    });
};