/*
 * 接口2报文
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('htwoDb');

var keyWordSchema = new Schema({
    TRADE_ID : {type : String},
    TRADE_NUM : {type : String},
    key : {type : String},
    SYS_ID : {type : String},
    RSP_TIME : {type : String},
    SEND_PORT : {type : String},
    SERVICE_TYPE : {type : String},
    TRADE_TYPE : {type : String},
    OPER_ADDR : {type : String},
    OPER_ID : {type : String},
    RSP_CODE : {type : String},
    TIME : {type : String},
    ID : {type : String},
    ERR_INFO : {type : String},
    host : {type : String},
    timestamp : {type : Number},
    MSG : {type : String}
});

db.model('InterfaceH2HeadAndMsg', keyWordSchema);
