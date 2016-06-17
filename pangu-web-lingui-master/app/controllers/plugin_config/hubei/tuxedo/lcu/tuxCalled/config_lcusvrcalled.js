var scopeNames = {'day':'单台主机-日', 'month':'单台主机-月', 'year':'年'}


//柱状图配置
exports.barConfig = {

	TuxStateCalledSumLcuByHourByHostDay: {
		name: '流程调用量',
		displayType:'bar',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : {_id:0, TRANSCODE:0, host:0},
		filterColNames: ['TRANSCODE'],
		tabColNames: ["时间(时)", "调用数"],
		statType:'LCU',
		sort: {'hours' : 1},
		schemaName: "QueryResult"
	},

	TuxStateCalledSumLcuByHourByHostMonth: {
		name: '流程调用量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumLcuByHourByHost',
		subtype:'',
		scopes: ['month'],
		scopeNames: scopeNames,
		colNames : {_id:0, TRANSCODE:0, host:0},
		filter: {},
		filterColNames: ['TRANSCODE'],
		tabColNames: ["时间(日)", "调用数"],
		statType:'LCU',
		sort: {'hours' : 1},
		schemaName: "QueryResult"
	},

	TuxStateCalledSumSvrByHourByHostDay: {
		name: '服务调用量',
		displayType:'bar',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : {_id:0, SVRNAME:0, host:0},
		filter: {},
		filterColNames: ['SVRNAME'],
		tabColNames: ["时间(时)", "调用数"],
		statType:'SVR',
		sort: {'hours' : 1},
		schemaName: "QueryResult"
	},
	TuxStateCalledSumSvrByHourByHostMonth: {
		name: '服务调用量',
		displayType:'bar',
		mode:'TuxState',
		type:'CalledSumSvrByHourByHost',
		subtype:'',
		scopes: ['month'],
		scopeNames: scopeNames,
		colNames : {_id:0, SVRNAME:0, host:0},
		filter: {},
		filterColNames: ['SVRNAME'],
		tabColNames: ["时间(日)", "调用数"],
		statType:'SVR',
		sort: {'hours' : 1},
		schemaName: "QueryResult"
	},
	TuxStateFailedSumLcuByHourByHostDay:{
		name: '流程异常量',
		displayType:'bar',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : {_id:0, TRANSCODE:0, host:0},
		filterColNames: ['TRANSCODE'],
		tabColNames: ["时间(时)", "调用数"],
		statType:'LCU',
		sort: {'hours' : 1},
		schemaName: "QueryResult"
	},
	TuxStateFailedSumSvrByHourByHostDay: {
		name: '服务异常量',
		displayType:'bar',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : {_id:0, SVRNAME:0, host:0},
		filter: {},
		filterColNames: ['SVRNAME'],
		tabColNames: ["时间(时)", "调用数"],
		statType:'SVR',
		sort: {'hours' : 1},
		schemaName: "QueryResult"
	}

}

exports.barList = {

	lcuCalledDayList:[ {mode:'TuxState', type:'CalledSumLcuByHourByHost',subtype:'Day'}],
	lcuCalledMonthList:[ {mode:'TuxState',type:'CalledSumLcuByHourByHost',subtype:'Month'}],
	svcCalledDayList:[ {mode:'TuxState', type:'CalledSumSvrByHourByHost',subtype:'Day'}],
	svcCalledMonthList:[ {mode:'TuxState', type:'CalledSumSvrByHourByHost',subtype:'Month'}],
	lcuFailedCalledDayList:[{mode:'TuxState', type:'FailedSumLcuByHourByHost',subtype:'Day'}],
	svcFailedCalledDayList:[{mode:'TuxState', type:'FailedSumSvrByHourByHost',subtype:'Day'}]
}
