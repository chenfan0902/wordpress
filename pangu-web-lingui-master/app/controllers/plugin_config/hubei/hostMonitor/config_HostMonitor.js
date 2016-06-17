
exports.modules = [
  ['vc', 'VC一卡充'],
  ['fourthG', '4G全业务']
  //['ecs', 'ECS'],
  //['weblogic', '前台weblogic']
];

exports.hostList = {
  vc: ['10.20.16.73', '10.20.16.79'],
  fourthG: ['10.20.16.78', '10.20.16.80']
  //ecs: ['10.20.16.80', '10.20.16.81'],
  //weblogic: ['10.20.16.82', '10.20.16.83', '10.20.16.84']
};

exports.config = {

  HostMonitorStatusByOne: {
    name: '主机状态信息',
    scope: ['one']
  },
  HostMonitorCpuByOne: {
    name: 'CPU实时使用情况',
    scope: ['one']
  },
  HostMonitorCpuWeekByOne: {
    name: 'CPU历史使用情况',
    scope: ['one']
  },
  HostMonitorCpuByHours: {
    name: 'CPU历史使用情况',
    scope: ['hours']
  },
  HostMonitorMemByOne: {
    name: '内存实时使用情况',
    scope: ['one']
  },
  HostMonitorMemWeekByOne: {
    name: '内存历史使用情况',
    scope: ['one']
  },
  HostMonitorMemByHours: {
    name: '内存历史使用情况',
    scope: ['hours']
  },
  HostMonitorDiskByOne: {
    name: '磁盘空间使用情况',
    scope: ['one']
  },
  HostMonitorDirByOne: {
    name: '主机目录监控',
    scope: ['one']
  }
};

exports.list = {
  hostMonitorMainList: {
    summaryStatus: {
      mode: 'HostMonitor', type: 'Status', subtype: 'ByOne'
    },
    currCpu: {
      mode: 'HostMonitor', type: 'Cpu', subtype: 'ByOne'
    },
    weeklyCpu: {
      mode: 'HostMonitor', type: 'CpuWeek', subtype: 'ByOne'
    },
    hoursCpu: {
      mode: 'HostMonitor', type: 'Cpu', subtype: 'ByHours'
    },
    currMem: {
      mode: 'HostMonitor', type: 'Mem', subtype: 'ByOne'
    },
    weeklyMem: {
      mode: 'HostMonitor', type: 'MemWeek', subtype: 'ByOne'
    },
    hoursMem: {
      mode: 'HostMonitor', type: 'Mem', subtype: 'ByHours'
    },
    currDisk: {
      mode: 'HostMonitor', type: 'Disk', subtype: 'ByOne'
    },
    currDir: {
      mode: 'HostMonitor', type: 'Dir', subtype: 'ByOne'
    }
  }
};
