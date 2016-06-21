var scopeNames = {'day':'全省-日', 'month':'全省-月', 'year':'年'}


//柱状图配置
exports.barConfig = {
	
	TuxStateCalledSumByTimeByLcuDay: {
		name: '流程调用总量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumByTimeByLcu',
		subtype:'',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count'],
		filter: {},
		filterColNames: ['TRANSCODE'],
		statType:'LCU',
		sort: {'hours' : 1}
	},
	
	TuxStateCalledSumByTimeByLcuMonth: {
		name: '流程调用总量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumByTime',
		subtype:'',
		scopes: ['month'],
		scopeNames: scopeNames,
		colNames : [ 'day', '_count'],
		filter: {},
		filterColNames: ['TRANSCODE'],
		statType:'LCU',
		sort: {'day' : 1}
	},

	TuxStateFailedSumByTimeByLcuDay: {
		name: '流程调用异常总量',
		displayType:'bar',
		mode:'TuxState',
		type:'FailedSumByTimeByLcu',
		subtype:'',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count'], 
		filter: {},
		filterColNames: ['TRANSCODE'],
		statType:'LCU',
		sort: {'hours' : 1}
	},
	TuxStateFailedSumByTimeByLcuMonth: {
		name: '流程调用异常总量',
		displayType:'bar',
		mode:'TuxState',
		type:'FailedSumByLcu',
		subtype:'',
		scopes: ['month'],
		scopeNames: scopeNames,
		colNames : [ 'day', '_count'], 
		filter: {},
		filterColNames: ['TRANSCODE'],
		statType:'LCU',
		sort: {'hours' : 1}
	},
	
	TuxStateCalledSumByTimeBySvrDay: {
		name: '服务调用总量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumByTimeBySvr',
		subtype:'',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count'], 
	    filter: {},
		filterColNames: ['SVRNAME'],
		statType:'SVR',
		sort: {'hours' : 1}
	},
	TuxStateCalledSumByTimeBySvrMonth: {
		name: '服务调用总量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumByTime',
		subtype:'',
		scopes: ['month'],
		scopeNames: scopeNames,
		colNames : [ 'day', '_count'], 
	    filter: {},
		filterColNames: ['SVRNAME'],
		statType:'SVR',
		sort: {'hours' : 1}
	},
	
	TuxStateFailedSumByTimeBySvrDay: {
		name: '服务异常量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumByTimeBySvr',
		subtype:'',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count'], 
		filter: {},
		filterColNames: ['SVRNAME'],
		statType:'SVR',
		sort: {'hours' : 1}
	},
	TuxStateFailedSumByTimeBySvrMonth: {
		name: '服务异常量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumByTime',
		subtype:'',
		scopes: ['month'],
		scopeNames: scopeNames,
		colNames : [ 'day', '_count'], 
		filter: {},
		filterColNames: ['SVRNAME'],
		statType:'SVR',
		sort: {'hours' : 1}
	}
	
}

exports.barList = {
    
  lcuCalledSumList:[ {mode:'TuxState', type:'CalledSumByTimeByLcu',subtype:'Day'},{mode:'TuxState',type:'CalledSumByTime',subtype:'ByLcuMonth'}],
  lcuFailedSumList:[ {mode:'TuxState', type:'FailedSumByTimeByLcu',subtype:'Day'},{mode:'TuxState', type:'FailedSumByTime',subtype:'ByLcuMonth'}],
  svcCalledSumList:[ {mode:'TuxState', type:'CalledSumByTimeBySvr',subtype:'Day'},{mode:'TuxState', type:'CalledSumByTime',subtype:'BySvrMonth'}],
  svcFailedSumList:[ {mode:'TuxState', type:'FailedSumByTimeBySvr',subtype:'Day'},{mode:'TuxState', type:'FailedSumByTime',subtype:'BySvrMonth'}]

}


//排名配置

exports.topConfig = {
	
	TuxStateCalledSumByLcuDay: {
		name: '流程调用量排名',
		displayType:'top',
		mode:'TuxState',
		type:'CalledSumByLcu',
		subtype:'',
		scopes: ['day'],
		scopeNames: "全省-日",
		colNames : [ 'TRANSCODE', '_count' ], 
		filter : {TRANSCODE: {$exists: true}, host: 'all'},
		sort: {'_count' : -1}
	},
	TuxStateCalledSumByLcuMonth: {
		name: '流程调用量排名',
		displayType:'top',
		mode:'TuxState',
		type:'CalledSumByLcu',
		subtype:'',
		scopes: ['month'],
		scopeNames: "全省-月",
		colNames : [ 'TRANSCODE', '_count' ], 
		filter : {TRANSCODE: {$exists: true}, host: 'all'},
		sort: {'_count' : -1}
	},
	TuxStateFailedSumByLcuDay: {
		name: '流程异常量排名',
		displayType:'top',
		mode:'TuxState',
		type:'FailedSumByLcu',
		subtype:'',
		scopes: ['day'],
		scopeNames: "全省-日",
		colNames: ['TRANSCODE', '_count'],
		filter: {TRANSCODE: {$exists: true}, host: 'all'},
        sort: {'_count' : -1}
	},
	TuxStateFailedSumByLcuMonth: {
		name: '流程异常量排名',
		displayType:'top',
		mode:'TuxState',
		type:'FailedSumByLcu',
		subtype:'',
		scopes: ['month'],
		scopeNames: "全省-月",
		colNames: ['TRANSCODE', '_count'],
		filter: {TRANSCODE: {$exists: true}, host: 'all'},
        sort: {'_count' : -1}
	},
	
	TuxStateCalledSumBySvrDay: {
		name: '服务调用量排名',
		displayType:'top',
		mode:'TuxState',
		type:'CalledSumBySvr',
		subtype:'',
		scopes: ['day'],
		scopeNames: "全省-日",
		colNames : [ 'SVRNAME', '_count' ], 
		filter : {SVRNAME: {$exists: true}, host: 'all'},
		sort: {'_count' : -1}
	},
	TuxStateCalledSumBySvrMonth: {
		name: '服务调用量排名',
		displayType:'top',
		mode:'TuxState',
		type:'CalledSumBySvr',
		subtype:'',
		scopes: ['month'],
		scopeNames: "全省-月",
		colNames : [ 'SVRNAME', '_count' ], 
		filter : {SVRNAME: {$exists: true}, host: 'all'},
		sort: {'_count' : -1}
	},
	
	TuxStateFailedSumBySvrDay: {
		name: '服务异常量排名',
		displayType:'top',
		mode:'TuxState',
		type:'FailedSumBySvr',
		subtype:'',
		scopes: ['day'],
		scopeNames: "全省-日",
		colNames : [ 'SVRNAME', '_count' ], 
		filter : {SVRNAME: {$exists: true}, host: 'all'},
		sort: {'_count' : -1}
	},
	TuxStateFailedSumBySvrMonth: {
		name: '服务异常量排名',
		displayType:'top',
		mode:'TuxState',
		type:'FailedSumBySvr',
		subtype:'',
		scopes: ['month'],
		scopeNames: "全省-月",
		colNames : [ 'SVRNAME', '_count' ], 
		filter : {SVRNAME: {$exists: true}, host: 'all'},
		sort: {'_count' : -1}
	}
	
}

exports.topList =  {
    lcuCalledSumList:[ {mode:'TuxState', type:'CalledSumByLcu',subtype:'Day'},{mode:'TuxState', type:'CalledSumByLcu',subtype:'Month'}],
    lcuFailedSumList:[ {mode:'TuxState', type:'FailedSumByLcu',subtype:'Day'},{mode:'TuxState', type:'FailedSumByLcu',subtype:'Month'}],
    svcCalledSumList:[ {mode:'TuxState', type:'CalledSumBySvr',subtype:'Day'},{mode:'TuxState', type:'CalledSumBySvr',subtype:'Month'}],
    svcFailedSumList:[ {mode:'TuxState', type:'FailedSumBySvr',subtype:'Day'},{mode:'TuxState', type:'FailedSumBySvr',subtype:'Month'}]
}
