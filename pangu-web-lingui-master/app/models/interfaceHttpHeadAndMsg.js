/*
 * 接口http报文
 *
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = require('../controllers/connectFactory').getConnection('httpDb');

var keyWordSchema = new Schema({
    TransIDO : {type : String},
    OrigDomain : {type : String},
    HomeDomain : {type : String},
    BIPCode : {type : String},
    BIPVer : {type : String},
    ActivityCode : {type : String},
    ActionCode : {type : String},
    ActionRelation : {type : String},
    RouteType : {type : String},
    RouteValue : {type : String},
    ProcID : {type : String},
    ProcessTime : {type : String},
    TransIDC : {type : String},
    CutOffDay : {type : String},
    OSNDUNS : {type : String},
    HSNDUNS : {type : String},
    ConvID : {type : String},
    TestFlag : {type : String},
    MsgSender : {type : String},
    MsgReceiver : {type : String},
    SvcContVer : {type : String},
    MSG : {type : String},
    PROVINCE_CODE : {type : String},
    host : {type : String},
    timestamp : {type : Number},
    TransIDH : {type : Number},
    RspType : {type : Number},
    RspCode : {type : Number},
    RspDesc : {type : Number},
    Time : {type : String},
    Param : {type : String}
});

db.model('InterfaceHttpHeadAndMsg', keyWordSchema);
