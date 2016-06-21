exports.detailConfig = {
    
	TuxStateTimeOutDetail : {
	  name: '实时流程超时明细',
	  scopes: ['noHave'],
	  delayTime:1000*60*60,
	  displayLength:10,
		titles: ['排名','流程名', '耗时(s)', '归属服务', '主机', '统计时间'],
		colNames: ['#', 'TRANSCODE', 'MAX', 'SVRNAME', 'host', 'STARTTIME'],
		filterColNames: ['TRANSCODE', 'SVRNAME', 'host', 'STARTTIME','timestamp'],
		sort: {'MAX':-1}
	},
	
	TuxStateCalledSumByLcu : {
	  name: '实时流程调用量明细',
	  scopes: ['day'],
	  delayTime:2000,
	  displayLength:50,
		titles: [ '排名', '流程名', '次数' ],
		colNames: [ '#', 'TRANSCODE', '_count' ],
		filterColNames: ['TRANSCODE','STARTTIME','timestamp'],
		sort: {'MAX':-1}
	},
	
	TuxStateCalledSumByLcu1 : {
	  name: '实时流程异常量明细',
	  scopes: ['day'],
	  delayTime:2000,
	  displayLength:50,
		titles: [ '排名', '流程名', '次数' ],
		colNames: [ '#', 'TRANSCODE', '_count' ],
		filterColNames: ['TRANSCODE','STARTTIME','timestamp'],
		sort: {'MAX':-1}
	},
	
	TuxStateSvcDeadDetail : {
	  name: '实时服务僵死明细',
	  scopes: ['day'],
	  delayTime:2000,
	  displayLength:50,
		titles: ['排名','服务名', '主机', '统计时间'],
		colNames: ['#', 'SVRNAME', 'host', 'STARTTIME'],
		filterColNames: ['SVRNAME','STARTTIME','timestamp'],
		sort: {'MAX':-1}
	},
	
	TuxStateTimeOutDetailBySvc : {
	  name: '实时服务超时明细',
	  scopes: ['noHave'],
	  delayTime:1000*60*60,
	  displayLength:50,
		titles: ['排名','服务名', '耗时(s)', '主机', '统计时间'],
		colNames: ['#', 'SVRNAME', 'MAX', 'host', 'STARTTIME'],
		filterColNames: ['SVRNAME', 'host', 'STARTTIME','timestamp'],
		sort: {'MAX':-1}
	},
	
	TuxStateCalledSumBySvc : {
	  name: '实时服务调用量明细',
	  scopes: ['day'],
	  delayTime:2000,
	  displayLength:50,
		titles: [ '排名', '服务名', '次数' ],
		colNames: [ '#', 'SVRNAME', '_count' ],
		filterColNames: ['SVRNAME','STARTTIME','timestamp'],
		sort: {'MAX':-1}
	},
	
	TuxStateCalledSumBySvc1 : {
	  name: '实时服务异常量明细',
	  scopes: ['day'],
	  delayTime:2000,
	  displayLength:50,
		titles: [ '排名', '服务名', '次数' ],
		colNames: [ '#', 'SVRNAME', '_count' ],
		filterColNames: ['SVRNAME','STARTTIME','timestamp'],
		sort: {'MAX':-1}
	},
	warningByTime: {
	  name: '实时异常提醒明细',
	  scopes: ['suffix'],
	  delayTime:300000,
	  displayLength:100,
		titles: ['序号', '异常明细', '异常时间','异常主机'],
		colNames: ['#', 'detail','time','host'],
		filterColNames: ['detail'],
		sort: {'time':-1}
	}
}

exports.detailList = {  
	realtimeLcuTimeoutDetailList:[ {mode:'TuxState', type:'TimeOutDetail',subtype:''}],
	realTimeLcuCalledSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'ByLcu'}],
	realTimeLcuFailSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'ByLcu1'}],
	realTimeSvcDeadDetailList:[ {mode:'TuxState', type:'SvcDead',subtype:'Detail'}],
	realTimeSvcTimeOutDetailList:[ {mode:'TuxState', type:'TimeOutDetail',subtype:'BySvc'}],
	realTimeSvcCalledSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'BySvc'}],
	realTimeSvcFailedSumChart:[ {mode:'TuxState', type:'CalledSum',subtype:'BySvc1'}],
	realTimeWarningChart:[ {mode:'warn', type:'ing',subtype:'ByTime'}]
}
