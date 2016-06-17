var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var intfSchema = new Schema({
    os_id: {type : ObjectId},
    intfName: {type: String},
    areaId: {type: String},
    province: {type: String},
    startTime: {type: Number},
    endTime: {type: Number},
    called: {type: Number},
    success: {type: Number},
    failed: {type: Number},
    rate1: {type: Number},
    rate2: {type: Number}
});

db.model('IntfMonitor', intfSchema);