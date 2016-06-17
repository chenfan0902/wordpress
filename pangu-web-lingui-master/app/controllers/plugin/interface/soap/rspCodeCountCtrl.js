var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var logger = require('../../../log').logger;
var barCfg = require('../../../plugin_config/'+sysConfig.province+'/interface/soap/config_interfaceRspCodeCount').barConfig;
var barList = require('../../../plugin_config/'+sysConfig.province+'/interface/soap/config_interfaceRspCodeCount').barList;
var extend = require('extend');
var query = require('../../../dbQuery');
var hosts = require('../../../plugin_config/'+sysConfig.province+'/interface/soap/config_provice').provice_info;
var auth = require('../../../auth');
var db = require('../../../connectFactory').getConnection('tuxedoDb');
var formatDate = require('../../../util').formatDate;
module.exports = function (app) {

    app.get('/interface/soap/rspCodeCount.html', auth.requiresLogin, function(req, res){
        var chartList = req.query.chartList;
        var chartlist = barList[chartList][0];
        var cConfig = barCfg[chartlist.mode+chartlist.type+chartlist.subtype];

        var date = mutil.formatDate(req.query.date, 'yyyyMMdd');

        res.renderPjax('plugin/interface/soap/rspCodeCount',{
            value: date,
            chartList: chartList,
            headTitle: cConfig.name,
            scopeNames: cConfig.scopeNames[cConfig.scopes[0]],
            hosts: hosts,
            tabColNames: cConfig.tabColNames
        });
    });

    app.get('/getInterfaceRspCodeCountAjaxData', function(req, res){
        //logger.debug("/getInterfaceRspCodeCountAjaxData+++++++++++++++");
        var date = req.query.date
            , host = req.query.host || "11_rsp_code_info"
            , chartList = req.query.chartList
            , chartlist = barList[chartList][0]
            , cConfig = barCfg[chartlist.mode+chartlist.type+chartlist.subtype];

        var tablename = chartlist.mode + chartlist.type + chartlist.subtype + date;
        //logger.debug("tablename+++++++++++++++++++++++++++"+tablename);

        var table = {};
        var conf = {};
        conf.rsp_code_info = host;

        db.collection(tablename).find(conf, cConfig.colNames).sort(cConfig.sort).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            if(rows.length <= 0){
                return;
            }
            res.send(rows);
        });
    });
};
