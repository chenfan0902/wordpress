var lcuLists = [

];
var ecsHosts = [
    '10.161.2.107_tuxapp1', '10.161.2.107_tuxapp2',
    '10.161.2.108_tuxapp1', '10.161.2.108_tuxapp2',
    '10.161.2.109_tuxapp3', '10.161.2.109_tuxapp4',
    '10.161.2.110_tuxapp3', '10.161.2.110_tuxapp4',
    '10.161.2.231_tuxapp1', '10.161.2.232_tuxapp3'
];
var ecsInterval = [
    5, 10, 20, 30
];

exports.config = {
    ECSLcuCallByTimeAt10Mins : {
        name: 'ECS流程调用量分时段统计',
        mode: 'TuxState',
        type: 'Base',
        subtype: '',
        scopes: ['day'],
        titles: ['时间段','调用量'],
        colNames: ['#', 'count'],
        lcuLists: lcuLists,
        interval: 10,
        //startTime: '2015-05-21 09:30:00.000',
        //endTime: '2015-05-21 12:29:59.999',
        startTime: [
            '2015-05-20 09:30:00.000', '2015-05-21 11:30:00.000', '2015-05-21 13:30:00.000'
        ],
        endTime: [
            '2015-05-20 12:29:59.999', '2015-05-21 14:29:59.999', '2015-05-21 16:29:59.999'
        ]
    }
}

exports.list = {
    ecsLcuCallList: [ {mode:'ECSLcu', type:'CallByTime',subtype:'At10Mins'}]
}

exports.ecsHosts = ecsHosts;
exports.ecsInterval = ecsInterval;