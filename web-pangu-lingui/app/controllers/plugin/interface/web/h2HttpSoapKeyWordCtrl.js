var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var soap = require('../../../connectFactory').getConnection('soapDb');
var http = require('../../../connectFactory').getConnection('httpDb');
var htwo = require('../../../connectFactory').getConnection('htwoDb');
var  logger = require('../../../log').logger;
var  extend = require('extend');
var  query = require('../../../dbQuery');
var  mUtil = require('../../../util');
var  aConfig = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').config;
var  aList = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').list;
var  prov = require('../../../config/'+sysConfig.province+'/config_multi').province;
var  provCode = require('../../../config/'+sysConfig.province+'/config_multi').provinceCode;
var  mutil = require('../../../util');
var  async = require('async');
var auth = require('../../../auth');

module.exports = function(app) {

    app.get('/interface/web/h2HttpSoapKeyWord.html', auth.requiresLogin, function (req, res) {
        var date = req.query.date || mutil.formatDate(null, 'yyyy-MM-dd'),
            chartList = req.query.chartList,
            chartlist = aList[chartList][0],
            qConfig = aConfig[chartlist.mode + chartlist.type + chartlist.subtype];

        switch (chartList) {

            case "soapHttpH2KeyWordList":
                res.renderPjax('plugin/interface/web/h2HttpSoapKeyWord', {
                    title: qConfig.title,
                    value: date,
                    user: req.session.user,
                    tabColNames: qConfig.colNames,
                    chartList: chartList
                });
                break;
            default :
                logger.error("==========, Not Match Route, ==========");
                break;
        }
    });

    app.get('/getH2HttpSoapKeyWordData', function (req, res) {//查询PhoneNum或TradeId数据
        var chartList = req.query.chartList;//soapHttpH2KeyWordList
        var chartlist = aList[chartList][0];//  soapHttpH2KeyWordList:[ {mode:'soapHttpH2', type:'KeyWord',subtype:'List'}],
        var qConfig = aConfig[chartlist.mode + chartlist.type + chartlist.subtype];
        /*
         * soapHttpH2KeyWordList: {
         title: "关键字(PHONE, TRADE_ID)查询",
         headList: "interfaceSoapHeadProvList",
         reqMsgList: "interfaceSoapReqMsgProvList",
         rspMsgList: "interfaceSoapRspMsgProvList",
         queryList: [
         {mode: 'InterfaceSoap', type: 'KeyWord', scopes: ['hash'], t: 'soap'},
         {mode: 'InterfaceHttp', type: 'KeyWord', scopes: ['hash'], t: 'http'},
         {mode: 'InterfaceH2', type: 'KeyWord', scopes: ['hash'], t: 'h2'}
         ],
         colNames: colNames
         },

         * */
        var date = req.query.date;
        var key = req.query.key; //chartList标识查询类型(PhoneNum, TradeId);key 为对应的值
        var conf = {};
        conf.key = key;
        var mJsHash = mUtil.mJsHash(key) % 5;
        var queryList = qConfig.queryList || [];
        /*
         queryList: [
         {mode: 'InterfaceSoap', type: 'KeyWord', scopes: ['hash'], t: 'soap'},
         {mode: 'InterfaceHttp', type: 'KeyWord', scopes: ['hash'], t: 'http'},
         {mode: 'InterfaceH2', type: 'KeyWord', scopes: ['hash'], t: 'h2'}
         ],
         */
        var queryTable = {};
        for (var i = 0; i < queryList.length; i++) {
            var item = queryList[i];
            var list = item.list;
            var tmpName = query.getTableName(item.mode, item.type, item.scopes[0], date, {hash: mJsHash});
            queryTable[item.t] = returnQueryFnDeatil(tmpName, item.t);
        }

        function returnQueryFnDeatil(tablename, type) {
            if (type === 'soap') {
                return function (cb) {
                    soap.collection(tablename).find(conf, {_id: 0}).toArray(cb);
                };
            } else if (type === 'http') {
                return function (cb) {
                    http.collection(tablename).find(conf, {_id: 0}).toArray(cb);
                };
            } else if (type === 'h2') {
                return function (cb) {
                    htwo.collection(tablename).find(conf, {_id: 0}).toArray(cb);
                };
            }
        }

        async.parallel(queryTable, function (err, results) {
            if (err) {
                logger.error(err);
            }
            var soapCnt = results.soap && results.soap.length || 0;
            var httpCnt = results.http && results.http.length || 0;
            var h2Cnt = results.h2 && results.h2.length || 0;
            res.send({
                soapCnt: soapCnt,
                httpCnt: httpCnt,
                h2Cnt: h2Cnt,
                soap: results.soap || [],
                http: results.http || [],
                h2: results.h2 || []
            });
        });
    });
}