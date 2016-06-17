$(function() {

  var action = $('#action').val();
  var links = $('[data-toggle = tab]').parent();

  var i;
  var len;

  var weekOption;
  var drawPane;

  var cpuPie;
  var memPie;
  var cpuLine;
  var memLine;
  var cpuCon;
  var memCon;

  function drawWeeklyCpu(week) {
    cpuLine = echarts.init(document.getElementById('cpuLine'));
    var xAxis;
    var avg;
    var max;
    var min;
    var option;
    Object.keys(week).forEach(function each(key) {
      if (key === $('#host').val()) {
        xAxis = week[key].xAxis;
        avg = week[key].avg;
        max = week[key].max;
        min = week[key].min;
      }
    });
    option = {
      title: {
        show: false
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: ['平均值', '最小值', '最大值'],
        x: 'left'
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70
        }
      ],

      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          data: xAxis
        }
      ],
      yAxis: [
        {
          name: '使用率',
          type: 'value',
          max: 100
        }
      ],
      series: [
        {
          name: '平均值',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: avg
        },
        {
          name: '最小值',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: min
        },
        {
          name: '最大值',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: max
        }
      ]
    };
    weekOption = option;
    cpuLine.setOption(option);
    cpuLine.on('click', function lineClick(params) {
      $.ajax({
        url: '/hostMonitor/getCpuHoursData',
        data: {
          date: $('#date').val(),
          chartList: $('#chartList').val(),
          module: $('#module').val(),
          host: $('#host').val(),
          hour: params.name
        },
        type: 'get',
        dataType: 'json',
        success: function success(data) {
          cpuLine.dispose();
          cpuLine = echarts.init(document.getElementById('cpuLine'));
          option = {
            title: {
              text: 'CPU使用率走势图(分钟)',
              subtext: data.time,
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false
              }
            },
            legend: {
              data: ['使用率'],
              x: 'left'
            },
            dataZoom: [
              {
                show: true,
                realtime: true,
                start: 30,
                end: 70
              },
              {
                type: 'inside',
                realtime: true,
                start: 30,
                end: 70
              }
            ],
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                axisLine: { onZero: true },
                data: data.xAxis
              }
            ],
            yAxis: [
              {
                name: '使用率',
                type: 'value',
                max: 100
              }
            ],
            series: [{
              name: '使用率',
              type: 'line',
              symbolSize: 8,
              hoverAnimation: false,
              data: data.data
            }]
          };
          cpuLine.setOption(option);
          cpuLine.on('click', function goBack(params) {
            cpuLine.dispose();
            cpuLine = echarts.init(document.getElementById('cpuLine'));
            cpuLine.setOption(weekOption);
            cpuLine.on('click', lineClick);
          });
        }
      });
    });
  }

  function drawCpuContrast(week) {
    cpuCon = echarts.init(document.getElementById('cpuCon'));
    var xAxis = [];
    var series = [];
    var legends = []
    var sery
    var option;
    Object.keys(week).forEach(function each(key) {
      if (xAxis.length < week[key].xAxis.length) {
        xAxis = week[key].xAxis;
      }
      legends.push(key);
      sery = {
        name: key,
        type: 'line',
        symbolSize: 8,
        hoverAnimation: false,
        data: week[key].avg
      };
      series.push(sery);
    });
    option = {
      title: {
        show: false
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: legends,
        x: 'left'
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70
        }
      ],

      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          data: xAxis
        }
      ],
      yAxis: [
        {
          name: '使用率',
          type: 'value',
          max: 100
        }
      ],
      series: series
    };
    cpuCon.setOption(option);
  }

  function drawWeeklyMem(week) {
    memLine = echarts.init(document.getElementById('memLine'));
    var xAxis;
    var legends = [];
    var series = [];
    var option;

    Object.keys(week).forEach(function each(key) {
      if (key === $('#host').val()) {
        xAxis = week[key].xAxis;
        legends = ['SWAP(AVG)', 'SWAP(MAX)', 'SWAP(MIN)',
          '物理内存(AVG)', '物理内存(MAX)', '物理内存(MIN)'];
        series = [{
          name: 'SWAP(AVG)',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: week[key].swapAvg
        }, {
          name: 'SWAP(MAX)',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: week[key].swapMax
        }, {
          name: 'SWAP(MIN)',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: week[key].swapMin
        }, {
          name: '物理内存(AVG)',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: week[key].rszAvg
        }, {
          name: '物理内存(MAX)',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: week[key].rszMax
        }, {
          name: '物理内存(MIN)',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: week[key].rszMin
        }];
      }
    });

    option = {
      title: {
        show: false
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: legends,
        x: 'center'
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70
        }
      ],

      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          data: xAxis
        }
      ],
      yAxis: [
        {
          name: '使用量',
          type: 'value'
        }
      ],
      series: series
    };
    weekOption = option;
    memLine.setOption(option);
    memLine.on('click', function lineClick(params) {
      $.ajax({
        url: '/hostMonitor/getMemHoursData',
        data: {
          date: $('#date').val(),
          chartList: $('#chartList').val(),
          module: $('#module').val(),
          host: $('#host').val(),
          hour: params.name
        },
        type: 'get',
        dataType: 'json',
        success: function success(data) {
          memLine.dispose();
          memLine = echarts.init(document.getElementById('memLine'));
          option = {
            title: {
              text: '内存使用走势图(分钟)',
              subtext: data.time,
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false
              }
            },
            legend: {
              data: ['交换分区', '物理内存'],
              x: 'left'
            },
            dataZoom: [
              {
                show: true,
                realtime: true,
                start: 30,
                end: 70
              },
              {
                type: 'inside',
                realtime: true,
                start: 30,
                end: 70
              }
            ],
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                axisLine: { onZero: true },
                data: data.xAxis
              }
            ],
            yAxis: [
              {
                name: '使用率',
                type: 'value'
              }
            ],
            series: [
              {
                name: '交换分区',
                type: 'line',
                symbolSize: 8,
                hoverAnimation: false,
                data: data.swap
              },{
                name: '物理内存',
                type: 'line',
                symbolSize: 8,
                hoverAnimation: false,
                data: data.rsz
              }
            ]
          };
          memLine.setOption(option);
          memLine.on('click', function goBack(params) {
            memLine.dispose();
            memLine = echarts.init(document.getElementById('memLine'));
            memLine.setOption(weekOption);
            memLine.on('click', lineClick);
          });
        }
      });
    });
  }

  function drawMemContrast(week) {
    memCon = echarts.init(document.getElementById('memCon'));
    var xAxis = [];
    var series = [];
    var legends = []
    var sery
    var option;
    Object.keys(week).forEach(function each(key) {
      if (xAxis.length < week[key].xAxis.length) {
        xAxis = week[key].xAxis;
      }
      legends.push(key + '(交换区)');
      legends.push(key + '(物理内存)');
      sery = {
        name: key + '(交换区)',
        type: 'line',
        symbolSize: 8,
        hoverAnimation: false,
        data: week[key].swapAvg
      };
      series.push(sery);
      sery = {
        name: key + '(物理内存)',
        type: 'line',
        symbolSize: 8,
        hoverAnimation: false,
        data: week[key].rszAvg
      };
      series.push(sery);
    });
    option = {
      title: {
        show: false
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: legends
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70
        }
      ],

      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          data: xAxis
        }
      ],
      yAxis: [
        {
          name: '使用量',
          type: 'value'
        }
      ],
      series: series
    };
    memCon.setOption(option);
  }

  drawPane = {
    cpu: function drawCpuPane(data) {
      var used = data.curr.RATE;
      var free = 100 - used;

      cpuPie = echarts.init(document.getElementById('cpuPie'));
      var pieOption;

      $('#cpuPane').find('.bar').css('width', used + '%');
      $('#cpuContent').html(used + '%');

      pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['已使用', '空闲']
        },
        series: [
          {
            name: 'CPU使用率',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: used, name: '已使用',
                itemStyle: {
                  normal: { color: '#f8a20f' }
                }
              },
              {
                value: free, name: '空闲',
                itemStyle: {
                  normal: { color: '#a9d86e' }
                }
              }
            ]
          }
        ]
      };
      cpuPie.setOption(pieOption);

      drawWeeklyCpu(data.week);
      drawCpuContrast(data.week);
      window.onresize = function () {
        cpuPie.resize();
        cpuLine.resize();
        cpuCon.resize();
      };
    },

    mem: function drawMemPane(data) {
      var oTable;
      var cnt = 1;
      var tops = [];
      var swapSize = data.curr.SWAP_SIZE;
      var swapUsed = data.curr.SWAP_USED;
      var swapRate = (swapUsed / swapSize * 100).toFixed(2) - 0;

      var rszSize = data.curr.RSZ_SIZE;
      var rszUsed = data.curr.RSZ_USED;
      var rszRate = (rszUsed / rszSize * 100).toFixed(2) - 0;

      var pieOption;
      memPie = echarts.init(document.getElementById('memPie'));


      $('#memPane').find('.bar').first().css('width', swapRate + '%');
      $('#swapContent').html(swapRate + '%');
      $('#memPane').find('.bar').last().css('width', rszRate + '%');
      $('#rszContent').html(rszRate + '%');

      pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: ['交换分区(已用)', '交换分区(空闲)', '物理内存(已用)', '物理内存(空闲)'],
          textStyle: {
            fontSize: 10
          }
        },
        series: [
          {
            name: '主机内存使用率',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: swapUsed, name: '交换分区(已用)',
                itemStyle: {
                  normal: { color: '#ed5b5f' }
                }
              },
              {
                value: swapSize - swapUsed,
                name: '交换分区(空闲)',
                itemStyle: {
                  normal: { color: '#5faee3' }
                }
              },
              {
                value: rszUsed,
                name: '物理内存(已用)',
                itemStyle: {
                  normal: { color: '#f8a20f' }
                }
              },
              {
                value: rszSize - rszUsed,
                name: '物理内存(空闲)',
                itemStyle: {
                  normal: { color: '#a9d86e' }
                }
              }
            ]
          }
        ]
      };
      memPie.setOption(pieOption);

      data.curr.TOPS.forEach(function each(item) {
        tops.push({
          id: cnt,
          pId: item[0],
          name: item[1],
          size: item[2]
        });
        cnt++;
      });

      oTable = $('#memTbl').dataTable({
        aaData: tops,
        bRetrieve: true,
        bJQueryUI: false,
        bAutoWidth: false,
        bSort: false,
        bFilter: false,
        bLengthChange: false,
        bInfo: false,
        bPaginate: false,
        aoColumns: [
          { mDataProp: 'id', sTitle: '序号' },
          { mDataProp: 'pId', sTitle: '进程ID' },
          { mDataProp: 'name', sTitle: '进程名' },
          { mDataProp: 'size', sTitle: '占用内存(M)' }
        ]
      });

      drawWeeklyMem(data.week);
      drawMemContrast(data.week);



      window.onresize = function () {
        memPie.resize();
        memLine.resize();
        memCon.resize();
      };
    },

    disk: function drawDiskPane(data) {
      var rows;
      var row;
      var cell;
      var cellVal;

      var oTable = $('#diskTbl').dataTable({
        aaData: data.aaData,
        bRetrieve: true,
        bJQueryUI: false,
        bAutoWidth: false,
        bSort: true,
        bFilter: false,
        bLengthChange: false,
        bInfo: true,
        bPaginate: false,
        bScrollCollapse: true,
        sScrollY: '700px',
        aaSorting: [[4, 'desc']],
        aoColumns: [
          { mDataProp: 'mount', sTitle: '磁盘' },
          { mDataProp: 'block', sTitle: '总量(G)' },
          { mDataProp: 'used', sTitle: '已使用(G)' },
          { mDataProp: 'free', sTitle: '空闲(G)' },
          { mDataProp: 'rate', sTitle: '使用率(%)' },
          { mDataProp: 'status', sTitle: '状态' },
          { mDataProp: 'time', sTitle: '时间' },
          { mDataProp: 'details', sTitle: '详情', sDefaultContent: '<a style="cursor: pointer;">查看</a>' }
        ],
        oLanguage: {
          sInfo: '共监控 _TOTAL_ 个磁盘'
        }
      });

      $('#diskTbl > tbody ').find('a').on('click', function diskClick() {
        var mount = $(this).parent().siblings().first().html();
        var host = $('#host').val();
        location.href = '/hostMonitor/hostDiskDetail.html?date=' + $('#date').val() +
            '&chartList=' + $('#chartList').val() + '&module=' + $('#module').val() +
            '&host=' + host + '&mount=' + mount;
      });

      rows = $('#diskTbl > tbody').children('tr');
      for (i = 0, len = rows.length; i < len; i++) {
        row = rows[i];
        cell = $(row).children('td').eq(5);
        cellVal = $(cell).html();
        if (cellVal === '0') {
          $(cell).html('正常');
        }
        if (cellVal === '1') {
          $(cell).html('告警');
          $(row).css('color', '#ed5b5f');
        }
      }
    },

    dir: function drawDirPane(data) {
      var rows;
      var row;
      var cell;
      var cellVal;

      var oTable = $('#dirTbl').dataTable({
        aaData: data,
        bRetrieve: true,
        bJQueryUI: false,
        bAutoWidth: false,
        bSort: true,
        bFilter: false,
        bLengthChange: false,
        bInfo: true,
        bPaginate: false,
        bScrollCollapse: true,
        sScrollY: '700px',
        aaSorting: [[4, 'desc']],
        aoColumns: [
          { mDataProp: 'dir', sTitle: '目录' },
          { mDataProp: 'dirSize', sTitle: '目录大小(G)' },
          { mDataProp: 'vg', sTitle: '分区(G)' },
          { mDataProp: 'vgSize', sTitle: '分区大小(G)' },
          { mDataProp: 'rate', sTitle: '使用率(%)' },
          { mDataProp: 'status', sTitle: '状态' },
          { mDataProp: 'time', sTitle: '时间' },
          { mDataProp: 'details', sTitle: '详情', sDefaultContent: '<a style="cursor: pointer;">查看</a>' }
        ],
        oLanguage: {
          sInfo: '共监控 _TOTAL_ 个目录'
        }
      });

      $('#dirTbl > tbody').find('a').on('click', function dirClick() {
        var dir = $(this).parent().siblings().first().html();
        var host = $('#host').val();
        location.href = '/hostMonitor/hostDirDetail.html?date=' + $('#date').val() +
            '&chartList=' + $('#chartList').val() + '&module=' + $('#module').val() +
            '&host=' + host + '&dir=' + dir;
      });

      rows = $('#dirTbl > tbody').children('tr');
      for (i = 0, len = rows.length; i < len; i++) {
        row = rows[i];
        cell = $(row).children('td').eq(5);
        cellVal = $(cell).html();
        if (cellVal === '0') {
          $(cell).html('正常');
        }
        if (cellVal === '1') {
          $(cell).html('告警');
          $(row).css('color', '#ed5b5f');
        }
      }
    }
  };

  function clickFunc(event) {
    var id = event.data;
    $('#action').val(id);
    $('#' + id).tab('show');
    initClick();
    getData();
  }

  function initClick() {
    for (i = 0, len = links.length; i < len; i++) {
      $(links[i]).off('click');
      if ($(links[i]).attr('class').indexOf('active') === -1) {
        $(links[i]).on('click', '', $(links[i]).children('a').attr('id'), clickFunc);
      }
    }
  }

  function getData() {
    var id = $('#action').val();
    var url = '/hostMonitor/getTabDataOf';
    $.ajax({
      url: url + (id.replace(/(\w)/, function upper(v) {
        return v.toUpperCase();
      })),
      data: {
        date: $('#date').val(),
        chartList: $('#chartList').val(),
        module: $('#module').val(),
        host: $('#host').val()
      },
      type: 'get',
      dataType: 'json',
      success: function success(data) {
        drawPane[id](data);
        initClick();
      }
    });
  }

  $('#' + action).tab('show');
  getData();
});
