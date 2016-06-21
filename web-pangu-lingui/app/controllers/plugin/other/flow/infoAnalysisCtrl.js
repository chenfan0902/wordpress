var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var  debug = require('debug')('pangu:top')
  , util = require("util")
  , async = require('async');
var auth = require('../../../auth');

var db = require('../../../connectFactory').getConnection('tuxedoDb');

module.exports = function (app) {
    app.get('/other/flow/infoAnalysis.html', auth.requiresLogin, function(req, res) {


        var render = function(flowInfo){
            res.renderPjax('plugin/other/flow/infoAnalysis',{
                flowInfo:flowInfo,
                errors: req.flash('error')
            });
        }
        var flowId = req.query.flowId||'';
        if(flowId == '') {
            throw new Error('flowId is none');
        }

        var table = db.model('FlowInfo','flow');
        async.parallel({
            flowInfo: function(callback){
                table.findOne({'flowId': flowId}, callback);
            }
        }, function(err, results){
            if(err){
                logger.error(err);
            }
            if(results['flowInfo']){
                render(JSON.stringify(results['flowInfo']));
            }
        });

    });

};