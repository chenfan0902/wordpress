//graph开头为曲线图配置，detail开头为明细配置，meter开头为仪表盘配置
var scopeNames = {'day':'日', 'month':'月', 'year':'年'}

exports.graphConfig = {
	TuxStateCalledSumByRealTimeAt29: {
		name: '调用总数',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},host:'132.34.11.29'},
		filterColNames: ['timestamp','TRANSCODE'],
		color: "#f0471a",
		delayTime:5000,
		collectTimeList: [30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600],
		sort: {'timestamp' : 1}
	},
	TuxStateFailedSumByRealTimeAt28: {
		name: '异常总数',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},host:'132.34.11.28'},
		filterColNames: ['timestamp'],
		color: "#46bb00",
		delayTime:5000,
		collectTimeList: [30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600],
		sort: {'timestamp' : 1}
	},
	TuxStateQueueSumByRealTimeAt28: {
		name: '队列总数',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},host:'132.34.11.28'},
		filterColNames: ['timestamp'],
		color: "#46bb00",
		delayTime:5000,
		collectTimeList: [30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600],
		sort: {'timestamp' : 1}
	}
}

exports.graphList = {
    
	realTimeLcuSumCompareChart:[
	                               [ {mode:'TuxState', type:'CalledSum',subtype:'ByRealTimeAt28',value:'2014-02-18',hostName: '主机28'},{mode:'TuxState', type:'CalledSum',subtype:'ByRealTimeAt28',value:'2014-02-18',hostName: '主机28'}],
	                               [ {mode:'TuxState', type:'FailedSum',subtype:'ByRealTimeAt29',value:'2014-02-18',hostName: '主机29'},{mode:'TuxState', type:'FailedSum',subtype:'ByRealTimeAt29',value:'2014-02-18',hostName: '主机29'}],
	                               [ {mode:'TuxState', type:'QueueSum',subtype:'ByRealTimeAt29',value:'2014-02-18',hostName: '主机29'},{mode:'TuxState', type:'QueueSum',subtype:'ByRealTimeAt29',value:'2014-02-18',hostName: '主机29'}]
	                           ]
}
