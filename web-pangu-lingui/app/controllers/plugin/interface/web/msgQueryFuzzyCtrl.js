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

    app.get('/interface/web/msgQueryFuzzy.html', auth.requiresLogin, function(req, res){
        var date = req.query.date || mutil.formatDate(null, 'yyyy-MM-dd'),
            chartList = req.query.chartList,
            chartlist = aList[chartList][0],
            qConfig = aConfig[chartlist.mode+chartlist.type+chartlist.subtype];

        res.renderPjax('plugin/interface/web/msgQueryFuzzy', {
            title: qConfig.title,
            value: date,
            tabColNames: qConfig.colNames,
            chartList: chartList});
    });
    app.get('/getH2HttpSoapFuzzyData', function(req, res) {//模糊查询
        var chartList = req.query.chartList;//queryMsgSoapHttpH2FullyList
        var chartlist = aList[chartList][0];//queryMsgSoapHttpH2FullyList:[ {mode:'queryMsg', type:'SoapHttpH2Fully',subtype:'PROV'}],//模糊查询
        var qConfig = aConfig[chartlist.mode+chartlist.type+chartlist.subtype];
        //logger.debug(req.query.useflag+"--"+req.query.start_hour+":"+req.query.start_minute+"------"+req.query.end_hour+":"+req.query.end_minute);

        /*
         * soapHttpH2FullyList: {
         title: "关键字模糊查询",
         headList: "interfaceSoapHeadProvList",
         reqMsgList: "interfaceSoapRspMsgProvList",
         rspMsgList: "interfaceSoapRspMsgProvList",
         queryList: ['InterfaceSoapHeadAndMsgPROVFuzzy', 'InterfaceHttpHeadAndMsgPROV', 'InterfaceH2HeadAndMsgPROV'],
         colNames: colNames
         },
         * */


        var date = req.query.date;
        //logger.debug('date----'+date);


        var stringStartTime = date+" "+req.query.start_hour+":"+req.query.start_minute+":00";
        var stringEndTime = date+" "+req.query.end_hour+":"+req.query.end_minute+":00";
        var timestampStartTime = new Date(stringStartTime).getTime();
        var timestampEndTime = new Date(stringEndTime).getTime();//转化成时间戳


        //logger.debug(timestampStartTime+'---------'+timestampEndTime);
        //logger.debug('queryList---------'+qConfig.queryList);
        var key = req.query.key; //模糊查询chartList;key 为对应的值

        //conf.key = key;

        var mJsHash = mUtil.mJsHash(key)%5;
        var queryList = qConfig.queryList || [];
        //queryList: ['InterfaceSoapHeadAndMsgPROVFuzzy', 'InterfaceHttpHeadAndMsgPROV', 'InterfaceH2HeadAndMsgPROV'],
        var queryTable = {};
        for(var i=0; i<queryList.length; i++) {
            var item = aConfig[queryList[i]];
            var list = item.list;
            /*
             * InterfaceSoapHeadAndMsgPROVFuzzy: {
             type: 'soap',
             key: 'TRANS_IDO',
             list: [
             {mode: 'InterfaceSoap', type: 'ReqMsg',scopes: ['prov'], schemaName: 'InterfaceSoapReqMsg'},
             {mode: 'InterfaceSoap', type: 'RspMsg',scopes: ['prov'], schemaName: 'InterfaceSoapRspMsg'}
             ]
             },
             * */
            //var item = queryList[i];
            //var list = item.list;
            //var tmpName = query.getTableName(item.mode, item.type, item.scopes[0], date);
            for(var x=0;x<list.length;x++){
                var tmpName = query.getTableName(list[x].mode, list[x].type, list[x].scopes[0], date);
                var msgname=list[x].keyname;  //取得字段名
                var conf = {};
                conf[msgname]=new RegExp(key);
                if(req.query.useflag==="yes"){
                    conf.timestamp={$gte:timestampStartTime,$lte:timestampEndTime};
                }

                //conf.MSG=new RegExp(key);
                queryTable[list[x].t+list[x].type] = returnQueryFuzzyFnDeatil(conf ,tmpName, list[x].t);
            }

        }

        function returnQueryFuzzyFnDeatil(conf, tablename, type){

            logger.debug('type--'+type+'tablename----'+tablename);
            if(type === 'soap'){
                return function (cb) {
                    soap.collection(tablename).find(conf, {_id:0}).sort({timestamp:-1}).limit(50).toArray(cb);
                };
            }else if(type === 'http'){
                return function (cb) {
                    http.collection(tablename).find(conf, {_id:0}).sort({timestamp:-1}).limit(50).toArray(cb);
                };
            }else if(type === 'h2'){
                return function (cb) {
                    htwo.collection(tablename).find(conf, {_id:0}).sort({timestamp:-1}).limit(50).toArray(cb);
                };
            }
        }
        async.parallel(queryTable, function (err, results) {
            if(err){
                logger.error(err);
            }
            var soapreq = results.soapReqMsg || [];
            var soaprsp = results.soapRspMsg || [];
            //logger.error('=====',results);
            var soapReqCnt = soapreq.length;
            var soapRspCnt = soaprsp.length;

            var httpreq = results.httpReqMsg || [];
            var httprsp = results.httpRspMsg || [];

            var httpReqCnt = httpreq.length;
            var httpRspCnt = httprsp.length;

            var h2req = results.h2ReqMsg || [];
            var h2rsp = results.h2RspMsg || [];

            var h2ReqCnt = h2req.length;
            var h2RspCnt = h2rsp.length;

            var soapCnt = soapReqCnt +  soapRspCnt;
            var httpCnt = httpReqCnt +  httpRspCnt;
            var h2Cnt = h2ReqCnt +  h2RspCnt;

            for(i=0; i< soapReqCnt; i++){
                soapreq[i].OPERATE_NAME = /\<.*:OPERATE_NAME\>(.*)\<\/.*:OPERATE_NAME\>/.exec(soapreq[i].MSG)[1];

                soapreq[i].RSP_CODE = "请求报文";
            }
            for(i=0; i< httpReqCnt; i++){
                httpreq[i].ActivityCode = /\<ActivityCode\>(.*)\<\/ActivityCode\>/.exec(httpreq[i].MSG)[1];
                httpreq[i].BIPCode = /\<BIPCode\>(.*)\<\/BIPCode\>/.exec(httpreq[i].MSG)[1];
                httpreq[i].RspCode = "请求报文";
            }

            for(i=0 ;i<h2ReqCnt;i++){
                h2req[i].SERVICE_TYPE = h2req[i].MSG.join('`').substring(28,40).trim();
                h2req[i].TRADE_NUM = h2req[i].MSG.join('`').substring(40,60).trim();
                h2req[i].RSP_CODE = "请求报文";
            }

            for(i=0; i< soapRspCnt; i++){
                soaprsp[i].SERVICE_NAME = /\<.*:SERVICE_NAME\>(.*)\<\/.*:SERVICE_NAME\>/.exec(soaprsp[i].MSG)[1];
                soaprsp[i].OPERATE_NAME = /\<.*:OPERATE_NAME\>(.*)\<\/.*:OPERATE_NAME\>/.exec(soaprsp[i].MSG)[1];
            }
            for(i=0; i< httpRspCnt; i++){
                httprsp[i].ActivityCode = /\<ActivityCode\>(.*)\<\/ActivityCode\>/.exec(httprsp[i].MSG)[1];
                httprsp[i].BIPCode = /\<BIPCode\>(.*)\<\/BIPCode\>/.exec(httprsp[i].MSG)[1];
                httprsp[i].RspCode === undefined && (httprsp[i].RspCode = /\<RspCode\>(.*)\<\/RspCode\>/.exec(httprsp[i].MSG)[1]);
            }

            for(i=0 ;i<h2RspCnt;i++){
                h2rsp[i].SERVICE_TYPE = h2rsp[i].MSG.join('`').substring(28,40).trim();
                h2rsp[i].TRADE_NUM = h2rsp[i].MSG.join('`').substring(40,60).trim();
            }

            res.send({
                soapCnt: soapCnt,
                httpCnt: httpCnt,
                h2Cnt: h2Cnt,
                soap: soapreq.concat(soaprsp),
                http: httpreq.concat(httprsp),
                h2: h2req.concat(h2rsp)
            });
        });
    });
};