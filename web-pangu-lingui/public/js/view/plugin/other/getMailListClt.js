$(function() {

	//===== Datatables =====//

	oTable = $('#data-table-mail').dataTable({
	    "bProcessing": true,
		"bServerSide": true, 
	    "sAjaxSource":$("input[name='queryUrl']").val(),
	    "bRetrieve":true,
		"bJQueryUI": false,
		"bAutoWidth": false,
		"bSort": false,
		"sPaginationType": "full_numbers",
		"fnServerData": function ( sSource, aoData, fnCallback ) {
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "url": sSource,
            "data": aoData,
            "success": fnCallback,
            "error": function (XMLHttpRequest, textStatus, errorThrown) {
              alert(XMLHttpRequest.responseText);
              window.location ='/logout';
            } 
        });
    },
    
		"oLanguage": {
			"sSearch": "<span>关键字过滤:</span> _INPUT_",
			"sLengthMenu": "<span>每页显示数:</span> _MENU_",
			"oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" }, 
		    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
		},		
		"aoColumnDefs": [ 
						{ "bSearchable": false, "bVisible": false, "aTargets": [ 5 ] }
		],
		"fnDrawCallback": function () {
           
     }
  });
  
  
  
  $("#data-table-mail tbody").click(function(event) { 
    
      //$(oTable.fnSettings().aoData).each(function() {  
         //$(this.nTr).removeClass('row_selected');  
      //});  
      //$(event.target.parentNode).addClass('row_selected');  
      var aData = oTable.fnGetData(event.target.parentNode);  
		  var sDate = aData[4];	  
		  var nTds = $('td', this);
		  
		  var dateCa = new Date(sDate);                    
      var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
      var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
      var year = dateCa.getFullYear();     
      var value = year+"-"+month+"-"+date;
      getWarningDetail(aData[5],value);
		  $(nTds[3]).text('已读');
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
