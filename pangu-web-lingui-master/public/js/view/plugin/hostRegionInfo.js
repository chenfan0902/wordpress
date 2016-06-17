var hostCfg = {
    ykcHost : {
        regionMode: 'byhostName',
        type:'一卡充',
        key: 'ykc',
        host: [//yyzw
            '134.200.25.41_tuxapp'
        ]
    },
    qywHost : {
        regionMode: 'byhostName',
        type:'4G全业务',
        key: 'qyw',
        host: [//全业务
            '130.71.248.50_tuxapp', '134.200.25.40_tuxapp'
        ]
    },
    tuxedoHost : {
        regionMode: 'byhostName',
        type:'BSS前台',
        key: 'tuxedo',
        host: [//接口
            '130.71.248.35_tuxapp', '130.71.248.36_tuxapp', '130.71.248.37_tuxapp', '130.71.248.38_tuxapp'
        ]
    },
    ecsHost : {
        regionMode: 'byhostName',
        type:'ECS',
        key: 'ecs',
        host: [//接口
            '134.200.25.37_tuxapp', '134.200.25.38_tuxapp', '134.200.25.42_tuxapp', '134.200.25.43_tuxapp',
            '134.200.25.44_tuxapp', '130.71.248.39_tuxapp', '130.71.248.40_tuxapp'
        ]
    }
};

var  getHostInfo = function(host,detail){
    var queue = /\((.*)\).*/.exec(detail)[1] || '';
    //服务:qamcbs1l1server(qamcbs1l13)启动通道数:8,目前队列数:12.队列时间:2015-09-21 10:39:15
    var hostInfo = {};

    for(var hostKey in hostCfg){
        if(~hostCfg[hostKey].host.join(',').indexOf(host)){
            switch (hostCfg[hostKey].regionMode) {
                case 'byhostName':
                    //console.log(hostMonitor)
                    //hostInfo.region = hostMonitor.charAt(hostMonitor.length-2);
                    if (/\d+.\d+.(\d+.\d+)_tuxapp/.test(host)) {
                        hostInfo.region = RegExp.$1.replace(/\./g, '_');
                    } else {
                        hostInfo = '';
                    }
                    hostInfo.region = /\d+.\d+.(\d+.\d+)_tuxapp/;
                    hostInfo.name  = hostCfg[hostKey].type+host;
                    hostInfo.key  = hostCfg[hostKey].key;
                    break;
                case 'byQueue':
                    hostInfo.region =  queue.charAt(queue.length-1)+'域';
                    hostInfo.name  = hostCfg[hostKey].type+host;
                    hostInfo.key  = hostCfg[hostKey].key;
                    break;
                default :
                    hostInfo.region = '';
                    hostInfo.name = host;
                    hostInfo.key  = '';
                    break;
            }
            break;
        }
    }
    return hostInfo;
};
window.getHostInfo = getHostInfo;