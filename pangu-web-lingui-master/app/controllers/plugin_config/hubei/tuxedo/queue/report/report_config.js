var exceptName = ['GWTDOMAIN', 'TMS_ORA', 'JREPSVR', 'GWADM', 'BBL'],
    tabColNames = ['服务`队列', '队列配置', '队列深度(<5)', '队列深度(5-10)', '队列深度(10-20)',
        '队列深度(>20)', '总记录数', '最大使用', '建议配置','占用内存(MB/个)', '内存变化(MB)'];
exports.config = {
    TuxQueueReportDAY: {
        name: '服务部署建议(日)',
        scope: ['day'],
        exceptName: exceptName,
        tabColNames: tabColNames
    },

    TuxQueueReportMONTH: {
        name: '服务部署建议(月)',
        scope: ['month'],
        exceptName: exceptName,
        tabColNames: tabColNames
    }
};

exports.list = {
    queueReportDayList: [ {mode: "Tux", type: "QueueReport", subtype: "DAY"}],
    queueReportMonthList: [ {mode: "Tux", type: "QueueReport", subtype: "MONTH"}]
}