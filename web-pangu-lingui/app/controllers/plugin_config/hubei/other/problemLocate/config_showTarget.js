var scopeNames = {'day':'日', 'month':'月', 'year':'年'}

exports.collectTimeList = [1,2,3,4,5,6,7,8,9,10,12,15,20,21,25,30,35,40,60,90,120,150,180,210,240]

exports.graphConfig = {
	TuxStateCalledSumByRealTime: {
		name: '调用总数',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true}},
		filterColNames: ['timestamp','host'],
		color: "#f0471a",
		delayTime:5000,
		sort: {'timestamp' : 1}
	},
	TuxStateFailedSumByRealTime: {
		name: '异常总数',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true}},
		filterColNames: ['timestamp','host'],
		color: "#f0471a",
		delayTime:5000,
		sort: {'timestamp' : 1}
	},
	TuxStateQueueSumByRealTime: {
		name: '队列总数',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true}},
		filterColNames: ['timestamp','host'],
		color: "#f0471a",
		delayTime:5000,
		sort: {'timestamp' : 1}
	},
  TuxStateTimeOutTopByRealTime: {
		name: '超时总数',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true}},
		filterColNames: ['timestamp','host'],
		color: "#f0471a",
		delayTime:5000,
		sort: {'timestamp' : 1}
	}
}

exports.graphList = {   
	ShowSvcCalledSum:[ {mode:'TuxState', type:'CalledSum',subtype:'ByRealTime',value:'2014-02-18'}],
	ShowFailedSum:[ {mode:'TuxState', type:'FailedSum',subtype:'ByRealTime',value:'2014-02-18'}],
	ShowQueueSum:[ {mode:'TuxState', type:'QueueSum',subtype:'ByRealTime',value:'2014-02-18'}],
	ShowTimeOutSum:[ {mode:'TuxState', type:'TimeOutTop',subtype:'ByRealTime',value:'2014-02-18'}]
}