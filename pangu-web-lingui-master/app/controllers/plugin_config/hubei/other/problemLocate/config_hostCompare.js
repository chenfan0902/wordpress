var scopeNames = {'day':'日', 'month':'月', 'year':'年'}

exports.config = {
	
	TuxStateLocateProblemCompareAt28: {
		name: '主机132.34.11.28',
		scopes: ['day'],
		scopeNames: scopeNames,
		statTypes : {'SvcCalledSum':'服务调用总数', 'SvcFailedSum':'服务异常总数', 'SvcQueueSum':'服务队列总量'},
		colNames : [ 'timestamp', '_count', 'statType' ], 
		filterColNames: ['timestamp'],
		delayTime:5000,
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},statType:{$exists:true},host:'132.34.11.28'},
		sort: {'timestamp' : 1}
	},
	
	TuxStateLocateProblemCompareAt28a: {
		name: '主机132.34.11.28b',
		scopes: ['day'],
		scopeNames: scopeNames,
		statTypes : {'SvcCalledSum':'服务调用总数', 'SvcFailedSum':'服务异常总数', 'SvcQueueSum':'服务队列总量'},
		colNames : [ 'timestamp', '_count', 'statType' ],
		filterColNames: ['timestamp'], 
		delayTime:5000,
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},statType:{$exists:true},host:'132.34.11.28'},
		sort: {'timestamp' : 1}
	},

	TuxStateLocateProblemCompareAt29: {
		name: '主机132.34.11.29',
		scopes: ['day'],
		scopeNames: scopeNames,
		statTypes : {'SvcCalledSum':'服务调用总数', 'SvcFailedSum':'服务异常总数', 'SvcQueueSum':'服务队列总量'},
		colNames : [ 'timestamp', '_count',  'statType' ], 
		filterColNames: ['timestamp'],
		delayTime:5000,
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:true},statType:{$exists:true},host:'132.34.11.29'},
		sort: {'timestamp' : 1}
	}
}


exports.list = [
    {mode:'TuxState', type:'LocateProblemCompare', subtype: 'At28',name: '主机132.34.11.28',value:'2014-02-18'},
    {mode:'TuxState', type:'LocateProblemCompare', subtype: 'At28a',name: '主机132.34.11.281',value:'2014-02-18'},
    {mode:'TuxState', type:'LocateProblemCompare', subtype: 'At29',name: '主机132.34.11.29',value:'2014-02-18'}
]