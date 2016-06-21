var config = {
    AlarmWS3GESSCalledSum: {
        name: "3GESS 分析",
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        sort: {'timestamp': 1}
    },

    AlarmWS3GESSGroup: {
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        filterOperate: {'operatename': {$exists: true}},
        filterService: {'servicename': {$exists: true}},
        sort: {'timestamp': 1},
        tabColNames_CODE: ['servicename', 'operatename', 'rspcode', '出现次数', '占比(%)'],
        codeAnddesc: []
    },

    AlarmWS3GHTTPCalledSum: {
        name: "3G_HTTP 分析",
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        sort: {'timestamp': 1}
    },

    AlarmWS3GHTTPGroup: {
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        filterOperate: {'operatename': {$exists: true}},
        filterService: {'servicename': {$exists: true}},
        sort: {'timestamp': 1},
        tabColNames_CODE: ['servicename', 'operatename', 'rspcode', '出现次数', '占比(%)'],
        codeAnddesc: []
    },

    AlarmWSCUSTCalledSum: {
        name: "CUST 分析",
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        sort: {'timestamp': 1}
    },

    AlarmWSCUSTGroup: {
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        filterOperate: {'operatename': {$exists: true}},
        filterService: {'servicename': {$exists: true}},
        sort: {'timestamp': 1},
        tabColNames_CODE: ['servicename', 'operatename', 'rspcode', '出现次数', '占比(%)'],
        codeAnddesc: []
    },

    AlarmWSCBSSCalledSum: {
        name: "CBSS 分析",
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        sort: {'timestamp': 1}
    },

    AlarmWSCBSSGroup: {
        scopes: ['day'],
        displayLength: 10,
        filterColNames: [{'host':1, 'servicename':1, 'operatename':1, 'rspcode':1, '_id':0}],
        filterOperate: {'operatename': {$exists: true}},
        filterService: {'servicename': {$exists: true}},
        sort: {'timestamp': 1},
        tabColNames_CODE: ['servicename', 'operatename', 'rspcode', '出现次数', '占比(%)'],
        codeAnddesc: []
    }
}

var list = {
    alarmWS3GESSCalledSumList:[ {mode:'AlarmWS', type:'3GESS',subtype:'CalledSum'}],
    alarmWS3GESSGroupList:[ {mode:'AlarmWS', type:'3GESS',subtype:'Group'}],
    alarmWS3GHTTPCalledSumList:[ {mode:'AlarmWS', type:'3GHTTP',subtype:'CalledSum'}],
    alarmWS3GHTTPGroupList:[ {mode:'AlarmWS', type:'3GHTTP',subtype:'Group'}],
    alarmWSCUSTCalledSumList:[ {mode:'AlarmWS', type:'CUST',subtype:'CalledSum'}],
    alarmWSCUSTGroupList:[ {mode:'AlarmWS', type:'CUST',subtype:'Group'}],
    alarmWSCBSSCalledSumList:[ {mode:'AlarmWS', type:'CBSS',subtype:'CalledSum'}],
    alarmWSCBSSGroupList:[ {mode:'AlarmWS', type:'CBSS',subtype:'Group'}]
}

exports.config = config;
exports.list = list;