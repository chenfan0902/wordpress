$(function() {

  function initClass(data, type) {
    var chosen;
    if (type === 'modules') {
      chosen = $('#module').val();
      $('#' + chosen).addClass('chosen');
      data.forEach(function each(item) {
        var id = item[0];
        var status = item[1];
        if (status !== 0) {
          $('#' + id).children('div').attr('class', 'dot-warn');
        } else {
          $('#' + id).children('div').attr('class', 'dot-normal');
        }
      });
      $('#hostBtns').html('');
    }

    if (type === 'hosts') {
      chosen = $('#host').val();
      chosen = chosen.replace(/\./g, '_');
      $('#' + chosen).addClass('chosen');
      data.forEach(function each(item) {
        var id = item[0].replace(/\./g, '_');
        var status = item[1];
        if (status !== 0) {
          $('#' + id).children('div').attr('class', 'dot-warn');
        } else {
          $('#' + id).children('div').attr('class', 'dot-normal');
        }
      });
    }
  }

  function clickFunc(event) {
    var id;
    if (event.data === 'module') {
      id = $('#module').val();
      $('#' + id).removeClass('chosen');
      id = $(this).attr('id');
      $('#module').val(id);
      loadModules();
    }
    if (event.data === 'host') {
      id = $('#host').val().replace(/\./g, '_');
      $('#' + id).removeClass('chosen');
      id = $(this).attr('id').replace(/_/g, '.');
      $('#host').val(id);
      loadHosts();
    }
  }

  function initClick(type) {
    var btns = $('button[name=' + type + ']');
    var i;
    var len;
    for (i = 0, len = btns.length; i < len; i++) {
      $(btns[i]).off('click');
      if ($(btns[i]).attr('class').indexOf('chosen') === -1) {
        $(btns[i]).on('click', '', type, clickFunc);
      }
    }
  }

  function drawHostBtns(data) {
    data.forEach(function each(item) {
      var id = item.replace(/\./g, '_');
      $('#hostBtns').append(
          '<button id="' + id + '" class="btn-host" name="host"><div></div>' + item + '</button>');
    });
  }

  function drawModules(data) {
    var name = $('#' + data[0]).text();
    var total = data[1];
    var warnVal = data[2];
    var rate = (warnVal / total).toFixed(4) - 0;
    var myChart = echarts.init(document.getElementById('gauge'));
    var titleColor = '#7ad239';
    var option;
    name = name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/ig, '');
    if (rate > 0.4) {
      titleColor = '#fa9f03';
    }
    if (rate > 0.7) {
      titleColor = '#ed5b5f';
    }
    if (total === 0) {
      name = name + '(此模块未配置主机)';
      titleColor = '#ed5b5f';
    }
    option = {
      baseOption: {
        title: {
          show: true,
          text: name,
          left: 'center',
          top: '350',
          textStyle: {
            color: titleColor,
            fontSize: 24
          },
          subtext: '模块主机告警率',
          subtextStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          show: false
        },
        series: [
          {
            name: '主机信息',
            type: 'gauge',
            z: 2,
            startAngle: 180,
            endAngle: 0,
            radius: '100%',
            pointer: {
              width: 5,
              length: '90%'
            },
            itemStyle: {
              normal: {
                color: 'black',
                opacity: 1
              }
            },
            axisLine: {
              lineStyle: {
                color: [[0.4, '#7ad239'], [0.7, '#fa9f03'], [1, '#ed5b5f']],
                width: 60
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: { show: false },
            axisTick: { show: false },
            title: { show: false },
            detail: {
              show: true,
              formatter: '{value}%',
              offsetCenter: [0, '-30%'],
              textStyle: {
                color: titleColor
              }
            },
            data: [{ value: rate * 100, name: '告警率' }]
          },
          {
            type: 'gauge',
            z: 2,
            startAngle: 180,
            endAngle: 0,
            radius: '90%',
            pointer: {
              width: 0
            },
            axisLine: {
              lineStyle: {
                color: [[0, 'black'], [1, 'black']],
                width: 30,
                opacity: 0.2
              }
            },
            splitLine: {
              show: false
            },
            axisTick: { show: false },
            axisLabel: { show: false },
            itemStyle: {
              normal: {
                opacity: 0
              }
            },
            detail: { show: false }
          },
          {
            type: 'gauge',
            z: 1,
            startAngle: 180,
            endAngle: 0,
            radius: '80%',
            pointer: {
              width: 0
            },
            axisLine: {
              lineStyle: {
                color: [[1, 'lightgrey']],
                width: 20
              }
            },
            splitLine: {
              show: false
            },
            axisTick: { show: false },
            axisLabel: { show: false },
            itemStyle: {
              normal: {
                opacity: 0
              }
            },
            detail: { show: false }
          }
        ]
      }
    };

    myChart.setOption(option, true);
    window.onresize = myChart.resize;
    $('#gauge').find('canvas').css({ top: '100px' });
  }

  function drawHostCard(data) {
    var total;
    var adverse;
    var free;
    var rate;
    var status;

    Object.keys(data).forEach(function each(key) {
      var action;
      if (key !== 'host') {
        total = data[key].total;
        adverse = data[key].adverse;
        free = (total - adverse).toFixed(2) - 0;
        rate = (adverse / total * 100).toFixed(2) - 0;
        status = data[key].status;
        action = key;
        if (action === 'rsz' || action === 'swap') {
          action = 'mem';
        }

        if ($('#' + key).find('table tr').length !== 1) {
          $('#' + key).find('table tr:last').remove();
        }

        $('#' + key).find('table').append(
            '<tr><td>' + adverse +'</td><td>' + free + '</td><td>' + total + '</td></tr>'
        );

        $('#' + key).find('.bar').css('width', rate + '%');
        $('#' + key).find('span').find('span').html(rate + '%');

        $('#' + key).find('.bar').parent().removeClass('progress-danger');
        if (status !== 0) {
          $('#' + key).find('.bar').parent().addClass('progress-danger');
        }

        $('#' + key).find('div.itembar').on('click', function cardClick() {
          location.href = '/hostMonitor/hostTab.html?date=' + $('#date').val() +
              '&chartList=' + $('#chartList').val() + '&module=' + $('#module').val() +
              '&host=' + $('#host').val() + '&action=' + action;
        });
      }

    });
  }

  function loadHosts() {
    $.ajax({
      url: '/hostMonitor/loadHosts',
      data: {
        date: $('#date').val(),
        chartList: $('#chartList').val(),
        module: $('#module').val(),
        host: $('#host').val()
      },
      type: 'get',
      dataType: 'json',
      success: function success(data) {
        $('#host').val(data.hostData.host);
        initClass(data.hostsData, 'hosts');
        initClick('host');
        drawHostCard(data.hostData);
      }
    });
  }

  function loadModules() {
    $.ajax({
      url: '/hostMonitor/loadModules',
      data: {
        date: $('#date').val(),
        chartList: $('#chartList').val(),
        module: $('#module').val()
      },
      type: 'get',
      dataType: 'json',
      success: function success(data) {
        $('#module').val(data.moduleData[0]);
        $('#host').val(data.hosts[0]);
        initClass(data.modulesData, 'modules');
        initClick('module');
        drawHostBtns(data.hosts);
        drawModules(data.moduleData);
        loadHosts();
      }
    });
  }

  loadModules();

});
