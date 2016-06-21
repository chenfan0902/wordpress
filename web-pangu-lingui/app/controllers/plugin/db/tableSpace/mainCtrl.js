var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var  debug = require('debug')('pangu:top')
  , util = require("util")
  , async = require('async');
var auth = require('../../../auth');
var connectName = require('../../../plugin_config/'+sysConfig.province+'/db/tableSpace/config').connect;

var db = require('../../../connectFactory').getConnection('databaseDb');
var formatDate = require('../../../util').formatDate;
module.exports = function (app) {
    app.get('/db/tableSpace/main.html', auth.requiresLogin, function(req, res) {
        var value = req.query.date;
        var queryUrl = '/historyDetail.html?date='+ value;
        res.renderPjax('plugin/db/result/historyDetail', {
            titles: ['序号','数据库标识', '数据库', 'TS_NAME','FREE_SPACE','TS_SIZE','USED_SPACE','USED_PCT','状态'],
            queryUrl: queryUrl,
            errors: req.flash('error')
        });
    });

    app.get('/historyDetail.html', auth.requiresLogin, function(req, res) {
        var  iDisplayStart = req.query.iDisplayStart;
        var iDisplayLength = req.query.iDisplayLength;
        iDisplayStart = parseInt(iDisplayStart)
        iDisplayLength = parseInt(iDisplayLength)
        var sSearch = req.query.sSearch;
        var value = req.query.date;
        var render = function(results){
            var output = {};
            var temp = [];
            output.sEcho = parseInt(req.query.sEcho);
            output.aaData = [];
            var count=0;
            results.docs.forEach(function(item,idx){
                for(var i=0;i<item['result'].length;i++) {
                    temp.push(count);
                    temp.push(item['connect']);
                    temp.push(connectName[item['connect']]);
                    temp.push(item['result'][i]['TS_NAME']);
                    temp.push(item['result'][i]['FREE_SPACE']);
                    temp.push(item['result'][i]['TS_SIZE']);
                    temp.push(item['result'][i]['USED_SPACE']);
                    temp.push(item['result'][i]['USED_PCT']);
                    if((item.result[i].USED_PCT).replace("%","")>90)
                    {

                        temp.push('<font color=red>告警</font>');

                    }else {
                        temp.push('正常');
                    };
                    count++;

                    if ( iDisplayStart<=count && count<=(iDisplayStart+iDisplayLength ))
                    {
                        output.aaData.push(temp);
                    }
                    temp = [];
                    }
            })
            output.iTotalRecords = count;
            output.iTotalDisplayRecords = count;
            var response = JSON.stringify(output);
            res.send(response);
        }
        value = formatDate(value, 'yyyy-MM-dd')
        var collection = 'DbStateBase'+ value;
        var table = db.model('dbStateResultInfo',collection);
        var filter ={'name': 'tabspace'};
        if (sSearch && sSearch != ""){
            try{
                filter.connect = new RegExp(sSearch);
            }catch(e){
                logger.debug("err=%s", e.message);
                var sSearchTemp  = /\sSearch/;
                filter.connect = sSearchTemp;
            }
        }
        async.parallel({

            docs: function (callback) {
                table.find(filter)
                    .sort({'connect':1})
                    .exec( function(err,result){
                    callback(null, result);
                });
            }
        }, function(err, results){
            if(err){
                logger.error(err);
            }

            render(results);
        });
    });
};