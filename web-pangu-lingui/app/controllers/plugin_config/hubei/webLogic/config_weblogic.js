var cHosts = require('../config_hosts')

exports.config = {
    WebLogicBase: {
        name: 'Web Logic',
        tabColNames: ['Server', 'HealthState', 'OpenSocketsCurrentCount', 'State', 'HeapFreeCurrent', 'Time']
    },
    WebLogicNewestDAY: {
        scopes: ['day'],
        sort: {'timestamp': 1}
    },
    hosts: cHosts.webLogicHost
}

exports.list = {
    WebLogicBaseList: [{mode:'Web', type:'Logic', subtype:'Base'}],
    WebLogicGroupList: [{mode:'Web', type:'LogicNewest', subtype:'DAY'}]
}