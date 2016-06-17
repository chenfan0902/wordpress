/*
 * 接口xml报文
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('soapDb');

var reqMsgSchema = new Schema({
    TRANS_IDO : {type : String},
    TIME : {type: String},
    //TIME : {type: Date, default : Date.now},
    MSG : {type : String}
});

//mongoose.model('InterfaceSoapReqMsg',reqMsgSchema);
db.model('InterfaceSoapReqMsg', reqMsgSchema);
