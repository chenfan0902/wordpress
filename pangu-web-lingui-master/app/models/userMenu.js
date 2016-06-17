/*
 * 用户菜单
 *
 * */
var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('cmdDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userMenuSchema = new Schema({
    user_name : {type : String},
    menu_id : {type : String},
    state : {type: Number, default : 0},
    update_time : {type : Date, default : Date.now},
    start_time : {type: Date, default : Date.now},
    end_time : {type: Date, default : Date.now}
});

db.model('userMenu',userMenuSchema);
