var cHosts = require('../../../config_hosts')
  , scopeNames = {'day':'日', 'month':'月', 'year':'年'}
  , hosts = cHosts.hosts;

exports.queue = {
    realQueue: [{mode: 'Host', type: 'Queue', subtype: 'Real'}, {mode: 'Tux', type: 'Que', subtype: 'Base'}],
    hisQueue: [{mode: 'Host', type: 'Queue', subtype: 'His'}, {mode: 'Tux', type: 'Que', subtype: 'Base'}],
    queueFields: ['Queue1', 'Queue2', 'Queue3', 'Queue4', 'Queue5', 'Queue6', 'Queue7'],
    queueLabels: ['队列1', '队列2', '队列3', '队列4', '队列5', '队列6', '队列7'],
    testFields: ['MAX', 'AVERAGE', 'MIN'],
    testLabels: ['最大时间', '平均时间', '最小时间'],

    anaTabColNames: ['服务', '队列', '队列配置', '队列深度(<5)', '队列深度(5-10)', '队列深度(10-20)',
        '队列深度(>20)', '总记录数', '使用情况', '最大使用'/*, '建议配置'*/],
    anaListTab: [{mode: 'Tux', type: 'Que', subtype: 'ListDAY'}],
    anaBaseTab: [{mode: 'Tux', type: 'Que', subtype: 'Base'}],
    sort: [{max_queued: -1}],
    hosts: hosts
}

exports.hosts = hosts;

exports.config = {
    TuxQueBase: {
        name: '队列基础表',
        realQueue: [{mode: 'Host', type: 'Queue', subtype: 'Real'}, {mode: 'Tux', type: 'Que', subtype: 'Base'}],
        hisQueue: [{mode: 'Host', type: 'Queue', subtype: 'His'}, {mode: 'Tux', type: 'Que', subtype: 'Base'}],
        queueFields: ['Queue1', 'Queue2', 'Queue3', 'Queue4', 'Queue5', 'Queue6', 'Queue7'],
        queueLabels: ['队列1', '队列2', '队列3', '队列4', '队列5', '队列6', '队列7'],
        testFields: ['MAX', 'AVERAGE', 'MIN'],
        testLabels: ['最大时间', '平均时间', '最小时间'],

        anaTabColNames: ['服务', '队列', '队列配置', '队列深度(<5)', '队列深度(5-10)', '队列深度(10-20)',
            '队列深度(>20)', '总记录数',/* '使用情况',*/ '最大使用'/*, '建议配置'*/],
        anaListTab: [{mode: 'Tux', type: 'Que', subtype: 'ListDAY'}],
        anaBaseTab: [{mode: 'Tux', type: 'Que', subtype: 'Base'}],
        sort: {max_queued: -1}
    },

    TuxQueListDAY: {
        name: '队列监控分析(日)',
        scopes: ['day'],
        displayLength: 10,
        titles: ['服务', '队列', '队列配置', '队列深度(<5)', '队列深度(5-10)', '队列深度(10-20)',
            '队列深度(>20)', '总记录数',/* '使用情况',*/ '最大使用'/*, '建议配置'*/, '操作'],
        colNames: ['name', 'queue','serve','lt_5','m5-10','m10-20','ge20','sum','','max_queued'],
        filterColNames: ['TRANSCODE','host'],
        sort: [{max_queued: -1}]
    },

    TuxQueListMONTH: {
        name: '队列监控分析(月)',
        scopes: ['month'],
        displayLength: 10,
        titles: ['服务', '队列', '队列配置', '队列深度(<5)', '队列深度(5-10)', '队列深度(10-20)',
            '队列深度(>20)', '总记录数', /*'使用情况',*/ '最大使用'/*, '建议配置'*/, '操作'],
        colNames: ['name', 'queue','serve','lt_5','m5-10','m10-20','ge20','sum','','max_queued'],
        filterColNames: ['TRANSCODE','host'],
        sort: [{max_queued: -1}]
    }
};

exports.list = {
    queueAnalyzeBaseList: [ {mode:'Tux', type:'Que',subtype:'Base'}],
    queueAnalyzeMaxList: [ {mode:'Tux', type:'Que',subtype:'Base'}],
    queueAnalyzeListDAY: [ {mode:'Tux', type:'Que',subtype:'ListDAY'}],
    queueAnalyzeListMONTH: [ {mode:'Tux', type:'Que',subtype:'ListMONTH'}]
};