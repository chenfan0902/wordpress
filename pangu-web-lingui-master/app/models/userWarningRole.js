/*
 * 用户告警角色
 *
 * */
var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;

var userWarningRole = new Schema({
    user_name : {type : String},
    role : {type : String},
    start_time : {type : String},
    end_time : {type : String}
});

db.model('userWarningRole',userWarningRole);
