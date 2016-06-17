/*
 * 用户订阅关系
 *
 * */
var mongoose = require('mongoose');
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSubscriptionRel = new Schema({
    user_name : {type : String},
    SubscriptionId : {type : String},
    SubscriptionTitle : {type : String},
    relType : {type : String},
    Unread : {type : String},
    SubscriptDate : {type : Date, default : Date.now}
});

db.model('UserSubscriptionRel',userSubscriptionRel);
