/*
 * 接口xml报文
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('soapDb');

var msgHeadSchema = new Schema({
    TRANS_IDO : {type : String},
    SERVICE_NAME : {type : String},
    OPERATE_NAME : {type : String},
    ROUTE_TYPE : {type: String},
    ROUTE_VALUE : {type: String},
    PROC_ID : {type : String},
    OPER_ID : {type : String},
    PROVINCE_CODE : {type : String},
    EPARCHY_CODE : {type : String},
    CITY_CODE : {type : String},
    CHANNEL_ID : {type : String},
    CHANNEL_TYPE : {type : String},
    SYS_ID : {type : String},
    host : {type : String},
    REQ_TIME : {type : String},
    RSP_TIME : {type : String},
    t : {type : Number},
    RSP_CODE : {type : String},
    timestamp : {type : Number}
});

//mongoose.model('InterfaceSoapHead',msgHeadSchema);
db.model('InterfaceSoapHead', msgHeadSchema);
