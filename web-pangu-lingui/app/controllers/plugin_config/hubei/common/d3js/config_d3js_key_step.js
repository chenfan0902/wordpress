var norm_intf_com = [
    ['调用量', 'flow-primary', 'CALLED'], ['0000', 'flow-success', '0000'],
    ['9999', 'flow-warning', '9999'], ['其它', 'flow-danger', 'other']
],
    norm_intf_iom = [
        ['调用量', 'flow-primary', 'CALLED'], ['成功', 'flow-success', 'SUCCESS'],
        ['失败', 'flow-danger', 'FAILED'], ['未完成', 'flow-info', 'PENDING']
],
    norm_intf_5 = [
        ['调用量', 'flow-primary', 'CALLED'], ['0000', 'flow-success', '0000'],
    ['9999', 'flow-warning', '9999'], ['其它', 'flow-danger', 'other'],
    ['测试', 'flow-info', '9999']
];

var usertrade = [ //isOrder: default false
    {name: '个性化信息查询', webId: 'key1', key: 'qryCommInfo', norm: norm_intf_com},
    //{name: '用户简单查询校验', webId: 'key2', key: 'simpleCheckUserInfo', norm: norm1},
    {name: '选号', webId: 'key3', key: 'chgQryNum', norm: norm_intf_com},
    {name: '获取台帐资料', webId: 'key4', key: 'qryTrade', norm: norm_intf_com},
    {name: '预订单查询', webId: 'key5', key: 'qryPreOrder', norm: norm_intf_com},
    {name: '统一预提交', webId: 'key6', key: 'sUniTrade', norm: norm_intf_com},
    {name: '订单提交', webId: 'key7', key: 'orderSub', norm: norm_intf_com},
    //{name: '查询写卡数据', webId: 'key8', key: 'getCardData', norm: norm1},
    {name: '写卡资料创建', webId: 'key9', key: 'crtRemoteCardInfo', norm: norm_intf_com},
    {name: '发IOM工单', webId: 'order10', key: 'queryUserTradeSendIom', norm: norm_intf_iom, isOrder: true},
    {name: 'IOM完工工单', webId: 'order11', key: 'queryUserTradeIomCplt', norm: norm_intf_iom, isOrder: true},
    {name: 'CRM完工工单', webId: 'order12', key: 'queryUserTradeCrmCplt', norm: norm_intf_iom, isOrder: true},
    {name: 'CB同步', webId: 'order13', key: 'queryUserTradeCbSync', norm: norm_intf_iom, isOrder: true},
];
var feetrade = [
    {name: '个性化信息查询', webId: 'key1', key: 'qryCommInfo', norm: norm_intf_com},
    {name: '客户信息查询/校验', webId: 'key2', key: 'qryCustInfo', norm: norm_intf_com},
    {name: '用户资料查询 ', webId: 'key3', key: 'qrySimpleUserInfo', norm: norm_intf_com},
    {name: '快速缴费', webId: 'key4', key: 'quickRecvFee', norm: norm_intf_com},
    {name: '收据/发票打印', webId: 'key5', key: 'notePrint', norm: norm_intf_com},
    //{name: '信控开机工单', webId: 'key6', key: '---', norm: norm_intf_iom, isOrder: true},
    {name: '发IOM工单', webId: 'order7', key: 'queryFeeTradeSendIom', norm: norm_intf_iom, isOrder: true},
    {name: 'IOM完工工单', webId: 'order8', key: 'queryFeeTradeIomCplt', norm: norm_intf_iom, isOrder: true},
    {name: 'CRM完工工单', webId: 'order9', key: 'queryFeeTradeCrmCplt', norm: norm_intf_iom, isOrder: true},
    {name: 'CB同步', webId: 'order10', key: 'queryFeeTradeCbSync', norm: norm_intf_iom, isOrder: true},
];

var list = {
    flowChartUserTradeList: [{mode:'IntfSoap', type:'MultiStat', subtype:'UserTrade'}],
    flowChartFeeTradeList: [{mode:'IntfSoap', type:'MultiStat', subtype:'FeeTrade'}],
    calledPerMinuteList: [
        {mode: 'IntfSoap', type: 'MultiStat', subtype: 'ProvFiveMinute'},
        {mode: 'IntfOrder', type: 'CalledPerMin', subtype: 'PROV'},
        {mode: 'IntfSoap', type: 'CalledPerMin', subtype: 'PROV'}
    ],
    calledOperateDayList: [
        {mode: 'IntfSoap', type: 'MultiStat', subtype: 'ProvOperName'},
        {mode: 'IntfOrder', type: 'CalledPerMin', subtype: 'PROV'},
        {mode: 'IntfSoap', type: 'CalledOperate', subtype: 'PROV'}
    ]
};

var config = {
    IntfSoapMultiStatUserTrade: {
        title: '开户业务全流程监控',
        scopes: ['day'],
        nodesName: 'usertrade',
        schemaName: 'IntfMultiSchema',
        //maxNormLen: 5,    //所有流程节点的最大指标数, 默认为 4
        //style: 'css/d3js/keystep.css', //默认样式
        queryMethod: 'Table', // query中计算集合名称的方法，Tab or Table, 分别调用 getTabName 和 getTableName; 默认Table,
        field: [
            []
        ],
        hosts: []
    },
    IntfSoapMultiStatFeeTrade: {//缴费
        title: '缴费开机全流程监控',
        scopes: ['day'],
        nodesName: 'feetrade',
        schemaName: 'IntfMultiSchema',
        //maxNormLen: 5,
        queryMethod: 'Table',
        calledPerMinuteList: [{mode: 'IntfSoap', type: 'CalledPerMin', subtype: 'PROV'}],
        calledOperateDayList: [{mode: 'IntfSoap', type: 'CalledOperate', subtype: 'PROV'}],
        field: [
            []
        ],
        hosts: []
    },
    IntfSoapMultiStatProvFiveMinute: {
        scopes: ['day'],
        schemaName: 'IntfMultiSchema',
        queryMethod: 'Table'
    },
    IntfSoapMultiStatProvOperName: {
        scopes: ['day'],
        schemaName: 'IntfMultiSchema',
        queryMethod: 'Table'
    },
    IntfSoapCalledPerMinPROV: {
        scopes: ['day'],
        schemaName: 'IntfMultiSchema'
    },
    IntfOrderCalledPerMinPROV: {
        scopes: ['day'],
        schemaName: 'IntfMultiSchema'
    },
    IntfSoapCalledOperatePROV: {
        scopes: ['day'],
        schemaName: 'IntfMultiSchema'
    }
};

exports.list = list;
exports.config = config;
exports.usertrade = usertrade;
exports.feetrade = feetrade;
