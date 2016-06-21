var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var queueSchema = new Schema({
    os_id: {type : ObjectId},
    time: {type: Number},
    data: [{
        name: {type: String},
        count: {type: Number}
    }]
});

db.model('QueueMonitorHis', queueSchema);
//exports.QueueMonitorHis = mongoose.model('QueueMonitorHis');
