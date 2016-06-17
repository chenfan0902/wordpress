/*
 * 接口xml报文
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('soapDb');

var intfMultiStatSchema = new Schema({
    _id : {type : String},
    type : {type : String},
    CALLED : {type : Number},
    SUCCESS : {type : Number},
    PENDING : {type : Number},
    '0000' : {type: Number},
    '9999' : {type: Number},
    FAILED : {type : Number},
    '9988' : {type : Number},
    '0001' : {type : Number},
    timestamp : {type : Number}
});

//mongoose.model('IntfMultiSchema',intfMultiStatSchema);
db.model('IntfMultiSchema', intfMultiStatSchema);
