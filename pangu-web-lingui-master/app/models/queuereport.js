var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var qReportSchema = new Schema({
    host : {type : String},
    name : {type: String},
    queue : {type : String},
    '28max' : {type : Number},
    '28sug': {type: Number},
    '28size': {type: Number},
    '31max' : {type : Number},
    '31sug': {type: Number},
    '31size': {type: Number},
    '02max' : {type : Number},
    '02sug': {type: Number},
    '02size': {type: Number},
    '03max' : {type : Number},
    '03sug': {type: Number},
    '03size': {type: Number}
});

db.model('QueueReport',qReportSchema);