var cHosts = require('../../../config_hosts');

exports.config = {
    TuxStateBase: {
        headTitle: '主机平均耗时排名',
        scopes: ['yyyyMMdd'],
        sort: {AVERAGE: -1},
        hosts: [].concat(cHosts.testHost).concat(cHosts.ykcHost).concat(cHosts.qywHost).concat(cHosts.bssHost).concat(cHosts.ecsHost)
    },
    TuxStateBaseDetail: {
        headTitle: '主机平均耗时排名',
        scopes: ['yyyyMMdd'],
        sort: {AVERAGE: -1}
    },
    TuxStateBaseGraph: {
        headTitle: '平均耗时曲线图',
        scopes: ['yyyyMMdd'],
        sort: {AVERAGE: -1}
    }
};

exports.list = {
    averageTimeTopList: [ {mode:'TuxState', type:'Base',subtype:''}],
    averageTimeTopGraphList: [ {mode:'TuxState', type:'Base',subtype:'Graph'}],
    averageTimeTopDetailList: [ {mode:'TuxState', type:'Base',subtype:'Detail'}]
};