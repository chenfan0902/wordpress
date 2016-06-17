exports.detailConfig = {

    RedisStateByTime: {
        name: 'redis服务状态监控',
        scopes: ['one'],
        delayTime:600000,
        displayLength:100,
        titles: ['序号', '主机ip','主机信息','redis版本','使用内存','db0','查询命中次数','状态','操作','命中总数','QPS','客户端连接数','时间'],
        colNames: ['#', 'host','host_name','redis_version','used_memory','db0','keyspace_hits','state','start_cmd','allHits','instantaneous_ops_per_sec','connected_clients','time'],
        sortCol: {
            '1':'host',
            '2':'host_name',
            '3':'redis_version',
            '4':'used_memory',
            '5':'db0',
            '6':'keyspace_hits',
            '7':'state',
            '10':'instantaneous_ops_per_sec',
            '11':'connected_clients',
            '12':'time'
        },
        filter:{},
        filterColNames: ['host','used_memory','state','host_name'],
        sort: {'host_name':1}
	}
}

exports.detailList = {
	redisStateMonitorList:[ {mode:'Redis', type:'State',subtype:'ByTime'}]
}
