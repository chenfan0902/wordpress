var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');

var memorySchema = new Schema({
    timestamp : {type : Number},  //add timestamp
    time : {type: String},
    name : {type : String},  //user ==> name
    pid : {type : String},  //processId ==> pid
    cpu: {type: Number}, //cpu ==> size
    size: {type: Number} //memory ==> size
});

db.model('memorymonitor',memorySchema);