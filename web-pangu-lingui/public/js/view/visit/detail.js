$(function() {

	//===== Datatables =====//

	oTable = $('#visit-data-table').dataTable({
	    "bProcessing": true,
		"bServerSide": true, 
	    "sAjaxSource":$("input[name='visitCntUrl']").val(),
	    "bRetrieve":true,
		"bJQueryUI": false,
		"bAutoWidth": false,
		"bSort": false,
		"bFilter": false,
		"sPaginationType": "full_numbers",
		"oLanguage": {
		    "sSearch": "<span>关键字过滤:</span> _INPUT_",
			"sLengthMenu": "<span>每页显示数:</span> _MENU_",
			"oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" }, 
		    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
		},
		"fnDrawCallback": function () {
        },
        "aoColumns": [
        	
                { "sTitle": "模块名", "sClass": "center" },
                { "sTitle": "模块地址", "sClass": "center" },
                { "sTitle": "访问量", "sClass": "center" },
                {
                    "sTitle": "操作",
                    "sClass": "center",
                    "fnRender": function (obj) {
                        return '<a href=\"'+obj.aData[1]+'\" data-pjax=\"#content\" class=\"pull-center\">进入</a>';
                    }
                }
        ],
  });
  
	//===== Sparklines =====//
});
