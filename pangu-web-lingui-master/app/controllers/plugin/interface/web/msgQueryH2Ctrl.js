var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var htwo = require('../../../connectFactory').getConnection('htwoDb');
var logger = require('../../../log').logger;
var extend = require('extend');
var query = require('../../../dbQuery');
var mUtil = require('../../../util');
var aConfig = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').config;
var aList = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').list;
var prov = require('../../../config/'+sysConfig.province+'/config_multi').province;
var provCode = require('../../../config/'+sysConfig.province+'/config_multi').provinceCode;
var mutil = require('../../../util');
var async = require('async');
var auth = require('../../../auth');

module.exports = function(app){

    app.get('/interface/web/msgQueryH2.html', auth.requiresLogin, function(req, res){
        var date = req.query.date || mutil.formatDate(null, 'yyyy-MM-dd'),
            chartlist = req.query.chartList || 'IntfH2HeadAndMsgPROV',
            qConfig = aConfig[chartlist],
            transido = req.query.TRANS_IDO;

        var conf = {
            TRADE_ID: transido
        };

        var tabhead = query.getTableName(qConfig.list[0].mode, qConfig.list[0].type, qConfig.list[0].scopes[0], date);
        var tabreq = query.getTableName(qConfig.list[1].mode, qConfig.list[1].type, qConfig.list[1].scopes[0], date);
        var tabrsp = query.getTableName(qConfig.list[2].mode, qConfig.list[2].type, qConfig.list[2].scopes[0], date);

        async.parallel({
            head: function(cb){
                htwo.collection(tabhead).find(conf, {_id: 0}).toArray(cb);
            },
            req: function(cb){
                htwo.collection(tabreq).find(conf, {_id: 0}).toArray(cb);
            },
            rsp: function(cb){
                htwo.collection(tabrsp).find(conf, {_id: 0}).toArray(cb);
            }
        }, function (err, results) {
            if(err){
                logger.error(err);
            }
            var data = JSON.parse(JSON.stringify(results.head && results.head[0] || '{}'));
            var req = JSON.parse(JSON.stringify(results.req && results.req[0] || '{}'));
            var rsp = JSON.parse(JSON.stringify(results.rsp && results.rsp[0] || '{}'));
            for(var key in req){
                if(key === 'TIME'){
                    data.REQ_TIME = req[key];
                }else if(key === 'MSG'){
                    data.REQ_MSG = req[key];
                }else{
                    data[key] = req[key];
                }
            }
            for(key in rsp){
                if(key === 'TIME'){
                    data.RSP_TIME = rsp[key];
                }else if(key === 'MSG'){
                    data.RSP_MSG = rsp[key];
                }else{
                    data[key] = rsp[key];
                }
            }
            data.TRANSFER_TIME = ((new Date(data.RSP_TIME).getTime() - new Date(data.REQ_TIME).getTime()) || '-') + ' (ms)';
            res.renderPjax('plugin/interface/web/msgQueryH2', {
                title: "报文详情",
                value: date,
                TRANS_IDO: transido,
                data: data
            });
        });

        /*var tabname = query.getTableName(qConfig.list[0].mode, qConfig.list[0].type, qConfig.list[0].scopes[0], date);

        htwo.collection(tabname).find(conf, {_id: 0}).toArray(function (err, rows) {
            if(err){
                logger.error(err);
            }
            var data = rows[0] || {};
            data.TRANSFER_TIME = ((new Date(data.RSP_TIME).getTime() - new Date(data.REQ_TIME).getTime()) || '-') + ' (ms)';
            res.renderPjax('plugin/interface/web/msgQueryH2', {
                title: "报文详情",
                value: date,
                TRANS_IDO: transido,
                data: data
            });

        });*/
    });
}
