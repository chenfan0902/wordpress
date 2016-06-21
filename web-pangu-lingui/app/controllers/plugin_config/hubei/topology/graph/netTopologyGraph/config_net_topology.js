var i = 0;
var j = 0;
/**
 * switch default: true; hidden default: true; hover default: true;
 */


var weblogcNodes = {
    name: 'WebLogic', hidden: false, hover: false, type: 1, id: j++, children: [
        {name: '10.161.0.41', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.41', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.41', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.41', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.41', type: 4, id: j++}
        ]},
        {name: '10.161.0.42', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.42', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.42', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.42', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.42', type: 4, id: j++}
        ]},
        {name: '10.161.0.43', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.43', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.43', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.43', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.43', type: 4, id: j++}
        ]},
        {name: '10.161.0.44', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.44', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.44', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.44', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.44', type: 4, id: j++}
        ]},
        {name: '10.161.0.45', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.45', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.45', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.45', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.45', type: 4, id: j++}
        ]},
        {name: '10.161.0.46', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.46', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.46', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.46', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.46', type: 4, id: j++}
        ]},
        {name: '10.161.0.47', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.47', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.47', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.47', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.47', type: 4, id: j++}
        ]},
        {name: '10.161.0.48', hover: false, type: 3, id: j++, children: [
            {name: '17100', parentName: '10.161.0.48', type: 4, id: j++},
            {name: '17101', parentName: '10.161.0.48', type: 4, id: j++},
            {name: '17102', parentName: '10.161.0.48', type: 4, id: j++},
            {name: '17103', parentName: '10.161.0.48', type: 4, id: j++}
        ]}
    ]
};

var tuxedoNodes = {
    name: 'tuxedo环境', type: 1, hover: false, hidden: false, id: i++, children: [
        {name: '一卡充', type: 2,  hover: false, id: i++, children: [
            { name: '134.200.25.41', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp', parentName: '134.200.25.41', type: 4, id: i++}
            ]}
        ]},
        {name: '4G全业务', type: 2,  hover: false, id: i++, children: [
            { name: '130.71.248.50', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp', parentName: '130.71.248.50', type: 4, id: i++}
            ]},
            { name: '134.200.25.40', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp', parentName: '134.200.25.40', type: 4, id: i++}
            ]}
        ]},
        {name: 'BSS前台', type: 2,  hover: false, id: i++, children: [
            { name: '130.71.248.35', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '130.71.248.35', type: 4, id: i++}
            ]},
            { name: '130.71.248.36', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '130.71.248.36', type: 4, id: i++}
            ]},
            { name: '130.71.248.37', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '130.71.248.37', type: 4, id: i++}
            ]},
            { name: '130.71.248.38', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '130.71.248.38', type: 4, id: i++}
            ]}
        ]},
        {name: 'ECS', type: 2,  hover: false, id: i++, children: [
            { name: '134.200.25.37', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '134.200.25.37', type: 4, id: i++}
            ]},
            { name: '134.200.25.38', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '134.200.25.38', type: 4, id: i++}
            ]},
            { name: '134.200.25.42', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '134.200.25.42', type: 4, id: i++}
            ]},
            { name: '134.200.25.43', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '134.200.25.43', type: 4, id: i++}
            ]},
            { name: '134.200.25.44', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '134.200.25.44', type: 4, id: i++}
            ]},
            { name: '130.71.248.39', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '130.71.248.39', type: 4, id: i++}
            ]},
            { name: '130.71.248.40', type: 3, id: i++, children:[
                {name: 'tuxapp', u: 'tuxapp',  parentName: '130.71.248.40', type: 4, id: i++}
            ]}
        ]}
    ]
};

var hosts = require('../../../config_hosts');
var config = {
    tuxedoClusterNtgNodeInfo: {
        title: 'Tuxedo 集群健康鸟瞰图',
        nodesName: 'tuxedoNodes',
        tradeType: [
            {name: '一卡充', key: 'ykc', host: hosts.ykcHost},
            {name: '4G全业务', key: 'qyw', host: hosts.qywHost},
            {name: 'BSS前台', key: 'tuxedo', host: hosts.bssHost},
            {name: 'ECS', key: 'ecs', host: hosts.ecsHost}
        ],
        tradeNorm: [
            ['调用量', 'flow-primary', ''],
            ['异常率', 'flow-warning', ''],
            ['成功率', 'flow-success', '']
        ],
        regionType: [
            {name: '130.71.248.50', key: 'region248_50', region: '130.71.248.50_tuxapp'},
            {name: '134.200.25.40', key: 'region25_40', region: '134.200.25.40_tuxapp'},
            {name: '130.71.248.35', key: 'region248_35', region: '130.71.248.35_tuxapp'},
            {name: '130.71.248.36', key: 'region248_36', region: '130.71.248.36_tuxapp'},
            {name: '130.71.248.37', key: 'region248_37', region: '130.71.248.37_tuxapp'},
            {name: '130.71.248.38', key: 'region248_38', region: '130.71.248.38_tuxapp'}
        ],
        regionNorm: [
            ['调用量', 'flow-primary', ''],
            ['成功率', 'flow-warning', ''],
            ['异常率', 'flow-success', '']
        ],
        lcuTableNames: ['流程名', '调用总数', '平均时间>60s调用数','平均时间>30s调用数', '平均时间>5s调用数','平均时间>2s调用数', '>2s占比',
            '总记录数','最大耗时>60s记录数','最大耗时>30s记录数','最大耗时>5s记录数','最大耗时>2s记录数','>2s占比'],
        lcuQueryUrl: '/historyQueryDetailData?mode=TuxState&type=TimeOutStat&scope=day&subtype=HisRate',
        warnTableNames: ['序号', '异常明细', '异常时间'],
        warnQueryUrl: '/historyQueryDetailData?mode=warn&type=ing&scope=suffix&subtype=Query'
    },
    webLogicClusterNtgNodeInfo: {
        title: 'Weblogic 集群健康鸟瞰图',
        nodesName: 'weblogcNodes'
    },
    tuxedoTradeTypeQueryInfo: {
        queryList: [
            {key: 'call', mode: 'TuxState', type: 'CalledSumBySvrByHost', scope: 'day', schemaName: 'QueryResult'},
            {key: 'fail', mode: 'TuxState', type: 'FailedSumBySvrByHost', scope: 'day', schemaName: 'QueryResult'}
        ]
    },
    tuxedoRegionTypeQueryInfo: {

    }
}

var list = {
      tuxedoClusterNtgList: [{mode:'tuxedo', type:'ClusterNtg', subtype:'NodeInfo'}],
      webLogicClusterNtgList: [{mode:'webLogic', type:'ClusterNtg', subtype:'NodeInfo'}],
      tuxedoTradeTypeList: [{mode:'tuxedo', type:'TradeType', subtype:'QueryInfo'}],
      tuxedoRegionTypeList: [{mode:'tuxedo', type:'RegionType', subtype:'QueryInfo'}]
}

exports.config = config;
exports.list = list;
exports.tuxedoNodes = tuxedoNodes;
exports.weblogcNodes = weblogcNodes;