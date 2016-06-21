module.exports = [
  // menu
  {
    title: '主机性能监控', menuId: 'hostMonitor', class: 'icon-signal', list: [
      {
        title: '主机信息', menuId: 'host.monitor.main',
        url: '/hostMonitor/hostMain.html?chartList=hostMonitorMainList'
      }
    ] },
  {
    title: '临柜时长监控', menuId: 'practicalMonitor', class: 'icon-signal', list: [
      // {
      //   title: '营业员临柜时长排名', menuId: 'practical.monitor.main',
      //   url: '/practicalMonitor/clerkSort.html?chartList=clerkSort'
      // },
      // {
      //   title: '超出平均耗时员工清单', menuId: 'practical.monitor.main',
      //   url: '/practicalMonitor/clerkOverAvgList.html?chartList=clerkOverAvgList'
      // },
      // {
      //   title: '超出平均耗时营业厅清单', menuId: 'practical.monitor.main',
      //   url: '/practicalMonitor/hallOverAvgList.html?chartList=hallOverAvgList'
      // },
      {
        title: '临柜时长排名', menuId: 'practical.monitor.main',
        url: '/practicalMonitor/practicalSorts.html?chartList=practicalSorts'
      }
    ]
  }
];
