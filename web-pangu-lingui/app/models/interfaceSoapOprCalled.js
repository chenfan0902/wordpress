/*
 * 接口调用数
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('soapDb');

var soapCalledSchema = new Schema({
    key : {type : String},
    type: {type : String},
    CALLED : {type : Number},
    FAILED : {type : Number}
});

//mongoose.model('SoapCalledSchema',soapCalledSchema);
db.model('SoapCalledSchema', soapCalledSchema);
