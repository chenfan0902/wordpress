var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('tuxedoDb')
    , logger = require('../../../log').logger
    , qConfig = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').config
    , hosts = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').hosts
    , qList = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').list
    , qrConfig = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/report/report_config').config
    , qrList = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/report/report_config').list
    , memConfig = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/memory/config_memory').memory
    , extend = require('extend')
    , query = require('../../../dbQuery')
    , QueueAnalyze = require('../../../../models/queueanalyze')
    , QueueDetail = require('../../../../models/queuedetail')
    , QueueReport = require('../../../../models/queuereport')
    , async = require('async');
var auth = require('../../../auth');

module.exports = function (app) {

    app.get('/tuxedo/queue/report.html', auth.requiresLogin, function(req, res){
        var date = req.query.date,
            chartList = req.query['chartList'],
            chartQList = req.query['chartQList'],
            chart_list = qrList[chartList][0],
            tabList = qrConfig[chart_list['mode']+chart_list['type']+chart_list['subtype']];

        res.renderPjax('plugin/tuxedo/queue/report', {
            tabColNames: tabList.tabColNames,
            title: tabList.name,
            hosts: hosts,
            value: date,
            chartList: chartList,
            chartQList: chartQList
        });
    });

    app.get('/getReportQueueData', function(req, res){

        var host = req.query['host'],
            date = req.query['date'],
            chartList = req.query['chartList'],
            chart_list = qrList[chartList][0],
            clConfig = qrConfig[chart_list['mode']+chart_list['type']+chart_list['subtype']],
            chartQList = req.query['chartQList'],
            chart_qlist = qList[chartQList][0],
            cqConfig = qConfig[chart_qlist['mode']+chart_qlist['type']+chart_qlist['subtype']];

        var table = null;
        if("queueReportDayList" == chartList) {
            table = query.getTab('QueueAnalyze', chart_qlist, date, 2);
        }else{
            table = query.getTab('QueueAnalyze', chart_qlist, date, 2, 4);
        }
        //logger.debug("===",query.getTab('QueueAnalyze', chart_qlist, date, 2),query.getTab('QueueAnalyze', chart_qlist, date, 2, 4),'===');

        var tabMem = memConfig.baseMemory[0],
            tableMem = query.getTab('memorymonitor', tabMem, date, 0),
            sumMem = 0;

        var exceptName = clConfig.exceptName;

        function countSuggestion(g1, g2, overflow, serve, sum, max){
            var sug = 0;
            var rat1 = (g1/sum).toFixed(2),
                rat2 = (g2/sum).toFixed(2);
            if (rat1 == 1 && overflow == 0) {
                sug = sum <= 10 ? 1 : max;
            } else {
                var gap = 0.05;
                var rat = 0;
                if (max < 10 || rat1 > 0.9) {
                    rat = ((1 - rat1)/gap) * 0.1;
                    sug = Math.ceil((rat1 >= 0.8 ? 5 : max) * (1+rat));
                } else {
                    rat = ((1 - rat1 - rat2)/gap) * 0.05;
                    sug = Math.ceil(((parseFloat(rat1) + parseFloat(rat2)) >= 0.8 ? 10 : max) * (1+rat));
                }
            }
            sug = sum <= 10 ? 1 : sug;
            sug = (sum > 10 && sum <= 20 && max < 5) ? max : sug;
            /*sug = sug > 20 ? 20 : sug;
             sug = sug == serve ? 0 : sug;*/
            return sug;
        }

        async.parallel({
                que: function (callback) {
                    table.find({host: host, name: {'$nin': exceptName}}, {_id: 0, suggestion: 0}, function(err, rows){
                        callback(null, rows)
                    });
                },
                mem: function (callback) {
                    tableMem.find({host: host}, {_id: 0}, function(err, rows){
                        callback(null, rows);
                    });
                }
            },
            function(err, results){
                //logger.debug(results.que);
                var queRows = results.que,
                    memRows = results.mem,
                    resRows = [];

                for(var i=0; i< queRows.length; i++) {
                    var name = queRows[i]['name'],
                        queue = queRows[i]['queue'],
                        g1 = queRows[i]['lt_5'],
                        g2 = queRows[i]['m5-10'],
                        g3 = queRows[i]['m10-20'],
                        g4 = queRows[i]['ge20'],
                        overflow = queRows[i]['overflow'],
                        sum = queRows[i]['sum'],
                        serve = queRows[i]['serve'],
                        max = queRows[i]['max_queued'];
                    var queue_name = queRows[i].name + '`' + queRows[i].queue,
                        sug = 0,
                        mem_size = 0, // ==> 当前进程的战友每次
                        change_mem = 0;// ==> mem_size * 增加\减少的进程数
                    sug = countSuggestion(g1, g2, overflow, serve, sum, max);
                    var tmpSum = 0,
                        tmpCount = 0;
                    for(var j=0; j<memRows.length; j++){
                        if(memRows[j]['name'] && 0 == memRows[j]['name'].indexOf(queRows[i]['name'])){
                            tmpSum += memRows[j]['size'];
                            tmpCount += 1;
                        }
                    }
                    mem_size = tmpSum / tmpCount;
                    mem_size = (mem_size / 1024).toFixed(1);  // ==> IBM 不需要*4, HP 需要*4
                    if(isNaN(mem_size)){
                        mem_size = 0;
                    }
                    change_mem = ( serve - sug ) * mem_size * -1;
                    if(isNaN(change_mem)){
                        change_mem = 0;
                    }
                    sumMem += change_mem;
                    resRows.push({
                        queue_name: queue_name,
                        serve: serve,
                        lt_5: g1,
                        'm5-10': g2,
                        'm10-20': g3,
                        'ge20': g4,
                        sum: sum,
                        max_queued: max,
                        suggestion: sug,
                        mem_size: mem_size,
                        change_mem: change_mem.toFixed(1)
                    });
                }
                if(sumMem > 1024 || sumMem < 1024){
                    sumMem = (sumMem / 1024).toFixed(1);
                    sumMem = sumMem + ' GB';
                }else {
                    sumMem = sumMem + ' MB';
                }
                resRows = resRows.sort(function(a, b){
                    return a.queue_name.localeCompare(b.queue_name);
                });
                resRows.push({
                    queue_name: '内存总变化',
                    serve: '',
                    lt_5: '',
                    'm5-10': '',
                    'm10-20': '',
                    'ge20': '',
                    sum: '',
                    max_queued: '',
                    suggestion: '',
                    mem_size: '',
                    change_mem: sumMem
                });
                res.send(resRows);
            });


    });

    app.get('/tuxedo/queue/reportBy4Days.html', auth.requiresLogin, function(req, res){
        var date = req.query.date;
        var hosts = qConfig.hosts;
        res.renderPjax('plugin/tuxedo/queue/reportBy4Days', {
            tabColNames: ['服务`队列','对列配置', '28日最大', '28日建议', '28日内存', '31日最大',
                '31日建议', '31日内存', '02日最大', '02日建议','02日内存', '03日最大', '03日建议', '03日内存'],
            hosts: hosts,
            value: date
        });
    });

    app.get('/getReportQueueDataBy4Days', function(req, res){
        var host = req.query['host'];
        var table = db.model('QueueReport', 'QueueReport28310203');
        table.find({host: host},{_id:0},function(err, rows){
            rows = rows.sort(function(a, b){
                var i = 0;
                i = a.name.localeCompare(b.name);
                if( 0 == i){
                    i = a.queue.localeCompare(b.queue);
                    return i;
                }else{
                    return i;
                }
            });
            res.send(rows);
        })
    });

    app.get('/getAllData', function(req, res){
        // 28\31\02\03
        var host = req.query['host'];
        var dbqr = db.createConnection('localhost', 'tuxlog').collection('QueueReport28310203')

        function asyncGetDayInfo(host, date, fn){

            var tab = qConfig.anaListTab[0],
                table = query.getTab('QueueAnalyze', tab, date, 2);

            var tabMem = memConfig.baseMemory[0],
                tableMem = query.getTab('memorymonitor', tabMem, date, 0),
                sumMem = 0;

            var exceptName = qrConfig.exceptName;

            function countSuggestion(g1, g2, overflow, serve, sum, max){
                var sug = 0;
                var rat1 = (g1/sum).toFixed(2),
                    rat2 = (g2/sum).toFixed(2);
                if (rat1 == 1 && overflow == 0) {
                    sug = sum <= 10 ? 1 : max;
                } else {
                    var gap = 0.05;
                    var rat = 0;
                    if (max < 10 || rat1 > 0.9) {
                        rat = ((1 - rat1)/gap) * 0.1;
                        sug = Math.ceil((rat1 >= 0.8 ? 5 : max) * (1+rat));
                    } else {
                        rat = ((1 - rat1 - rat2)/gap) * 0.05;
                        sug = Math.ceil(((parseFloat(rat1) + parseFloat(rat2)) >= 0.8 ? 10 : max) * (1+rat));
                    }
                }
                sug = sum <= 10 ? 1 : sug;
                sug = (sum > 10 && sum <= 20 && max < 5) ? max : sug;
                /*sug = sug > 20 ? 20 : sug;
                 sug = sug == serve ? 0 : sug;*/
                if( sug > max ){
                    sug = max;
                }
                return sug;
            }

            async.parallel({
                    que: function (callback) {
                        table.find({host: host, name: {'$nin': exceptName}}, {_id: 0, suggestion: 0}, function(err, rows){
                            callback(null, rows)
                        });
                    },
                    mem: function (callback) {
                        tableMem.find({host: host}, {_id: 0}, function(err, rows){
                            callback(null, rows);
                        });
                    }
                },
                function(err, results){
                    //logger.debug(results.que);
                    var queRows = results.que,
                        memRows = results.mem,
                        resRows = [];

                    for(var i=0; i< queRows.length; i++) {
                        var name = queRows[i]['name'],
                            queue = queRows[i]['queue'],
                            g1 = queRows[i]['lt_5'],
                            g2 = queRows[i]['m5-10'],
                            g3 = queRows[i]['m10-20'],
                            g4 = queRows[i]['ge20'],
                            overflow = queRows[i]['overflow'],
                            sum = queRows[i]['sum'],
                            serve = queRows[i]['serve'],
                            max = queRows[i]['max_queued'];
                        var queue_name = queRows[i].name + '`' + queRows[i].queue,
                            sug = 0,
                            mem_size = 0, // ==> 当前进程的战友每次
                            change_mem = 0;// ==> mem_size * 增加\减少的进程数
                        sug = countSuggestion(g1, g2, overflow, serve, sum, max);
                        var tmpSum = 0,
                            tmpCount = 0;
                        for(var j=0; j<memRows.length; j++){
                            if(memRows[j]['name'] && 0 == memRows[j]['name'].indexOf(queRows[i]['name'])){
                                tmpSum += memRows[j]['size'];
                                tmpCount += 1;
                            }
                        }
                        mem_size = tmpSum / tmpCount;
                        mem_size = (mem_size / 1024).toFixed(1);  // ==> IBM 不需要*4, HP 需要*4
                        change_mem = ( serve - sug ) * mem_size * -1;
                        sumMem += change_mem;
                        resRows.push({
                            queue_name: queue_name,
                            serve: serve,
                            lt_5: g1,
                            'm5-10': g2,
                            'm10-20': g3,
                            'ge20': g4,
                            sum: sum,
                            max_queued: max,
                            suggestion: sug,
                            mem_size: mem_size
                        });
                    }
                    /*resRows = resRows.sort(function(a, b){
                     return a.queue_name.localeCompare(b.queue_name);
                     });*/
                    fn(resRows);
                });
        }

        async.parallel({
            '28': function(callback) {
                asyncGetDayInfo(host, '2014-12-28', function(data){
                    callback(null, data);
                });
            },
            '31': function(callback) {
                asyncGetDayInfo(host, '2014-12-31', function(data){
                    callback(null, data);
                });
            },
            '02': function(callback) {
                asyncGetDayInfo(host, '2015-01-02', function(data){
                    callback(null, data);
                });
            },
            '03': function(callback) {
                asyncGetDayInfo(host, '2015-01-03', function(data){
                    callback(null, data);
                });
            }
        },function(err, results){
            var res28 = results['28'],
                res31 = results['31'],
                res02 = results['02'],
                res03 = results['03'];

            for(var i=0; i<res28.length; i++){
                var qn = res28[i].queue_name;
                var obj = {
                    host: host,
                    name: qn.split('`')[0],
                    queue: qn.split('`')[1],
                    serve: res28[i].serve,
                    '28max': res28[i].max_queued,
                    '28sug' : res28[i].suggestion,
                    '28size': res28[i].mem_size
                };
                dbqr.insert(obj, function(err, result){
                    console.log(result)
                });
            }
            for(var i=0; i<res31.length; i++){
                var qn = res31[i].queue_name;
                dbqr.update({
                    host: host,
                    name: qn.split('`')[0],
                    serve: res31[i].serve,
                    queue: qn.split('`')[1]
                },{$set:{
                    '31max': res31[i].max_queued,
                    '31sug' : res31[i].suggestion,
                    '31size': res31[i].mem_size
                }}, {upsert: true}, function(err, result){
                    if(err){
                        logger.debug(err);
                    }
                });
            }

            for(var i=0; i<res02.length; i++){
                var qn = res02[i].queue_name;
                dbqr.update({
                    host: host,
                    name: qn.split('`')[0],
                    queue: qn.split('`')[1],
                    serve: res02[i].serve
                },{$set:{
                    '02max': res02[i].max_queued,
                    '02sug': res02[i].suggestion,
                    '02size': res02[i].mem_size
                }}, {upsert: true}, function(err, result){
                    if(err){
                        logger.debug(err);
                    }
                });
            }

            for(var i=0; i<res03.length; i++){
                var qn = res03[i].queue_name;
                dbqr.update({
                    host: host,
                    name: qn.split('`')[0],
                    serve: res03[i].serve,
                    queue: qn.split('`')[1]
                },{$set:{
                    '03max': res03[i].max_queued,
                    '03sug': res03[i].suggestion,
                    '03size': res03[i].mem_size
                }}, {upsert: true}, function(err, result){
                    if(err){
                        logger.debug(err);
                    }
                });
            }
            res.send({'28': res28.length, '31': res31.length, '02': res02.length, '03': res03});
        });
    });

};