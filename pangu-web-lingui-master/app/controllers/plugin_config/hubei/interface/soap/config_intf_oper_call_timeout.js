/**
 * Created by wanzhou on 15/8/7.
 */
var config = {
    InterfaceSoapHeadPROV: {
        name: '接口Soap日志调用超时分析',
        scopes: ['prov'],
        queryType: 'mapreduce',
        schemaName: 'InterfaceSoapHead',
        allTime: 3600000, // 1000 * 60 * 60 ==> 1 hour
        interval: 60000, // 1000 * 60 ==> 1 minute
        titles: ['操作名', '省份', '>10s调用数', '>5s调用数', '>2s调用数', '>10s占比', '>5s占比', '>2s占比', '总记录数'],
        colNames: ['OPERATE_NAME', 'PROVINCE_CODE', 'gt_10s', 'gt_50s', 'gt_1s', 'gt_10s_rate', 'gt_5s_rate', 'gt_2s_rate', 'count'],
        filterColNames: ['TRANSCODE','host'],
        sort: {'gt_60s':-1, 'gt_30s':-1, 'gt_5s':-1, 'gt_2s':-1}
    }
};

var list = {
    intfSoapCallTimeOutList:[ {mode:'InterfaceSoap', type:'Head',subtype:'PROV'}]
}

exports.config = config;
exports.list = list;