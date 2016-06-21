var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var queueSchema = new Schema({
    qa_id: {type : ObjectId},
    host: {type: String},
    name: {type: String},
    queue: {type: String},
    lt_5: {type: Number},
    'm5-10': {type: Number},
    'm10-20': {type: Number},
    'ge20': {type: Number},
    overflow: {type: Number},
    sum: {type: Number},
    serve: {type: Number},
    max_queued: {type: Number},
    suggestion: {type: Number}
});

db.model('QueueAnalyze', queueSchema);