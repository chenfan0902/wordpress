var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');

var queueSchema = new Schema({
    _id: {type : ObjectId},
    PID: {type: Number},
    host: {type: String},
    TIME: {type: String},
    TRANSCODE: {type: String},
    content: {type: String},
    timestamp: {type: Number}
});

db.model('LcuPoint', queueSchema);