/*
 * 角色告警权限
 *
 * */
var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;

var roleWarningRight = new Schema({
    role : {type : String},
    type : {type : String},
    level : {type : Number, default : 1},
    mode : {type : String}
});

db.model('roleWarningRight',roleWarningRight);
