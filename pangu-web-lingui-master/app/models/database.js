
/**
 * Module dependencies.
 * TuxState
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var db = require('../controllers/connectFactory').getConnection('databaseDb');


var dbQueryResultSchema = new Schema({
    _id: {type:String},
    connect : {type : String},
    name : {type : String},
    time:{type: Number},
    ACTIVE:{type: Number}

});

var resultInfoSchema = new Schema({
    connect : {type : String},
    result:[{
        FREE_SPACE:{type: Number},
        TS_NAME:{type: String},
        TS_SIZE: {type: Number},
        USED_PCT: {type: String},
        USED_SPACE:{type: Number}
    }],
    timestamp:{type: Number},
    ACTIVE:{type: Number}
});

var methods = {


    list : function(option, cb) {

        this.find(option.filter||{}, option.colNames.join(' '))
            .sort(option.sort||{})
            .limit(option.prePage||option.limit||0)
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


clone(dbQueryResultSchema.statics, methods)

db.model('dbQueryResult', dbQueryResultSchema);
db.model('dbStateResultInfo', resultInfoSchema);