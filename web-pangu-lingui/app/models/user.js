/*
 * 用户资料
 *
 * */
var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('cmdDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    user_id: {type : ObjectId},
    user_name : {type : String},
    nick_name : {type : String},
    provinceCode : {type : String},
    password : {type : String},
    phone: {type : Number},
    email : {type : String},
    create_time : {type : Date, default : Date.now},
    update_time : {type: Date, default : Date.now},
    audit_tag : {type: Number, default : 0},
    is_admin  : {type: Boolean, default : false}
});

mongoose.model('User',userSchema);
exports.User = db.model('User');
