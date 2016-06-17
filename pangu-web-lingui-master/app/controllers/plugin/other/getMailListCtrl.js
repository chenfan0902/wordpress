var logger = require('../../log').logger;
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../config/config')[env];
var db = require('../../connectFactory').getConnection('tuxedoDb')
  , debug = require('debug')('pangu:top')
  , util = require("util")
  , query = require('../../dbQuery')
  , async = require('async')
  , extend = require('extend')
  , util = require('../../../libs/utils');

var auth = require('../../auth');
var warningType = {'error':'异常','timeOut':'超时'};

module.exports = function (app) {

    app.get('/other/getMailList.html', auth.requiresLogin, function(req, res) {

        var headTile = "异常告警列表";
        var queryUrl = "/getAllMailData";
        res.renderPjax('plugin/other/getMailList',{
            titles: ['排名', '异常标题', '异常类型', '是否已读', '异常日期','异常id'],
            queryUrl:queryUrl,
            headTile:headTile
        });
    });

    app.get('/getAllMailData', function(req, res,next) {

        var user_name  = '';
        try{
            user_name = req.session.user.user_name;
        }catch(error)
        {
            ContentType = "text/plain";
            res.StatusCode =500;
            res.write("会话超时，请重新登录！");
            res.end();
            return;
        }
        var iDisplayStart = req.query.iDisplayStart;
        var iDisplayLength = req.query.iDisplayLength;
        var sSearch = req.query.sSearch;

        if(!iDisplayStart) {iDisplayStart = 0;}
        if(!iDisplayLength) {iDisplayLength = 10;}
        var filter = {'user_name':user_name};

        if (sSearch && sSearch != ""){
            filter.$or = [];
            ['SubscriptionTitle', 'Unread', 'relType'].forEach(function(col){
                var obj = {};
                obj[col] = new RegExp(sSearch);
                filter.$or.push(obj);
            });
        }


        var render = function(count,docs){
            var output = {};
            var temp = [];
            output.sEcho = parseInt(req.query.sEcho);
            output.iTotalRecords = count;
            output.iTotalDisplayRecords = count;
            output.aaData = [];

            docs.forEach(function(item,idx){
                ['#','SubscriptionTitle', 'relType', 'Unread', 'SubscriptDate','SubscriptionId'].forEach(function(col){
                    if(col == '#') {
                        temp.push(parseInt(iDisplayStart)+1+idx);
                    }else{
                        temp.push(item[col]);
                    }
                });
                output.aaData.push(temp);
                temp = [];
            });
            var response = JSON.stringify(output);
            res.send(response);
        };

        var table = db.model('UserSubscriptionRel','UserSubscriptionRel');
        async.parallel({
            count: function(cb){
                table.count(filter,cb);
            },
            docs: function(cb){
                table.find(filter, ['#','SubscriptionTitle', 'relType', 'Unread', 'SubscriptDate','SubscriptionId'].join(' '))
                    .sort({'Unread' : 1}).limit(iDisplayLength||0).skip(iDisplayStart||0)
                    .exec(function(err, resultRow){
                        if(err) return next(err);
                        if(resultRow){
                            resultRow.forEach(function(row){
                                if(row.Unread == '0')
                                    row.Unread = '未读';
                                else
                                    row.Unread = '已读';

                                row.SubscriptDate = util.format_date(row.SubscriptDate);
                                row.relType = warningType[row.relType];
                            });
                            cb(null, resultRow);
                        }
                    });
            }
        }, function(err, results){
            if(err){
                logger.error(err);
            }
            render(results.count, results.docs);
        });
    });
};
