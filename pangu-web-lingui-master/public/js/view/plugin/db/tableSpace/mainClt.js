$(function() {
	var table = null,
		oTable = null;
    oTable = $('#data-table').dataTable({
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource":$("input[name='queryUrl']").val(),
        "bRetrieve":true,
        "bJQueryUI": false,
        "bAutoWidth": false,
        "bSort": true,
        "bPaginite":true,
        "sPaginationType": "full_numbers",
        "aoColumnDefs": [
        {
            "aTargets": [parseInt($("input[name='bVisibleFlag']").val())],
            "bVisible": true,
        }
        ],
        "oLanguage": {
            "sSearch": "<span>关键字过滤:</span> _INPUT_",
            "sLengthMenu": "<span>每页显示数据库数:</span> _MENU_",
            "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
        },
        "fnDrawCallback": function () {
        }

    });





});
