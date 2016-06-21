var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var mongoose = require('mongoose')
    , logger = require('../../../log').logger
    , qConfig = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/analyze/config_queue').queue
    , qrConfig = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/queue/report/report_config').queue
    , extend = require('extend')
    , query = require('../../../dbQuery')
    , QueueMonitor = require('../../../../models/queuemonitor')
    , async = require('async');
var auth = require('../../../auth');

module.exports = function (app) {

    app.get('/tuxedo/queue/monitor.html', auth.requiresLogin, function(req, res) {
        var date = req.query.date;
        var hosts = qConfig.hosts;
        res.renderPjax('plugin/tuxedo/queue/monitor', {
            hosts: hosts,
            value: date
        });
    });

    app.get('/getQueueDataReal', function(req, res) {
        var curTime = new Date().getTime();
        var startTime = curTime - 900000;

        var result = [];

        var chartConfig = qConfig.realQueue[0];
        var tabName = chartConfig.mode + chartConfig.type + chartConfig.subtype;
        console.log('tabName=>' + tabName);

        var queueFields = qConfig.queueFields;
        var queueLabels = qConfig.queueLabels;

        var table = mongoose.model('QueueMonitorHis', tabName);

        table.find({time: {$gte: startTime, $lte: curTime}}
            , function(err, rows) {
//                console.log('rows=>' + rows);

                /*for (var i = 0; i < rows.length; i++) {
                 var rd = new Object();
                 var row = rows[i];
                 var qs = row['data'];
                 var time = new Date(row['time']);

                 rd['Time'] = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

                 for (var j = 0; j < qs.length; j++) {
                 var queue = qs[j];
                 var name = queue['name'];
                 var count = queue['count'];
                 rd[name] = count;
                 }
                 result.push(rd);
                 }*/
                res.send({success: 1, data: rows, queueFields: queueFields, queueLabels: queueLabels});
            });

    });

    app.get('/getRealQueueData', function(req, res) {
        var curTime = new Date().getTime();
        var startTime = curTime - 60000;

        var result = [];
        console.log('start=>' + startTime + '; end=>' + curTime);

        var chartConfig = qConfig.realQueue[0];
        console.log('chartConfig=>' + chartConfig);
        var tabName = chartConfig.mode + chartConfig.type + chartConfig.subtype;
        console.log('tabName=>' + tabName);

        var table = mongoose.model('QueueMonitor', tabName);

        table.find({time: {$gt: startTime, $lt: curTime}}, function(err, rows) {

            for (var i = 0; i < rows.length; i++) {
                var rd = new Object();
                var row = rows[i];
                var qs = row['data'];
                var time = new Date(row['time']);

                rd['Time'] = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

                for (var j = 0; j < qs.length; j++) {
                    var queue = qs[j];
                    var name = queue['name'];
                    var count = queue['count'];
                    rd[name] = count;
                }
                result.push(rd);
            }
            res.send({success: 1, data: result});
        });

    });

    app.get('/getHostQueueRealMR', function(req, res){
        var date = req.query['date'],
            host = req.query['host'];

        var now = new Date(),
            tmpS = date + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds(),
            curTime = (new Date(tmpS)).getTime(),
            startTime = curTime - 900000,
            exceptName = qrConfig.exceptName;

        var o = {};
        max_queuef = [];
        o.map = function(){
            emit(this.timestamp, {time: this.timestamp, data: [{0: this.name + '`' + this.queue, 1: this.queued}]});
        };

        o.query = {
            timestamp: { $gte: startTime, $lte: curTime },
            host: host,
            name: { $nin: exceptName }
        };

        o.reduce = function(key, values){
            var tmpres = [];
            for(var i=0; i<values.length; i++){
                tmpres.push( values[i].data[0] );
            }
            return {time: key, data: tmpres};
        };

        var chartConfig = qConfig.realQueue[1];
        var tabName = chartConfig.mode + chartConfig.type + chartConfig.subtype + date.replace(/-/g, '');
        console.log('tabName=>' + tabName);

        var table = mongoose.model('QueueDetail', tabName);

        table.mapReduce(o, function(err, rows){
            var results = [];
            if(err){
                logger.debug('mapreduce err' + err);
                res.send({ success: 0, data: [], queueFields: [], queueLabels: [] });
                return;
            }
            rows.forEach(function(row){
                var obj = row.value;
                results.push(obj);
            });
            for(var i=0; i<results.length; i++){
                for(var j=0; j<results[i].data.length; j++){
                    if( -1 == max_queuef.indexOf(results[i].data[j]['0'])){
                        max_queuef.push(results[i].data[j]['0']);
                    }
                }
            }
            for(var i=0; i<results.length; i++){
                var tmpd = [];
                for(var j=0; j<results[i].data.length; j++){
                    tmpd.push(results[i].data[j]['0']);
                    if( -1 == max_queuef.indexOf(results[i].data[j]['0'])){
                        max_queuef.push(results[i].data[j]['0']);
                    }
                }
                for(var k=0; k<max_queuef.length; k++){
                    if( -1 == tmpd.indexOf( max_queuef[k] ) ){
                        results[i].data.push({ 0: max_queuef[k], 1: null });
                    }
                }
            }
            res.send({ success: 1, data: results, queueFields: max_queuef, queueLabels: max_queuef});
        });
    });

    //服务队列实时监控，按服务查询
    app.get('/getHostQueueServe', function(req, res){
        var host = req.query['host'],
            date = req.query['date'],
            serve_sel = req.query['name'];
        var now = new Date(),
            tmpS = date + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds(),
            curTime = (new Date(tmpS)).getTime(),
            startTime = curTime - 900000;

        var tmp = serve_sel.split('`'),
            name = tmp[0],
            serve = tmp[1];
        var chartConfig = qConfig.realQueue[1],
            tabName = chartConfig.mode + chartConfig.type + chartConfig.subtype + date.replace(/-/g, ''),
            table = mongoose.model('QueueDetail', tabName);
        logger.debug('tabName=>' + tabName);

        table.find({
            host: host,
            name: name,
            queue: serve,
            timestamp: {'$gte': startTime, '$lte': curTime}
        },{
            _id: 0,
            ave : 0,
            time: 0
        }, function(err, rows){
            var tmpData = [];
            for(var i=0; i<rows.length; i++){
                var tmpN = rows[i]['name']+''+rows[i]['queue'],
                    ts = rows[i]['timestamp'],
                    tmpRes = {time: ts, data:[]};
                tmpRes.data.push({0:tmpN, 1: rows[i]['queued']});
                tmpRes.data.push({0:'serve', 1: rows[i]['serve']});
                tmpData.push(tmpRes);
            }
            res.send({success: 1, data: tmpData});
        });

    });

    app.get('/getHostQueueRealMRBak', function(req, res){
        var date = req.query['date'],
            host = req.query['host'];

        var now = new Date(),
            tmpS = date + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds(),
            curTime = (new Date(tmpS)).getTime(),
            startTime = curTime - 900000,
            exceptName = qrConfig.exceptName;

        var sel_name,
            sel_queue,
            chartConfig = qConfig.realQueue[1],
            tabName = chartConfig.mode + chartConfig.type + chartConfig.subtype + date.replace(/-/g, ''),
            table = mongoose.model('QueueDetail', tabName);

        table.findOne({
            timestamp: { $gte: startTime, $lte: curTime },
            host: host,
            name: { $nin: exceptName }
        },{
            name: 1,
            queue: 1,
            _id: 0
        }, function(err, rows){
            logger.debug('rows==> ' + rows);
            if(rows){
                sel_name = rows['name'];
                sel_queue = rows['queue'];
                async.parallel({
                    sel: function (callback) {
                        table.find({
                            timestamp: { $gte: startTime, $lte: curTime },
                            host: host,
                            name: sel_name,
                            queue: sel_queue
                        },{
                            _id: 0,
                            ave: 0,
                            suggestion: 0
                        }, function(err, rows){
                            callback(null, rows);
                        });
                    },
                    label: function (callback) {
                        table.find({
                            timestamp: { $gte: startTime, $lte: curTime },
                            host: host,
                            name: { $nin: exceptName }
                        }, {
                            _id: 0,
                            name: 1,
                            queue: 1
                        },function(err, rows){
                            var tmpQName = [];
                            for(var i=0; i<rows.length; i++){
                                var tmpqn = rows[i]['name'] + '`' + rows[i]['queue'];
                                if( -1 == tmpQName.indexOf(tmpqn) ) {
                                    tmpQName.push(tmpqn);
                                }
                            }
                            callback(null, tmpQName);
                        });
                    }
                }, function(err, results){
                    var selData = results.sel,
                        labelData = results.label,
                        resData = [];
                    logger.debug(selData);
                    for(var i=0; i<selData.length; i++){
                        var tmpdata = [],
                            tmpqn = '服务：' + selData[i]['name'] + ' 队列：' + selData[i]['queue'];
                        tmpdata.push({0: tmpqn, 1: selData[i]['queued']});
                        tmpdata.push({0: 'serve', 1: selData[i]['serve']});
                        var t1 = {};
                        t1.time = new Date(selData[i].time).getTime();
                        t1.data = tmpdata;
                        resData.push(t1);
                    }
                    var resName = '服务：' + sel_name + ' 队列：' + sel_queue;
                    res.send({
                        success: 1,
                        data: resData,
                        queueFields: [resName, 'serve'],
                        queueLabels: [resName, '队列配置'],
                        selectFields: labelData
                    });
                });
            }
        });
    });

};