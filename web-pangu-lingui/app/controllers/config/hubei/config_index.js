exports.config = {
  TuxStateCalledSumBySataAtHours: {
    scopes: ['day'],
    colNames: [
      'DayCalledSum', 'DayFailedSum', 'DaySuccessRate',
      'MonCalledSum', 'MonFailedSum', 'MonSuccessRate'
    ],
    filterColNames: [],
    filter: {
      DayCalledSum: { $exists: true }, DayFailedSum: { $exists: true },
      DaySuccessRate: { $exists: true }, MonCalledSum: { $exists: true },
      MonFailedSum: { $exists: true }, MonSuccessRate: { $exists: true }
    },
    sort: { houtd: -1 }
  }
};

exports.list = [
    { mode: 'TuxState', type: 'CalledSum', subtype: 'BySataAtHours', value: '2014-02-18' }
];
