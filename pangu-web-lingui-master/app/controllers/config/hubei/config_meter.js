var scopeNames = { day: '日', month: '月', year: '年' };
// 首页仪表盘
exports.config = {
  TuxStateCalledSumByTimeByHourAtHours0: {
    name: '工单积压',
    innerName: '工单积压',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['_count'],
    filter: { SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }, hours: 10 },
    max: 220,
    interval: 15,
    endValue1: 100,
    endValue2: 158,
    endValue3: 220,
    sort: { hours: 1 }
  },
  TuxStateCalledSumByTimeByHourAtHours1: {
    name: '服务队列积压',
    innerName: '服务队列积压',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['_count'],
    filter: { SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }, hours: 16 },
    max: 220,
    interval: 15,
    endValue1: 100,
    endValue2: 158,
    endValue3: 220,
    sort: { hours: 1 }
  },
  TuxStateCalledSumByTimeByHourAtHours2: {
    name: '工单失败率',
    innerName: '工单失败率(%)',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['_count'],
    filter: { SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }, hours: 12 },
    max: 100,
    interval: 10,
    endValue1: 30,
    endValue2: 60,
    endValue3: 100,
    sort: { hours: 1 }
  }
};
