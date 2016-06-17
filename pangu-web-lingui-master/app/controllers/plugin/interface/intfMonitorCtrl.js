var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var mongoose = require('../../../controllers/connectFactory').getConnection('tuxedoDb')
var logger = require('../../log').logger
var extend = require('extend')
var IntfMonitor = require('../../../models/intfMonitor')
var provinceConfig = require('../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_other').province
var async = require('async');
var auth = require('../../auth');

module.exports = function (app) {

    app.get('/interface/intfMonitor.html', auth.requiresLogin, function(req, res) {
        var provinces = [];
        var pos = [0, 4, 9, 13, 17, 19, 22, 26];
        var names = ['一', '二', '三', '四', '五', '六', '七', '八'];
        var i = 0;
        for (var ind in provinceConfig) {
            for (var j = 0; j < pos.length; j++) {
                var po = pos[j];
                if (po == i) {
                    if (j > 0)
                        provinces.push({value: '998' + j, name: ''});
                    provinces.push({value: '999' + j, name: '--------  ' + names[j] + '域' + '  --------'});
                }
            }
            provinces.push({value: ind, name: provinceConfig[ind]})
            i++;
        }
        var date = req.query.date;
        var hosts = provinces;
        res.renderPjax('plugin/interface/intfMonitor', {
            hosts: hosts,
            value: date
        });
    });

    app.get('/getIntfDataHis', function(req, res) {
        var province = req.query.province;
        province = !province ? '11' : province;
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth();
        var day = time.getDate();
        year = ('' + year).substr(2);
        month += 1;
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        var sdate = year + month + day;
        var tabName = 'intf_called_5min_' + sdate;

        async.waterfall([
            function(callback) {
                callback(null, {
                    provinces: provinceConfig,
                    labels: ['总调用量', '失败量']
                });
            },
            function(arg1, callback) {
                var curTime = new Date().getTime();
                var startTime = curTime - 2*60*60*1000;

                var table = mongoose.model('IntfMonitor', tabName);

                table.find({areaId: province, endTime: {$gt: startTime, $lt: curTime}}, function(err, rows) {
                    var records = {};
                    if (!rows || rows.length <= 0) {
                        callback(null, records);
                        return;
                    }
                    var lastTime = 0;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var ctime = new Date(row.endTime);
                        var h = ctime.getHours();
                        var m = ctime.getMinutes();
                        // var d = '' + (h < 10 ? '0' : '') + h + (m < 10 ? '0' : '') + m;
                        var td = new Date(ctime.getFullYear(), ctime.getMonth(), ctime.getDate(),
                            ctime.getHours(), ctime.getMinutes());
                        var d = td.getTime();
                        lastTime = lastTime < d ? d : lastTime;
                        if (records[d]) {
                            records[d].called += row.called;
                            records[d].failed += row.failed;
                        } else {
                            records[d] = {};
                            records[d].called = row.called;
                            records[d].failed = row.failed;
                        }
                    }
                    // console.log(records)
                    arg1.records = records;
                    arg1.lastTime = lastTime;
                    callback(null, arg1);
                });
            }
        ], function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res.send({success: 1, data: result});
        })
    });

    app.get('/get5minDetailIntf', function(req, res) {
        var province = req.query.province;
        var lastTime = req.query.lastTime;
        var startTime = lastTime - 300000;

        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth();
        var day = time.getDate();
        year = ('' + year).substr(2);
        month += 1;
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        var sdate = year + month + day;
        var tabName = 'intf_called_5min_' + sdate;
        var table = mongoose.model('IntfMonitor', tabName);

        table.find({areaId: province, endTime: {$gt: startTime, $lt: lastTime}}, function(err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                // console.log(row);
                result.push({
                    intfName: row.intfName,
                    called: row.called,
                    success: row.success,
                    rate: Math.round(row.success*100/row.called)
                })
            }

            res.send({success: 1, data: result});
        });
    });

    app.get('/get5minDetailData', function(req, res) {
        var iDisplayStart = req.query.iDisplayStart | 0
            , iDisplayLength = req.query.iDisplayLength | 10
            , sEcho = req.query.sEcho
            , sSearch = req.query.sSearch
            , lastTime = req.query['lastTime']
            , province = req.query['province'];

        var startTime = lastTime - 300000;

        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth();
        var day = time.getDate();
        year = ('' + year).substr(2);
        month += 1;
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        var sdate = year + month + day;
        var tabName = 'intf_called_5min_' + sdate;
        var table = mongoose.model('IntfMonitor', tabName);

        var conf = {};
        conf.limit = iDisplayLength;
        conf.skip = iDisplayStart;

        conf.sort = 'rate1';

        //logger.debug(table)
        var sum = 0;

        table.count({areaId: province, endTime: {$lte: lastTime, $gt: startTime}}, function(err, count) {
            sum = count;
            var _q = {areaId: province, endTime: {$lte: lastTime, $gt: startTime}};
            if (!!sSearch && sSearch != '') {
                try {
                    var reg = new RegExp('.*' + sSearch + '.*', 'i');
                } catch(e) {

                }
                _q['$or'] = [{
                    intfName: reg
                }];
            }
            table.find(_q, {
                _id: 0
            }, conf, function(err, rows) {
                res.send({
                    sEcho: sEcho,
                    iTotalRecords: iDisplayLength,
                    iTotalDisplayRecords: sum,
                    aaData: rows
                });
            });
        });

    });

    app.get('/getTableDetailData', function(req, res) {
        res.send({
            // "sEcho": 3,
            "iTotalRecords": 100,
            "iTotalDisplayRecords": 100,

            "aaData": [
                [
                    "Tiger Nixon",
                    "System Architect",
                    "Edinburgh",
                    "5421",
                    "2011/04/25",
                    "$320,800"
                ],
                [
                    "Garrett Winters",
                    "Accountant",
                    "Tokyo",
                    "8422",
                    "2011/07/25",
                    "$170,750"
                ],
                [
                    "Ashton Cox",
                    "Junior Technical Author",
                    "San Francisco",
                    "1562",
                    "2009/01/12",
                    "$86,000"
                ],
                [
                    "Cedric Kelly",
                    "Senior Javascript Developer",
                    "Edinburgh",
                    "6224",
                    "2012/03/29",
                    "$433,060"
                ],
                [
                    "Airi Satou",
                    "Accountant",
                    "Tokyo",
                    "5407",
                    "2008/11/28",
                    "$162,700"
                ],
                [
                    "Brielle Williamson",
                    "Integration Specialist",
                    "New York",
                    "4804",
                    "2012/12/02",
                    "$372,000"
                ],
                [
                    "Herrod Chandler",
                    "Sales Assistant",
                    "San Francisco",
                    "9608",
                    "2012/08/06",
                    "$137,500"
                ],
                [
                    "Rhona Davidson",
                    "Integration Specialist",
                    "Tokyo",
                    "6200",
                    "2010/10/14",
                    "$327,900"
                ],
                [
                    "Colleen Hurst",
                    "Javascript Developer",
                    "San Francisco",
                    "2360",
                    "2009/09/15",
                    "$205,500"
                ],
                [
                    "Sonya Frost",
                    "Software Engineer",
                    "Edinburgh",
                    "1667",
                    "2008/12/13",
                    "$103,600"
                ]
            ]
        });
    });

    app.get('/getIntfData', function(req, resp) {
        var curTime = new Date().getTime();
        var startTime = curTime - 2*60*60*1000;

        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth();
        var day = time.getDate();
        year = ('' + year).substr(2);
        month += 1;
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        var sdate = year + month + day;

        var result = [];
        var tabName = 'intf_called_5min_' + sdate;

        var table = mongoose.model('IntfMonitor', tabName);

        var o = {};
        o.map = function() {
            // emit(this.areaId, {et: this.endTime, called: this.called, failed: this.failed});
            emit(this.areaId, {area: this.areaId, data: [{0: this.endTime, 1: this.called, 2: this.failed}]});
        }

        o.query = {
            endTime: {$gt: startTime, $lte: curTime}
        }

        o.reduce = function(k, vs) {
            var arr = [];
            for (var ind in vs) {
                arr.push(vs[ind].data[0]);
            }
            return {area: k, data: arr};

        }

        table.mapReduce(o, function(err, rows) {
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

            var pdata = [];
            for (var i = 0; i < results.length; i++) {
                var area = results[i].area;
                var res = results[i].data;
                var po = new Object();
                for (var j = 0; j < res.length; j++) {
                    var pos = res[j];
                    var time = new Date(pos['0']);
                    var h = time.getHours();
                    var m = time.getMinutes();
                    var d = '' + (h < 10 ? '0' : '') + h + (m < 10 ? '0' : '') + m;
                    var called = pos['1'];
                    var failed = pos['2'];
                    called = called ? called : 0;
                    failed = failed ? failed : 0;
                    if (po[d]) {
                        po[d][0] += called;
                        po[d][1] += failed;
                    } else {
                        po[d] = [];
                        po[d][0] = called;
                        po[d][1] = failed;
                    }
                }
                // pdata.push(po);
                pdata['area' + area] = po;
            }
            resp.send({success: 1, data: pdata});

        });

    });

};