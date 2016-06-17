/*
 * 接口xml报文
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('soapDb');

var keyWordSchema = new Schema({
    TRANS_IDO : {type : String},
    SYS_ID : {type : String},
    key : {type : String}
});

//mongoose.model('InterfaceSoapKeyWord',keyWordSchema);
db.model('InterfaceSoapKeyWord', keyWordSchema);
