$(function () {
  function showClerkOverAvgTable(data) {
    $('#hallOverAvgList').dataTable({
      aaData: data,
      bRetrieve: true,
      bJQueryUI: false,
      bAutoWidth: false,
      bSort: false,
      bFilter: true,
      bLengthChange: true,
      bInfo: true,
      bPaginate: true,
      sPaginationType: 'full_numbers',
      oLanguage: {
        sSearch: '<span>搜索:</span> _INPUT_',
        sLengthMenu: '<span>每页显示数:</span> _MENU_',
        oPaginate: { sFirst: '首页', sLast: '末页', sNext: '>', sPrevious: '<' },
        sInfo: '当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录'
      },
      aoColumns: [
        { mDataProp: 'sorts', sTitle: '排名' },
        { mDataProp: 'businessHall', sTitle: '营业厅' },
        { mDataProp: 'avgHall', sTitle: '平均临柜时间（分钟）' },
        { mDataProp: 'sTime', sTitle: '统计时间（分钟）' }
        //  { mDataProp: 'STIME', sTitle: '统计时间'}
      ]
    });
  }
  $.ajax({
    url: '/PracticalMonitor/getHallOverAvgListData',
    data: {
      date: $('#date').val(),
      chartList: $('#chartList').val(),
      business: $('#business').val()
    },
    type: 'get',
    dataType: 'json',
    success: function success(data) {
      showClerkOverAvgTable(data);
      //  console.log(data);
    }
  });
});
