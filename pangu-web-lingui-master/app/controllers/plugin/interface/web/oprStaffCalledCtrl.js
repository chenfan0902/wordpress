//var mongoose = require('mongoose');
var logger = require('../../../log').logger;
var query = require('../../../dbQuery');
var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var aConfig = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').config;
var aList = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_xml').list;
var province = require('../../../plugin_config/'+sysConfig.province+'/interface/web/config_interface_other').province;
var async = require('async');
//var provinceRegion = require('../../../config/'+sysConfig.province+'/regionConfig').provinceRegion;
//var regionName = require('../../../config/'+sysConfig.province+'/regionConfig').regionName;
var auth = require('../../../auth');
var mutil = require('../../../util');
var extend = require('extend');
var db = require('../../../connectFactory').getConnection('soapDb');

module.exports = function (app) {

    app.get('/interface/web/oprStaffCalled.html', auth.requiresLogin, function(req, res){
        var chartCList = req.query.chartList;
        var date = req.query.date;
        var pChartList = aList[chartCList][0];
        var cConfig = aConfig[pChartList.mode+pChartList.type+pChartList.subtype];

        var render = function(resultSet){
            res.renderPjax('plugin/interface/web/oprStaffCalled',{
                item:resultSet,
                date:date,
                chartList:chartCList,
                title:cConfig.name
            });
        };

        async.parallel({
            docs: function (callback) {
                var tabname = query.getTableName(pChartList.mode, pChartList.type, cConfig.scopes[0], date);
                var table = db.model('IntfMultiSchema', tabname);
                var filter = {};
                if(cConfig.filter) {
                    extend(true, filter, cConfig.filter);
                }
                table
                    .find(filter)
                    .sort({CALLED:-1})
                    .limit(20)
                    .exec(function (err, docs) {
                        if (err) {
                            logger.error(err);
                        }
                        callback(null, docs);
                    });
            }
        },function(err, results) {
            if (err) {
                logger.error(err);
            }
            async.apply(render, results.docs)();
        });
    });

    app.get('/initInterfaceOprStaffCalledDetail.html', auth.requiresLogin, function(req, res){

        //var province = req.query.province;
        var chartList = req.query.chartList;
        var pChartList = aList[chartList][0];
        var cConfig = aConfig[pChartList.mode+pChartList.type+pChartList.subtype];
        var queryUrl = '/getInterfaceOprStaffCalledData?&chartList='+chartList+'&date='+ req.query.date||'';
        res.renderPjax('plugin/interface/web/staffCalledDetail',{
            queryUrl:queryUrl,
            title:cConfig.name,
            titles:cConfig.titles
        });

    });

    app.get('/getInterfaceOprStaffCalledData', function(req, res){
        //var province = req.query.province;
        var iDisplayStart = req.query.iDisplayStart;
        var iDisplayLength = req.query.iDisplayLength;
        if(!iDisplayStart) iDisplayStart = 0;
        if(!iDisplayLength) iDisplayLength = 10;
        var sSearch = req.query.sSearch;
        var chartCList = req.query.chartList;
        var pChartList = aList[chartCList][0];
        var cConfig = aConfig[pChartList.mode+pChartList.type+pChartList.subtype];


        var value = req.query.date;

        var tabname = query.getTableName(pChartList.mode, pChartList.type, cConfig.scopes[0],value);
        //var table = db.model('IntfMultiSchema', tabname);

        //var tabname = query.getTableName('InterfaceSoap', 'CalledOperId', 'prov',value);
        var table = db.model('IntfMultiSchema', tabname);
        var filter = {};
        if( cConfig.filter ){
            extend(true, filter, cConfig.filter);
        }
        if( filter.$and === undefined ){
            filter.$and = [];
        }


        if (sSearch && sSearch !== ''){
            try{
                var tmpExp = {
                    _id: new RegExp(sSearch)
                };
                filter.$and.push(tmpExp);
            }catch(e){
                var sSearchTemp  = {
                    _id: /\sSearch/
                };
                filter.$and.push(sSearchTemp);
            }
        }
        if( filter.$and.length === 0 ){
            filter = {};
        }

        var render = function(result){
            var output = {};
            var temp = [];
            output.sEcho = parseInt(req.query.sEcho);
            output.iTotalRecords = result.getCount;
            output.iTotalDisplayRecords = result.getCount;
            output.aaData = [];
            var colNames = cConfig.fieldsName || ['#','_id','CALLED'];
            result.getData.forEach(function(item,idx){
                colNames.forEach(function(col){
                    if(col === '#') {
                        temp.push(parseInt(iDisplayStart)+1+idx);
                    }else{
                        temp.push(mutil.sFieldData(item, col));
                        //temp.push(item[col]);
                    }
                });
                output.aaData.push(temp);
                temp = [];
            });
            var response = JSON.stringify(output);
            res.send(response);
        };


        async.parallel({
            getData:function(callback){
                table
                    .find(filter)
                    .sort({CALLED:-1})
                    .limit(iDisplayLength)
                    .skip(iDisplayStart)
                    .exec(function (err, docs) {
                        if (err) {
                            logger.error(err);
                        }
                        callback(null, docs);
                    });

            },
            getCount:function(callback){
                table.count(filter,function (err, cnt) {
                    if (err) {
                        logger.error(err);
                    }
                    callback(null, cnt);
                });

            }
        },function(err, results) {
            if (err) {
                logger.error(err);
            }
            async.apply(render, results)();
        });

    });
};