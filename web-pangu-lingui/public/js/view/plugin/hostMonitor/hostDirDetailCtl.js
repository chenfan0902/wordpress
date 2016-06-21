$(function() {

  function drawDiskPie(dir, vg) {
    var dirPie = echarts.init(document.getElementById('dirPie'));
    var pieOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}G ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['目录大小', '分区大小']
      },
      series: [
        {
          name: '目录使用情况',
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
              value: dir, name: '目录大小',
              itemStyle: {
                normal: { color: '#f8a20f' }
              }
            },
            {
              value: vg, name: '分区大小',
              itemStyle: {
                normal: { color: '#a9d86e' }
              }
            }
          ]
        }
      ]
    };
    dirPie.setOption(pieOption);
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
    url: '/hostMonitor/getDirDetailData',
    data: {
      date: $('#date').val(),
      chartList: $('#chartList').val(),
      module: $('#module').val(),
      host: $('#host').val(),
      dir: $('#dir').val()
    },
    type: 'get',
    dataType: 'json',
    success: function success(data) {
      var rate = (data.DIR_SIZE / data.VG_SIZE *100).toFixed(2) - 0;
      $('#bar').css('width', rate + '%');
      $('#diskContent').html(rate + '%');
      drawDiskPie(data.DIR_SIZE, data.VG_SIZE);
      drawTopsLine(data.TOPS);
    }
  });

});