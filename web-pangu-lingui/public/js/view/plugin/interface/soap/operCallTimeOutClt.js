$(function() {
	var table = null,
		oTable = null;
	/*function init() {
		//===== Datatables =====//
		oTable = $('#data-table').dataTable({
			'bProcessing': true,
			//'bServerSide': true,
			'sDom': '<"datatable-header"flr>t<"F"ip>',
			'sAjaxSource': '/getIntfSoapCallTimeOutData',
			'fnServerParams': function (aoData) {
				aoData.push({'name': 'value', 'value': $('#value').val()});
				aoData.push({'name': 'chartList', 'value': $('#chartList').val()});
				aoData.push({'name': 'province', 'value': '11'})
			},
			//'aLengthMenu': [2,3,5,10],
			'bRetrieve': true,
			'bJQueryUI': false,
			'bAutoWidth': false,
			'bSort': false,
			'sPaginationType': 'full_numbers',
			'aoColumns': [
				{ 'mData': 'OPERATE_NAME' },
				{ 'mData': 'PROVINCE_CODE', sClass: 'text-center' },
				{ 'mData': 'gt_10s', sClass: 'text-center' },
				{ 'mData': 'gt_5s', sClass: 'text-center' },
				{ 'mData': 'gt_2s', sClass: 'text-center' },
				{ 'mData': 'gt_10s_rate', sClass: 'text-center', fnRender: function(obj) {
						return (obj.aData.gt_10s / obj.aData.count * 100).toFixed(2) + '%';
					}
				},
				{ 'mData': 'gt_5s_rate', sClass: 'text-center' , fnRender: function(obj) {
						return (obj.aData.gt_5s / obj.aData.count * 100).toFixed(2) + '%';
					}
				},
				{ 'mData': 'gt_2s_rate', sClass: 'text-center', fnRender: function(obj) {
						return (obj.aData.gt_2s / obj.aData.count * 100).toFixed(2) + '%';
					}
				},
				{ 'mData': 'count', sClass: 'text-center' }
			],
			'oLanguage': {
				'sSearch': '<span>操作名过滤:</span> _INPUT_',
				'sLengthMenu': '<span>每页显示数:</span> _MENU_',
				'oPaginate': {'sFirst': '首页', 'sLast': '末页', 'sNext': '>', 'sPrevious': '<'},
				'sInfo': '当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录'
			},
			'fnDrawCallback': function () {

			}
		});

		$(window).resize(function () {
			$.sparkline_display_visible();
		}).resize();
	}*/

	function update(){
		$.ajax({
			type: 'GET',
			url: '/getIntfSoapCallTimeOutData',
			data: {
				date: $('#value').val(),
				chartList: $('#chartList').val(),
				province: '70'
			},
			success: function(data){
				
			}
		})
	}
	init();

});
