var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var soap = require('../../../connectFactory').getConnection('soapDb');
var http = require('../../../connectFactory').getConnection('httpDb');
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

    app.get('/interface/web/msgQuery.html', auth.requiresLogin, function(req, res){
        var date = req.query.date || mutil.formatDate(null, 'yyyy-MM-dd'),
            chartList = req.query.chartList,
            chartlist = aList[chartList][0],
            qConfig = aConfig[chartlist.mode+chartlist.type+chartlist.subtype];

        switch (chartList){
            case "queryMsgSoapHttpH2List":
                res.renderPjax('plugin/interface/web/msgQuery', {
                    title: qConfig.title,
                    value: date,
                    user: req.session.user,
                    province: prov,
                    provinceCode: provCode,
                    tabColNames: qConfig.colNames,
                    chartList: chartList
                });
                break;

            default :
                logger.error("==========, Not Match Route, ==========");
                break;
        }
    });

    function returnQueryFn(conf, tablename, schema, type){
        var table;
        if(type === 'soap'){
            table = soap.model(schema, tablename);
        }else if(type === 'http'){
            table = http.model(schema, tablename);
        }else if(type === 'h2'){
            table = htwo.model(schema, tablename);
        }
        return function(cb){
            table.find(conf, {_id:0}, cb);
        };
    }

    app.get('/InterfaceMsgQueryHeadData', function(req, res) {//查询PhoneNum或TradeId数据
        var chartList = req.query.chartList;//queryMsgSoapHttpH2List
        var chartlist = aList[chartList][0];//queryMsgSoapHttpH2List:[ {mode:'queryMsg', type:'SoapHttpH2',subtype:'List'}],
        var qConfig = aConfig[chartlist.mode+chartlist.type+chartlist.subtype];

        /*
         queryMsgSoapHttpH2List: {
         title: "SOAP/HTTP/H2 报文明细查询",
         headList: "interfaceSoapHeadProvList",
         reqMsgList: "interfaceSoapReqMsgProvList",
         rspMsgList: "interfaceSoapRspMsgProvList",
         queryList: ['InterfaceSoapHeadAndMsgPROV', 'InterfaceHttpHeadAndMsgPROV', 'InterfaceH2HeadAndMsgPROV'],
         colNames: colNames
         },
         * */
        var date = req.query.date;
        var key = req.query.key;
        var queryList = qConfig.queryList || [];
        var queryTable = {};
        for(var i=0; i<queryList.length; i++) {
            var item = aConfig[queryList[i]];
            var list = item.list;
            var tmpName = query.getTableName(list[0].mode, list[0].type, list[0].scopes[0], date);
            var tmpConf = {};
            tmpConf[item.key] = key;
            queryTable[item.type] = returnQueryFn(tmpConf, tmpName, list[0].schemaName, item.type);
        }
        async.parallel(queryTable, function(err, results){
            if(err){
                logger.error(err);
            }
            var soapInfo = results.soap || [];
            var httpInfo = results.http || [];
            var h2Info = results.h2 || [];
            var soapCnt = soapInfo.length || 0;
            var httpCnt = httpInfo.length || 0;
            var h2Cnt = h2Info.length || 0;

            res.send({soapCnt: soapCnt, httpCnt: httpCnt, h2Cnt: h2Cnt, soap: soapInfo, http: httpInfo, h2: h2Info});
        });
    });


};