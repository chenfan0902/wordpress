$(function() {

  function drawDiskPie(free, used) {
    var diskPie = echarts.init(document.getElementById('diskPie'));
    var pieOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}G ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['已使用', '空闲']
      },
      series: [
        {
          name: '磁盘使用情况',
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
    diskPie.setOption(pieOption);
  }

  function drawTopsLine(tops) {
    var oTable;
    var data = [];
    var obj;
    var cnt = 1;
    tops.forEach(function each(item) {
      obj = {
        id: cnt,
        name: item[0],
        size: item[1]
        
      }
      cnt++;
      data.push(obj);
    });
    oTable = $('#topsTbl').dataTable({
      aaData: data,
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
        { mDataProp: 'name', sTitle: '文件名' },
        { mDataProp: 'size', sTitle: '文件大小(M)' }
      ]
    });
  }

  $.ajax({
    url: '/hostMonitor/getDiskDetailData',
    data: {
      date: $('#date').val(),
      chartList: $('#chartList').val(),
      module: $('#module').val(),
      host: $('#host').val(),
      mount: $('#mount').val()
    },
    type: 'get',
    dataType: 'json',
    success: function success(data) {
      $('#bar').css('width', data.RATE + '%');
      $('#diskContent').html(data.RATE + '%');
      drawDiskPie(data.FREE, data.USED);
      drawTopsLine(data.TOPS);
    }
  });

});