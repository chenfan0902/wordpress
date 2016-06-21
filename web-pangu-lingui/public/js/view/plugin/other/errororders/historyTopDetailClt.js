$(function() {

	//===== Datatables =====//

	oTable = $('#data-table').dataTable({
        "bProcessing": true,
		"bServerSide": true, 
	    "sAjaxSource":$("input[name='queryUrl']").val(),
	    "bRetrieve":true,
		"bJQueryUI": false,
		"bAutoWidth": false,
		"bSort": false,
		"sPaginationType": "full_numbers",
		"oLanguage": {
			"sSearch": "<span>关键字过滤:</span> _INPUT_",
			"sLengthMenu": "<span>每页显示数:</span> _MENU_",
			"oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" }, 
		    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
		},
		"fnDrawCallback": function () {
           
        }
  });

	//===== Sparklines =====//
	
	$('#total-visits').sparkline(
		'html', {type: 'bar', barColor: '#ef705b', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
	);
	$('#balance').sparkline(
		'html', {type: 'bar', barColor: '#91c950', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
	);

	$(window).resize(function () {
		$.sparkline_display_visible();
	}).resize();

});
