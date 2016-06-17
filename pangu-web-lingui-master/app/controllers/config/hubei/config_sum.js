var scopeNames = { day: '全省-日', month: '月', year: '年' };

exports.config = {
  TuxStateCalledSumByTimeByHour: {
    name: '流程调用总数',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }, host: { $exists: false }
    },
    filterColNames: [],
    sort: { hours: 1 }
  },

  TuxStateCalledSumByTimeAtDay: {
    name: '调用总数',
    scopes: ['month'],
    scopeNames: scopeNames,
    colNames: ['day', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }
    },
    filterColNames: [],
    sort: { day: 1 }
  },

  TuxStateFailedSumByTimeByHour: {
    name: '流程异常总数',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }, host: { $exists: false }
    },
    filterColNames: [],
    sort: { hours: 1 }
  },

  TuxStateFailedSumByTimeAtDay: {
    name: '流程异常总数',
    scopes: ['month'],
    scopeNames: scopeNames,
    colNames: ['day', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }
    },
    filterColNames: [],
    sort: { day: 1 }
  },

  TuxStateCalledSumByTimeByHour1: {
    name: '服务调用总数',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }
    },
    filterColNames: [],
    sort: { hours: 1 }
  },

  TuxStateCalledSumByTimeAtDay1: {
    name: '服务调用总数',
    scopes: ['month'],
    scopeNames: scopeNames,
    colNames: ['day', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }
    },
    filterColNames: [],
    sort: { day: 1 }
  },

  TuxStateFailedSumByTimeByHour1: {
    name: '服务异常总数',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }
    },
    filterColNames: [],
    sort: { hour: 1 }
  },

  TuxStateFailedSumByTimeAtDay1: {
    name: '服务异常总数',
    scopes: ['month'],
    scopeNames: scopeNames,
    colNames: ['day', '_count'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false }
    },
    filterColNames: [],
    sort: { day: 1 }
  }

};


exports.list = {
  lcuCalledSumChart: [
    { mode: 'TuxState', type: 'CalledSumByTimeByHour', subtype: '' },
    { mode: 'TuxState', type: 'CalledSumByTime', subtype: 'AtDay' },
    { mode: 'TuxState', type: 'FailedSumByTimeByHour', subtype: '' },
    { mode: 'TuxState', type: 'FailedSumByTime', subtype: 'AtDay' }
  ],

  svcCalledSumChart: [
    { mode: 'TuxState', type: 'CalledSumByTimeByHour', subtype: '1' },
    { mode: 'TuxState', type: 'CalledSumByTime', subtype: 'AtDay1' },
    { mode: 'TuxState', type: 'FailedSumByTimeByHour', subtype: '1' },
    { mode: 'TuxState', type: 'FailedSumByTime', subtype: 'AtDay1' }
  ]
};
