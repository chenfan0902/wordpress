var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('soapDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var queueSchema = new Schema({
    _id: {type : ObjectId},
    host: {type: String},
    timestamp: {type: Number},
    SERVICE_NAME: {type: String},
    OPERATE_NAME: {type: String},
    TRANS_IDO: {type: String},
    PROC_ID: {type: String},
    OPER_ID: {type: String},
    PROCESS_TIME: {type: Number},
    EPARCHY_CODE: {type: String},
    CITY_CODE: {type: String},
    RSP_CODE: {type: String},
    RSP_DESC: {type: String},
    REQUSET_INFO: [{
        REQUSET_CODE: {type: Number},
        REQUSET_DESC: {type: String}
    }]
});

db.model('Trade4GModel', queueSchema);
