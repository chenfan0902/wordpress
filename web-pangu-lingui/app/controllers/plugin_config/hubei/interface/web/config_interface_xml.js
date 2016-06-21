
var colNames = {
    soapColNames: [
        {name: "TRANS_IDO", width: "20%"},
        {name: "SYS_ID", width: "20%"},
        {name: "SERVICE_NAME", width: "20%"},
        {name: "OPERATE_NAME", width: "20%"},
        {name: "#", width: "20%"}
    ],
    httpColNames: [
        {name: "TransIDO", width: "20%"},
        {name: "SYS_ID", width: "20%"},
        {name: "BIPCode", width: "20%"},
        {name: "ActivityCode", width: "20%"},
        {name: "#", width: "20%"}
    ],
    h2ColNames: [
        {name: "TRADE_ID", width: "20%"},
        {name: "SYS_ID", width: "20%"},
        {name: "号码", width: "20%"},
        {name: "SERVICE_TYPE", width: "20%"},
        {name: "#", width: "20%"}
    ],
    soapColNamesFuzzy: [
        {name: "TRANS_IDO", width: "25%"},
        {name: "TIME", width: "25%"},
        {name: "SERVICE_NAME", width: "12%"},
        {name: "OPERATE_NAME", width: "12%"},
        {name: "RSP_CODE", width: "12%"},
        {name: "#", width: "14%"}
    ],
    httpColNamesFuzzy: [
        {name: "TransIDO", width: "25%"},
        {name: "TIME", width: "25%"},
        {name: "BIPCode", width: "12%"},
        {name: "ActivityCode", width: "12%"},
        {name: "RspCode", width: "12%"},
        {name: "#", width: "14%"}
    ],
    h2ColNamesFuzzy: [
        {name: "TRADE_ID", width: "25%"},
        {name: "TIME", width: "25%"},
        {name: "SERVICE_TYPE", width: "12%"},
        {name: "号码", width: "12%"},
        {name: "RSP_CODE", width: "12%"},
        {name: "#", width: "14%"}
    ]
};
var colNamesKeyWord = {
    soapColNames: [
        {name: "TRANS_IDO", width: "20%"},
        {name: "SYS_ID", width: "20%"},
        {name: "OPERATE_NAME", width: "20%"},
        {name: "#", width: "20%"}
    ],
    httpColNames: [
        {name: "TransIDO", width: "20%"},
        {name: "SYS_ID", width: "20%"},
        {name: "ActivityCode", width: "20%"},
        {name: "#", width: "20%"}
    ],
    h2ColNames: [
        {name: "TRADE_ID", width: "20%"},
        {name: "SYS_ID", width: "20%"},
        {name: "SERVICE_TYPE", width: "20%"},
        {name: "#", width: "20%"}
    ]
};

var config = {
    queryMsgByTransIDOList: {
        title: "Trade 报文明细查询(TRANS_IDO)",
        headList: "interfaceSoapHeadProvList",
        reqMsgList: "interfaceSoapReqMsgProvList",
        rspMsgList: "interfaceSoapRspMsgProvList"
    },
    queryMsgSoapHttpH2List: {
        title: "SOAP/HTTP/H2 报文明细查询",
        headList: "interfaceSoapHeadProvList",
        reqMsgList: "interfaceSoapReqMsgProvList",
        rspMsgList: "interfaceSoapRspMsgProvList",
        queryList: ['IntfSoapHeadAndMsgPROV', 'IntfHttpHeadAndMsgPROV', 'IntfH2HeadAndMsgPROV'],
        colNames: colNames
    },
    soapHttpH2KeyWordList: {
        title: "关键字(PHONE, TRADE_ID)查询",
        headList: "interfaceSoapHeadProvList",
        reqMsgList: "interfaceSoapReqMsgProvList",
        rspMsgList: "interfaceSoapRspMsgProvList",
        queryList: [
            {mode: 'IntfSoap', type: 'KeyWord', scopes: ['hash'], t: 'soap'},
            {mode: 'IntfHttp', type: 'KeyWord', scopes: ['hash'], t: 'http'},
            {mode: 'IntfH2', type: 'KeyWord', scopes: ['hash'], t: 'h2'}
        ],
        colNames: colNamesKeyWord
    },
    queryMsgSoapHttpH2FullyPROV: {
        title: "关键字模糊查询",
        headList: "interfaceSoapHeadProvList",
        reqMsgList: "interfaceSoapReqMsgProvList",
        rspMsgList: "interfaceSoapRspMsgProvList",
        queryList: ['IntfSoapHeadAndMsgPROVFuzzy', 'IntfHttpHeadAndMsgPROVFuzzy', 'IntfH2HeadAndMsgPROVFuzzy'],
        colNames: colNames
    },
    fuzzyQueryByReqRspMsgList: {
        title: "Trade 报文模糊查询",
        collections: [
            "TradeWSCBSSBase"
        ]
    },
    IntfSoapHeadAndMsgPROVFuzzy: {
        type: 'soap',
        key: 'TRANS_IDO',
        list: [
            {mode: 'IntfSoap', type: 'ReqMsg',scopes: ['day'], schemaName: 'InterfaceSoapReqMsg',t:'soap',keyname:'MSG'},
            {mode: 'IntfSoap', type: 'RspMsg',scopes: ['day'], schemaName: 'InterfaceSoapRspMsg',t:'soap',keyname:'MSG'}
        ]
    },
    IntfHttpHeadAndMsgPROVFuzzy: {
        key: 'TransIDO',
        type: 'http',
        list: [
            {mode: 'IntfHttp', type: 'ReqMsg', scopes: ['day'], schemaName: 'InterfaceHttpHeadAndMsg',t: 'http',keyname:'MSG'},
            {mode: 'IntfHttp', type: 'RspMsg', scopes: ['day'], schemaName: 'InterfaceHttpHeadAndMsg',t: 'http',keyname:'MSG'}
        ]
    },
    IntfH2HeadAndMsgPROVFuzzy: {
        key: 'TRADE_ID',
        type: 'h2',
        list: [
            {mode: 'IntfH2', type: 'ReqMsg', scopes: ['day'], schemaName: 'InterfaceH2HeadAndMsg',t: 'h2',keyname:'MSG'},
            {mode: 'IntfH2', type: 'RspMsg', scopes: ['day'], schemaName: 'InterfaceH2HeadAndMsg',t: 'h2',keyname:'MSG'}
        ]
    },
    IntfSoapHeadAndMsgPROV: {
        type: 'soap',
        key: 'TRANS_IDO',
        list: [
            {mode: 'IntfSoap', type: 'Head', scopes: ['day'], schemaName: 'InterfaceSoapHead'},
            {mode: 'IntfSoap', type: 'ReqMsg',scopes: ['day'], schemaName: 'InterfaceSoapReqMsg'},
            {mode: 'IntfSoap', type: 'RspMsg',scopes: ['day'], schemaName: 'InterfaceSoapRspMsg'}
        ]
    },
    IntfHttpHeadAndMsgPROV: {
        key: 'TransIDO',
        type: 'http',
        list: [
            {mode: 'IntfHttp', type: 'Head', scopes: ['day'], schemaName: 'InterfaceHttpHeadAndMsg'},
            {mode: 'IntfHttp', type: 'ReqMsg',scopes: ['day'], schemaName: 'InterfaceHttpHeadAndMsg'},
            {mode: 'IntfHttp', type: 'RspMsg',scopes: ['day'], schemaName: 'InterfaceHttpHeadAndMsg'},
            {mode: 'IntfHttp', type: 'Param',scopes: ['day'], schemaName: 'InterfaceHttpHeadAndMsg'}
        ]
    },
    IntfH2HeadAndMsgPROV: {
        key: 'TRADE_ID',
        type: 'h2',
        list: [
            {mode: 'IntfH2', type: 'Head', scopes: ['day'], schemaName: 'InterfaceH2HeadAndMsg'},
            {mode: 'IntfH2', type: 'ReqMsg',scopes: ['day'], schemaName: 'InterfaceH2HeadAndMsg'},
            {mode: 'IntfH2', type: 'RspMsg',scopes: ['day'], schemaName: 'InterfaceH2HeadAndMsg'}
        ]
    },
    IntfSoapHeadPROV: {
        name: "接口日志报文HEAD字段集合",
        scopes: ['day'],
        schemaName: "InterfaceSoapHead"
    },
    IntfSoapKeyWordHASH: {
        title: "关键字(PHONE, TRADE_ID)查询",
        scopes: ['hash'],
        schemaName: "InterfaceSoapKeyWord",
        colNames: [{name:"TRANS_IDO", width: "25%"},
            {name:"SYS_ID", width: "25%"},
            //{name:"SERVICE_NAME", width: "20%"},
            {name:"操作", width: "25%"},
            {name:"#", width: "25%"}]
    },
    IntfSoapReqMsgPROV: {
        scopes: ['day'],
        schemaName: "InterfaceSoapReqMsg"
    },
    IntfSoapRspMsgPROV: {
        scopes: ['day'],
        schemaName: "InterfaceSoapRspMsg"
    },
    IntfTradeIdDAY: {
        title: "TRADE 查询 TRANS_IDO",
        scopes: ['day'],
        schemaName: "InterfaceSoapSoapKeyWord",
        colNames: [{name:"TRANS_IDO", width: "40%"},
            {name:"操作", width: "60%"}]
    },
    IntfSoapCalledOperIdPROV: {
        scopes: ['day'],
        schemaName: "IntfMultiSchema",
        name:'员工接口调用量排名',
        titles: ['排名','接口', '员工工号', '调用次数'],
        fieldsName: ['#', '`_id.0', '`_id.1', 'CALLED'],
        filter: {
            $and: [
                {
                    _id: {
                        $not: /routeDataUpt|Z00|CREDIT|ITF/
                    }
                }
            ]
        }
    },
    IntfSoapCalledOperatePROV: {
        scopes: ['day'],
        schemaName: "IntfMultiSchema",
        name:'接口操作调用量排名',
        titles: ['排名','接口', '调用次数']
    },
    IntfSoapOperIdPerMinPROV: {
        scopes: ['day'],
        schemaName: "IntfMultiSchema",
        name:'嫌疑机器人工号清单',
        titles: ['排名','接口', '员工工号', '时间', '调用次数'],
        fieldsName: ['#', '`_id.0', '`_id.1', '`_id.2', 'CALLED'],
        filter: {
            $and: [
                {
                    _id: {
                        $not: /routeDataUpt|Z00|CREDIT|ITF/
                    }
                }
            ]
        }
    }
};

var list = {
    queryMsgSoapHttpH2FullyList:[ {mode:'queryMsg', type:'SoapHttpH2Fully',subtype:'PROV'}],//模糊查询
    interfaceSoapHeadProvList:[ {mode:'IntfSoap', type:'Head',subtype:'PROV'}],
    interfaceSoapKeyWordList:[ {mode:'IntfSoap', type:'KeyWord',subtype:'HASH'}],
    interfaceSoapReqMsgProvList:[ {mode:'IntfSoap', type:'ReqMsg',subtype:'PROV'}],
    interfaceSoapRspMsgProvList:[ {mode:'IntfSoap', type:'RspMsg',subtype:'PROV'}],
    queryMsgByTransIDOList:[ {mode:'queryMsg', type:'ByTransIDO',subtype:'List'}],
    queryMsgSoapHttpH2List:[ {mode:'queryMsg', type:'SoapHttpH2',subtype:'List'}],
    soapHttpH2KeyWordList:[ {mode:'soapHttpH2', type:'KeyWord',subtype:'List'}],
    fuzzyQueryByReqRspMsgList:[ {mode:'fuzzyQuery', type:'ByReqRspMsg',subtype:'List'}],
    interfaceSoapOprCalledList:[{mode:'IntfSoap',type:'CalledOperate',subtype:'PROV'}],
    //oprStaff
    oprStaffCalledTopList:[{mode:'IntfSoap',type:'CalledOperId',subtype:'PROV'}],
    oprStaffPerMinTopList: [ {mode:'IntfSoap', type:'OperIdPerMin', subtype:'PROV'} ],
    calledOperateDayTopList:[{mode:'IntfSoap',type:'CalledOperate',subtype:'PROV'}],
    //http
    interfaceHttpHeadMsgProvList: [{mode: 'IntfHttp', type: 'HeadAndMsg', subtype: 'PROV'}],
    interfaceHttpKeyWordList: [{mode: 'IntfHttp', type: 'KeyWord', subtype: 'HASH'}],
    //h2
    interfaceH2HeadMsgProvList: [{mode: 'IntfH2', type: 'HeadAndMsg', subtype: 'PROV'}],
    interfaceH2KeyWordList: [{mode: 'IntfH2', type: 'KeyWord', subtype: 'HASH'}],
    //soap
    interfaceHttpHeadMagProvList: [{mode: 'IntfSoap', type: 'HeadAndMsg', subtype: 'PROV'}]
};

exports.config = config;
exports.list = list;

