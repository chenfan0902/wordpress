/*
 * 错误类型
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('tuxedoDb');

var lcuErrorTypeSchema = new Schema({
    errorKey : {type : String},
    errorDetail : {type : String},
    analysisInfo : {type : String}
});


var methods = {
	
	list : function(option, cb) {
		this.find(option.filter||{})
			.sort(option.sort||{})
			.limit(option.prePage||option.limit||0)
			.skip(option.prePage?option.page*option.prePage:option.skip||0)
			.exec(cb)
	},
	
	getCount : function(option,cb) { 
        var count = 0;
        this.count(option.filter||{}, function (err, cnt) {  
            if(err){
                throw new Error(err);
            }
           cb(cnt);
        });
    }           	
}

var clone = function(target, source) {
	for(var key in source) 
		target[key] = source[key]
}

clone(lcuErrorTypeSchema.statics, methods)

db.model('lcuErrorTypeInfo',lcuErrorTypeSchema);