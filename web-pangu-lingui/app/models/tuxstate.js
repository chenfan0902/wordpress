
/**
 * Module dependencies.
 * TuxState 
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var db = require('../controllers/connectFactory').getConnection('tuxedoDb');


var QueryResultSchema = new Schema({
    _id: {type:String},
	TRANSCODE: {type:String},
	SVRNAME: {type:String},
	host: {type:String},
	STARTTIME: {type: String},
	hours: {type: Number},
	AVERAGE: {type: Number},
	day: {type:Number},
	_count: {type:Number},
	MAX: {type:Number},
	ERRORDETAIL: {type: String},
	ERRORID: {type: String},
    CALLED: {type:Number},
	timestamp: {type:Number},
    ip: {type: String},
    staffId: {type: String},
    provinceCode: {type: String},
    eparchyCode: {type: String},
    departId: {type: String}
});

var methods = {
	
	list : function(option, cb) {
		this.find(option.filter||{}, option.colNames.join(' '))
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


clone(QueryResultSchema.statics, methods)

db.model('QueryResult', QueryResultSchema);
