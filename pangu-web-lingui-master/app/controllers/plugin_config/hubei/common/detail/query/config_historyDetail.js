var scopeNames = {'day':'日', 'month':'月', 'year':'年'}

exports.config = {

	TuxStateTimeOutTopHis : {
	  name: '流程超时清单(日)',
	  scopes: ['day'],
	  displayLength:10,
		titles: ['排名','流程名', '耗时(s)', '归属服务', '主机', '统计时间'],
		colNames: ['#', 'TRANSCODE', 'MAX', 'SVRNAME', 'host', 'STARTTIME'],
		filterColNames: ['TRANSCODE', 'SVRNAME', 'host', 'STARTTIME'],
		sort: {'MAX':-1}
	},

    TuxStateTimeOutTopHisMonth : {
		name: '流程超时清单(月)',
		scopes: ['month'],
		displayLength:10,
		titles: ['排名','流程名', '耗时(s)', '归属服务', '主机', '统计时间'],
		colNames: ['#', 'TRANSCODE', 'MAX', 'SVRNAME', 'host', 'STARTTIME'],
		filterColNames: ['TRANSCODE', 'SVRNAME', 'host', 'STARTTIME'],
		sort: {'MAX':-1}
	},

    TuxStateTimeOutTopSvcTimeOut : {
        name: '服务超时明细(日)',
        scopes: ['day'],
        displayLength:10,
        titles: ['排名','服务名', '耗时(s)', '主机', '统计时间'],
        colNames: ['#', 'SVRNAME', 'MAX',  'host', 'STARTTIME'],
        filterColNames: ['SVRNAME', 'host', 'STARTTIME'],
        sort: {'MAX':-1}
    },

    TuxStateTimeOutTopSvcTimeOutMonth : {
        name: '服务超时明细(月)',
        scopes: ['month'],
        displayLength:10,
        titles: ['排名','服务名', '耗时(s)', '主机', '统计时间'],
        colNames: ['#', 'SVRNAME', 'MAX',  'host', 'STARTTIME'],
        filterColNames: ['SVRNAME', 'host', 'STARTTIME'],
        sort: {'MAX':-1}
    },

    TuxStateTimeOutStatHis : {
        name: '超时比例大于10%流程分析',
        scopes: ['day'],
        displayLength:10,
        queryType:'mapreduce',
        titles: ['流程名', '调用总数', '平均时间>10s调用数', '平均时间>5s调用数','平均时间>2s调用数', '>2s占比', '总记录数','最大耗时>10s记录数','最大耗时>5s记录数','最大耗时>2s记录数','>2s占比','主机'],
        colNames: ['TRANSCODE', 'calledsum','avg_gt_10s','avg_gt_5s','avg_gt_2s','avg_gt_2s_rate','count','max_gt_10s','max_gt_5s','max_gt_2s','max_gt_2s_rate','host']
    },

    TuxStateTimeOutStatHisRate : {
        name: '超时流程分析(日)',
        scopes: ['day'],
        displayLength:10,
        titles: ['流程名', '调用总数', '平均时间>60s调用数','平均时间>30s调用数', '平均时间>5s调用数','平均时间>2s调用数', '>2s占比', '总记录数','最大耗时>60s记录数','最大耗时>30s记录数','最大耗时>5s记录数','最大耗时>2s记录数','>2s占比','主机', '操作'],
        colNames: ['TRANSCODE', 'avgcount','avg_gt_60s','avg_gt_30s','avg_gt_5s','avg_gt_2s','avg_gt_2s_rate','maxcount','max_gt_60s','max_gt_30s','max_gt_5s','max_gt_2s','max_gt_2s_rate','host', 'state'],
        filterColNames: ['TRANSCODE','host']
        //sort: {'max_gt_60s':-1, 'max_gt_30s':-1, 'max_gt_5s':-1, 'max_gt_2s':-1}
    },

    TuxStateTimeOutStatHisRateMONTH : {
        name: '超时流程分析(月)',
        scopes: ['month'],
        displayLength:10,
        titles: ['流程名', '调用总数', '平均时间>60s调用数','平均时间>30s调用数', '平均时间>5s调用数','平均时间>2s调用数', '>2s占比', '总记录数','最大耗时>60s记录数','最大耗时>30s记录数','最大耗时>5s记录数','最大耗时>2s记录数','>2s占比','主机', '操作'],
        colNames: ['TRANSCODE', 'avgcount','avg_gt_60s','avg_gt_30s','avg_gt_5s','avg_gt_2s','avg_gt_2s_rate','maxcount','max_gt_60s','max_gt_30s','max_gt_5s','max_gt_2s','max_gt_2s_rate','host', 'state'],
        filterColNames: ['TRANSCODE','host']
        //sort: {'max_gt_60s':-1, 'max_gt_30s':-1, 'max_gt_5s':-1, 'max_gt_2s':-1}
    },

    warningQuery : {
        name: '异常警告明细',
        scopes: ['suffix'],
        hostDisFlag:0,
        displayLength:10,
        titles: ['序号', '异常明细', '异常时间','异常主机'],
        colNames: ['#', 'detail','time','host'],
        filterColNames: ['detail','host'],
        sort: {'time':-1}
    },
    spt_bh_sqltimeoutQuery : {
        name: 'oracle超时SQL列表',
        scopes: ['suffix'],
        displayLength:10,
        hostDisFlag:0,
        bVisibleFlag:2,
        detailTitle:'sql_text',
        titles: ['序号', 'sql_id', 'sql_text','db_id','session_serials','username','exetime','cpu_time','disk_reads','update_time'],
        colNames: ['#', 'sql_id','sql_text','db_id','session_serials','username','exetime','cpu_time','disk_reads','update_time'],
        filterColNames: ['sql_id','db_id'],
        sort: {'exetime':-1}
    }

}

exports.list = {

    historyTopDetailList:[ {mode:'TuxState', type:'TimeOutTop',subtype:'His'}],
    historyTopDetailMonthList:[ {mode:'TuxState', type:'TimeOutTop',subtype:'HisMonth'}],
    historySvcTimeOutDetailList:[ {mode:'TuxState', type:'TimeOutTop',subtype:'SvcTimeOut'}],
    historySvcTimeOutDetailMonthList:[ {mode:'TuxState', type:'TimeOutTop',subtype:'SvcTimeOutMonth'}],
    lcuTimeTopAnalyse:[ {mode:'TuxState', type:'TimeOutStat',subtype:'His'}],
    lcuTimeTopAnalyseRate:[ {mode:'TuxState', type:'TimeOutStat',subtype:'HisRate'}],
    lcuTimeTopAnalyseRateMonth:[ {mode:'TuxState', type:'TimeOutStat',subtype:'HisRateMONTH'}],
    getWarning:[ {mode:'warn', type:'ing',subtype:'Query'}],
    getOracleSqlTimeoutList:[ {mode:'spt_bh_', type:'sqltimeout',subtype:'Query'}]
}
