var scopeNames = { day: '日', month: '月', year: '年' };

exports.config = {
  TuxStateCalledSumByTimeByHostAt197198: {
    name: '4G全业务流程调用数',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count', 'host'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false },
      host: {
        $in: ['130.71.248.50_tuxapp', '134.200.25.40_tuxapp']
      }
    },
    sort: { hours: 1 }
  },
  TuxStateCalledSumByTimeByHostAt4445: {
    name: 'BSS前台流程调用量',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count', 'host'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false },
      host: {
        $in: [
          '130.71.248.35_tuxapp', '130.71.248.36_tuxapp', '130.71.248.37_tuxapp',
          '130.71.248.38_tuxapp'
        ]
      }
    },
    sort: { hours: 1 }
  },
  TuxStateFailedSumByTimeByHostAt28a: {
    name: '流程异常量',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count', 'host'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false },
      host: {
        $in: ['134.32.28.139', '134.32.28.141']
      }
    },
    sort: { hours: 1 }
  },

  TuxStateCalledSumByTimeByHostAt2324: {
    name: 'ECS主机流程调用量',
    scopes: ['day'],
    scopeNames: scopeNames,
    colNames: ['hours', '_count', 'host'],
    filter: {
      SVRNAME: { $exists: false }, TRANSCODE: { $exists: false },
      host: {
        $in: [
          '134.200.25.37_tuxapp', '134.200.25.38_tuxapp', '134.200.25.42_tuxapp',
          '134.200.25.43_tuxapp', '134.200.25.44_tuxapp', '130.71.248.39_tuxapp',
          '130.71.248.40_tuxapp'
        ]
      }
    },
    sort: { hours: 1 }
  }
};
