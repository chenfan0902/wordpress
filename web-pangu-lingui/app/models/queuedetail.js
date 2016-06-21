var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var queueSchema = new Schema({
    qd_id: {type : ObjectId},
    name: {type: String},
    queue: {type: String},
    serve: {type: Number}, //==>分配的任务数
    queued: {type: Number}, //==>任务总数
    ave: {type: Number},
    time: {type: String},
    host: {type: String}
});

db.model('QueueDetail', queueSchema);