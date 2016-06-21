var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('soapDb');
var logger = require('../../../log').logger;
var extend = require('extend');
var query = require('../../../dbQuery');
//, aConfig = require('../../plugin_config/'+sysConfig.province+'/interfaceWEB/config_interface_rspcode').config
//, aList = require('../../plugin_config/'+sysConfig.province+'/interfaceWEB/config_interface_rspcode').list
//, mutil = require('../../util')
var async = require('async');
var auth = require('../../../auth');

module.exports = function (app) {

    app.get('/InterfaceRspCode.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'] || "2015-05-29";
        //chartBList = req.query['chartBList'],
        //chart_blist = aList[chartBList][0],
        //qConfig = aConfig[chart_blist.mode+chart_blist.type+chart_blist.subtype];//��ȡ����config_interface_xmlƴд����

        res.renderPjax('plugin/interfaceWeb/InterfaceRspCode', {//չʾ��ʼ��ҳ��
            title: "��ͼ��",
            value: date
        });
    });

    app.get('/interface/web/rspCodeAll.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'] || "2015-05-29";
        //chartBList = req.query['chartBList'],
        //chart_blist = aList[chartBList][0],
        //qConfig = aConfig[chart_blist.mode+chart_blist.type+chart_blist.subtype];//��ȡ����config_interface_xmlƴд����

        res.renderPjax('plugin/interface/web/rspCodeAll', {//չʾ��ʼ��ҳ��
            title: "��ͼ����ʡ",
            value: date
        });
    });

    app.get('/InterfaceRspCodeData', function(req, res) {//��ѯPhoneNum��TradeId���
        var province_code = req.query['province_code'];


        var conf = {};
        conf["rsp_code_info"] = province_code+"_rsp_code_info";

        var tableName = "spt_b_rspcode";
        //logger.info("tableName----"+tableName);
        //var table = db.model("RspCodeSchema", tableName);
        var docs_t = [];


        db.collection(tableName).find(conf, {_id: 0}).toArray(function(err, rows){
            if(err){
                logger.error(err);
            }
            //logger.debug(rows)
            if(rows.length <= 0){

                return;
            }

            var result = [];
            var rsp_code={};

            // result['result'] = rows[0];
            rsp_code= rows[0]["rsp_code"];
            for(var key in rsp_code){
                result.push({
                    label: key,
                    data:parseInt(rsp_code[key])
                });
            }
            res.send(result);
        });
    });

    app.get('/InterfaceRspCodeAllData', function(req, res) {//����ʡ��
        var province_code = req.query['province_code'];
        //logger.debug(province_code);
        var conf = {};

        conf["rsp_code_info"] = new RegExp("_rsp_code_info");
        //conf["rsp_code_info"] = province_code+"_rsp_code_info";

        var tableName = "spt_b_rspcode";
        //logger.info("tableName----"+tableName);
        //var table = db.model("RspCodeSchema", tableName);
        var docs_t = [];

        db.collection(tableName).find(conf, {_id: 0}).toArray(function(err, rows){
            if(err){
                logger.error(err)
            }

            if(rows.length <= 0){

                return;
            }
            var results=[];
            for(var x=0;x<rows.length;x++){
                var rsp_code= rows[x]["rsp_code"];
                var rsp_code_info=rows[x]["rsp_code_info"];
                var result = [];
                result.push({
                    label: "other",
                    data:parseInt(rsp_code["other"])
                });
                result.push({
                    label: "9999",
                    data:parseInt(rsp_code["9999"])
                });
                result.push({
                    label: "0000",
                    data:parseInt(rsp_code["0000"])
                });

                results.push({
                    rsp_code_info:rsp_code_info.substring(0,2),
                    code:result
                } );
            }

            res.send(results);
        });
    });
};
