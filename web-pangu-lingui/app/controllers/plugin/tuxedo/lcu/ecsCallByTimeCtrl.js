var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('tuxedoDb')
    , debug = require('debug')('pangu:top')
    , util = require("util")
    , query = require('../../../dbQuery')
    , config = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/config_ecslcucall').config
    , chart_list = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/config_ecslcucall').list
    , hostsList = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/config_ecslcucall').ecsHosts
    , ecsInterval = require('../../../plugin_config/'+sysConfig.province+'/tuxedo/lcu/config_ecslcucall').ecsInterval
    , extend = require('extend')
    , async = require('async');
var auth = require('../../../auth');

module.exports = function (app) {

    app.get('/tuxedo/lcu/ecsCallByTime.html', auth.requiresLogin, function(req, res) {
        var date = req.query.date,
            chartList = chart_list.ecsLcuCallList[0],
            tab = config[chartList.mode+chartList.type+chartList.subtype];
        res.renderPjax('plugin/tuxedo/lcu/ecsCallByTime', {
            tabColNames: tab.colNames,
            hosts: hostsList,
            value: date,
            interval: ecsInterval[1],
            headTile: tab.name,
            _start: new Date(tab.startTime[0]).getTime(),
            _end: new Date(tab.endTime[0]).getTime()
        });
    });

    app.get('/getTranscodeByHost', function (req, res) {
        var date = req.query.date,
            host = req.query.host;

        var command = {
            "distinct" : 'TuxStateBase20150521',
            "key": "TRANSCODE",
            "query": {
                host: host
            }
        };
        db.db.executeDbCommand(command, function(err, docs){
            if(err) {
                logger.error(err);
            }
            res.send(docs.documents[0].value);
        });
    });

    app.get('/getECSCallByTimeData', function(req, res) {
        var host = req.query.host,
            date = req.query.date,
        //transcode = req.query.TRANSCODE,
            start = req.query._start,
            _cnt = req.query._cnt || 18,
            interval = req.query.interval,
            chartList = chart_list.ecsLcuCallList[0],
            tab = config[chartList.mode+chartList.type+chartList.subtype];

        var yyyy = date.split('-')[0],
            mm = ("000" + date.split('-')[1]).substr(-2),
            dd = ("000" + date.split('-')[2]).substr(-2),
            tabname = db.model('QueryResult', tab.mode+tab.type+tab.subtype+yyyy+mm+dd);

        var conf = [],
            isexist = {'TRANSCODE':{'$exists':true}};
        for(var i=0; i<_cnt; i++){
            conf.push({
                host: host,
                timestamp: {
                    '$gt': parseInt(start) + i*interval*60*1000,
                    '$lt': parseInt(start) + (i+1)*interval*60*1000 - 1
                }
            });
        }

        async.parallel({
            0: function(cb){tabname.count(conf[0], isexist, cb);},
            1: function(cb){tabname.count(conf[1], isexist, cb);},
            2: function(cb){tabname.count(conf[2], isexist, cb);},
            3: function(cb){tabname.count(conf[3], isexist, cb);},
            4: function(cb){tabname.count(conf[4], isexist, cb);},
            5: function(cb){tabname.count(conf[5], isexist, cb);},
            6: function(cb){tabname.count(conf[6], isexist, cb);},
            7: function(cb){tabname.count(conf[7], isexist, cb);},
            8: function(cb){tabname.count(conf[8], isexist, cb);},
            9: function(cb){tabname.count(conf[9], isexist, cb);},
            10: function(cb){tabname.count(conf[10], isexist, cb);},
            11: function(cb){tabname.count(conf[11], isexist, cb);},
            12: function(cb){tabname.count(conf[12], isexist, cb);},
            13: function(cb){tabname.count(conf[13], isexist, cb);},
            14: function(cb){tabname.count(conf[14], isexist, cb);},
            15: function(cb){tabname.count(conf[15], isexist, cb);},
            16: function(cb){tabname.count(conf[16], isexist, cb);},
            17: function(cb){tabname.count(conf[17], isexist, cb);}
        }, function(err, results){
            var docs = [
                { 'TIME':'09:30', 'count': results['0'] },
                { 'TIME':'09:40', 'count': results['1'] },
                { 'TIME':'09:50', 'count': results['2'] },
                { 'TIME':'10:00', 'count': results['3'] },
                { 'TIME':'10:10', 'count': results['4'] },
                { 'TIME':'10:20', 'count': results['5'] },
                { 'TIME':'10:30', 'count': results['6'] },
                { 'TIME':'10:40', 'count': results['7'] },
                { 'TIME':'10:50', 'count': results['8'] },
                { 'TIME':'11:00', 'count': results['9'] },
                { 'TIME':'11:10', 'count': results['10'] },
                { 'TIME':'11:20', 'count': results['11'] },
                { 'TIME':'11:30', 'count': results['12'] },
                { 'TIME':'11:40', 'count': results['13'] },
                { 'TIME':'11:50', 'count': results['14'] },
                { 'TIME':'12:00', 'count': results['15'] },
                { 'TIME':'12:10', 'count': results['16'] },
                { 'TIME':'12:20', 'count': results['17'] },
            ];
            res.send(docs);
        });
    });

}