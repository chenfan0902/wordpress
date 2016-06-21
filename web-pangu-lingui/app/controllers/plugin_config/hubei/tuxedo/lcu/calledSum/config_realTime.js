var scopeNames = {'day':'日', 'month':'月', 'year':'年'}

exports.graphConfig = {
	TuxStateCalledSumByRealTimeAtDay: {
		name: '流程实时调用量',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},host:'132.34.11.29'},
		filterColNames: ['timestamp','TRANSCODE'],
		color: "#f0471a",
		delayTime:5000,
		statType:'LCU',
		collectTimeList: [30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600],
		sort: {'timestamp' : 1}
	},
	
	TuxStateCalledSumByRealTimeAtDay1: {
		name: '流程实时异常量',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},host:'132.34.11.29'},
		filterColNames: ['timestamp','TRANSCODE'],
		color: "#f0471a",
		delayTime:5000,
		statType:'LCU',
		collectTimeList: [30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600],
		sort: {'timestamp' : 1}
	},
	
	TuxStateCalledSumByRealTimeAtDay2: {
		name: '服务实时调用量',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: true}, TRANSCODE:{$exists:false},host:'132.34.11.29'},
		filterColNames: ['timestamp','SVRNAME'],
		color: "#f0471a",
		delayTime:5000,
		statType:'SVR',
		collectTimeList: [30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600],
		sort: {'timestamp' : 1}
	},
	
	TuxStateCalledSumByRealTimeAtDay3: {
		name: '服务实时异常量',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},host:'132.34.11.29'},
		filterColNames: ['timestamp','TRANSCODE'],
		color: "#f0471a",
		delayTime:5000,
		statType:'SVR',
		collectTimeList: [30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600],
		sort: {'timestamp' : 1}
	}
}

exports.graphList = {
    
	realTimeLcuCalledSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'ByRealTimeAtDay',value:'2014-02-18'}],
	realTimeLcuFailSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'ByRealTimeAtDay1',value:'2014-02-18'}],
	realTimeSvcCalledSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'ByRealTimeAtDay2',value:'2014-02-18'}],
	realTimeSvcFailedSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'ByRealTimeAtDay3',value:'2014-02-18'}]

}