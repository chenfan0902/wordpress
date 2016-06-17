/*
 * 接口xml报文
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('soapDb');

var rspMsgSchema = new Schema({
    TRANS_IDO : {type : String},
    TIME : {type: String},
    RSP_TYPE : {type : String},
    RSP_CODE : {type : String},
    RSP_DESC : {type : String},
    //TIME : {type: Date, default : Date.now},
    MSG : {type : String}
});

//mongoose.model('InterfaceSoapRspMsg',rspMsgSchema);
db.model('InterfaceSoapRspMsg', rspMsgSchema);
