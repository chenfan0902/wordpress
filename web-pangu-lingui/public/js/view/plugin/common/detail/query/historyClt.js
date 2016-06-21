$(function() {
	var table = null,
		oTable = null;
	$('body').toggleClass('clean');
	$('#sidebar').toggleClass('hide-sidebar mobile-sidebar');
	$('#content').toggleClass('full-content');
	//$('#content > .wrapper').toggleClass('hide-wrapper');
	$('.navigation.widget').toggleClass("hide");


    function lcuTimeTopAnalyse(){
        oTable = $('#data-table').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource":$("input[name='queryUrl']").val(),
            "aLengthMenu": [[100], [100]],
            "bRetrieve":true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": false,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sSearch": "<span>主机、流程过滤:</span> _INPUT_",
                "sLengthMenu": "<span>每页显示数:</span> _MENU_",
                "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
            },
            "fnDrawCallback": function () {

            }
        });

        var oSettings = oTable.fnSettings();
        oSettings._iDisplayLength = 100;
    }

    function lcuTimeTopAnalyseRate(){
        oTable = $('#data-table').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource":$("input[name='queryUrl']").val(),
            "bRetrieve":true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": true,
            "aoColumns": [
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {bSortable: false},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {asSorting: ['asc', 'desc']},
                {bSortable: false},
                {asSorting: ['asc', 'desc']},
                {bSortable: false}
            ],
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sSearch": "<span>主机、流程过滤:</span> _INPUT_",
                "sLengthMenu": "<span>每页显示数:</span> _MENU_",
                "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
            },
            "fnDrawCallback": function () {

            }
        });
		if ($('#lcuHost' !==null)){
			$('#data-table_filter>label>input').val($('#lcuName').val());
			$('#hqd_host_sl').val($('#lcuHost').val());
			oTable.fnDraw();
		}
    }

	//===== Datatables =====//
	if($("input[name='chartList']").val() == 'lcuTimeTopAnalyse') {
        lcuTimeTopAnalyse();
	}else if($("input[name='chartList']").val() == 'lcuTimeTopAnalyseRate' || $("input[name='chartList']").val() == 'lcuTimeTopAnalyseRateMonth') {
		//超时流程分析
        lcuTimeTopAnalyseRate();

	} else {
		oTable = $('#data-table').dataTable({
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource":$("input[name='queryUrl']").val(),
			"bRetrieve":true,
			"bJQueryUI": false,
			"bAutoWidth": false,
			"bSort": false,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": [
			{
				"aTargets": [parseInt($("input[name='bVisibleFlag']").val())],
				"bVisible": false
			}
			],
			"oLanguage": {
				"sSearch": "<span>关键字过滤:</span> _INPUT_",
				"sLengthMenu": "<span>每页显示数:</span> _MENU_",
				"oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
				"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
			},
			"fnDrawCallback": function () {

			},
			"fnInitComplete": function(oSettings, json) {
				if($("input[name='bVisibleFlag']").val() !== '') {
					this.$('tr').dblclick(function () {
						var data = oTable.fnGetData(this);
						$('#detail_dialog_content_title').text($("input[name='detailTitle']").val());
						$('#detail_dialog_content').text(data[2]);
						$('#detail_dialog').show();
					});
				}
			}
		});
	}


	initEvent();

	$("#data-table_wrapper tbody").delegate("tr", "dblclick", function() {
		if($("input[name='chartList']").val().indexOf("lcuTimeTopAnalyseRate") == -1){
			return;
		}
		var transcode = $("td:first", this).text();
		var host = $("td:eq(13)", this).text(),
			value = $("#value").val() || "2014-12-25";
		$('#lp_dialog_content_title').text("主机：" + host + ",  流程：" + transcode);
		$("#lp_host").val(host);
		$("#lp_trans").val(transcode);
		$.ajax({
			type: 'get',
			url: '/lcuPointServe',
			data: {
				date: value,
				host: host,
				TRANSCODE: transcode
			},
			success: function(res) {
				var html = "";
				for(var i=0; i<res.length; i++){
					html += "<option>" + res[i] + "</option>";
				}
				$("#lp_pids").html(html);
				if(table === null){
					initChartData();
				}else{
					table.fnDraw();
					$('#lp_dialog').fadeIn('slow');
				}
			}
		});
	});
	$("#data-table_wrapper tbody").delegate("button.tuxhelp", "click", function(e) {
		if($('#hqd_host_sl option:selected').text() === '全部显示'){
			bootbox.modal('<div style="font-size: 15px">选中<b style="color:#4285A7;">全部显示</b>时, ' +
			'<b style="color: #d65f4d">禁止</b>操作tuxedo流程节点信息！请选中某台主机进行操作。</div>', '提示');
			return false;
		}
		var now = new Date();
		var arr = $('#value').val().split('-');
		if(arr[0] != now.getFullYear() || arr[1] != now.getMonth() + 1 || (arr[2] != now.getDate() &&
			'lcuTimeTopAnalyseRateMonth' !== $("input[name='chartList']").val())){
			bootbox.modal('<div style="font-size: 15px">只能在<b style="color: #d65f4d">' +
			'当天或当月</b>的超时流程分析中<b style="color:#4285A7;">打开和关闭</b>流程节点信息采集, ' +
			'请重新选择日期进行操作。</div>', '提示');
			return false;
		}
		e.preventDefault();
		var obj = $(this);
		var state = obj.data('state');
		var host = obj.data('host');
		var lcu = obj.data('lcu');
		var tmp = state === 0 ? '已停止' : '采集中';
		var cls = state === 0 ? 'btn-default' : 'btn-info';
		bootbox.modal('<div style="font-size: 15px;">请在进行以下操作时，知晓其可能<b style="color: #d65f4d">存在的风险</b>，及确认已经获得领导<b style="color: #d65f4d">授权</b>！</div>' +
		'<div style="margin: 10px 0 10px 10px;">' +
		'<button style="float: left;margin-right: 50px;" class="tuxoper btn btn-small '+cls+'" onclick="tuxlcuopenclose(this,\''+host+'\',\''+lcu+'\')">'+tmp+'</button>' +
		'<button class="tuxinit btn btn-small btn-danger" onclick="tuxlcuinit(\''+host+'\')">初始化</button>' +
		'</div><div>说明：<br/>' +
		'1、按需逐个打开监控；处理完毕后，<b><span  style="color: #d65f4d">及时</span>关闭监控</b>；<br/>' +
		'2、打开太多监控后，可以通过“初始化”按钮恢复当前主机当前用户的配置。</div>', '操作须知');
	});

	$("#data-table_wrapper tbody").delegate("button.tuxhelp", "dblclick", function(e) {
		e.stopPropagation();
	});

	//查询队列运行明细
	function initEvent() {

		$('#lp_dialog_header_close').click(function(){
			$('#lp_dialog').fadeOut('fast');
		});

        $('#detail_dialog_header_close').click(function(){
            $('#detail_dialog').hide();
        });
		$('#lp_pids').change(function(){
			//initChartData();
			table.fnDraw();
		});

		$('#hqd_host_sl').change(function(){
			var host = $('#hqd_host_sl option:selected').text() || "全部显示",
				query_url = $("input[name='queryUrl']").val(),
				arr_url = query_url.split('&');
			if( host != '全部显示'){
				var flag = false;
				for(var i=0; i<arr_url.length; i++){
					if( arr_url[i].split('=')[0] == 'host' ){
						arr_url[i] = "hostMonitor="+host;
						flag = true;
					}
				}
				if(!flag){
					arr_url.push("hostMonitor="+host);
				}
				query_url = arr_url.join('&');
				//console.log(query_url)
			}else{
				var resUrl = [];
				for(var i=0; i<arr_url.length; i++){
					if( arr_url[i].split('=')[0] != 'host' ){
						resUrl.push(arr_url[i]);
					}
				}
				query_url = resUrl.join('&');
				//console.log(query_url)
			}
			$("input[name='queryUrl']").val(query_url);
			oTable.fnSettings().sAjaxSource = query_url;
			oTable.fnDraw();
		});
	}

	//初始化图表数据
	function initChartData() {
		var height = $(window).height() * 0.48;
		//console.log(height)
		table = $('#lp_table').dataTable({
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": '/lcuPointDataByPIDPage',
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "date", "value": $('#value').val() } );
				aoData.push( { "name": "chartList", "value": "lcuPointDayList"});
				aoData.push( { "name": "host", "value": $("#lp_host").val() || "10.161.2.141_builder" } );
				aoData.push( { "name": "PID", "value": $('#lp_pids option:selected').text() || 23790082 } );
				aoData.push( { "name": "TRANSCODE", "value": $("#lp_trans").val() || "QAM_OWEFEE_QUERY" } );
			},
			"aoColumns": [
				{ "mData": "TIME" },
				{ "mData": "content" },
				{
					"mData": "timediff",
					fnRender: function(obj) {
						if(obj.aData['timediff'] !== undefined) {
							if (obj.aData['timediff'] >= 1000) {
								return '<div style="color: red"><b>' + obj.aData['timediff'] + '</b></div>';
							} else if( obj.aData['timediff'] >= 300 ){
								return '<div style="color: blue"><b>' + obj.aData['timediff'] + '</b></div>';
							} else {
								return obj.aData['timediff'];
							}
						}else{
							return '<div style="color: green"><b>NULL</b></div>';
						}
					}
				}
			],
			"bRetrieve":true,
			"bJQueryUI": false,
			"bAutoWidth": false,
			"bSort": false,
			"sPaginationType": "full_numbers",
			"sScrollX": "100%",
			"sScrollY": height,
			"oLanguage": {
				"sSearch": "<span>关键字过滤:</span> _INPUT_",
				"sLengthMenu": "<span>每页显示数:</span> _MENU_",
				"oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
				"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
			},
			'fnDrawCallback': function () {
			}
		});
		$('#lp_dialog').fadeIn('slow');
	}
});

function tuxlcuopenclose(self, host, lcu){
	var obj = $('button.tuxhelp[data-hostMonitor="'+host+'"][data-lcu="'+lcu+'"]');
	$.ajax({
		type: 'get',
		url: '/tuxlogHelperCmd',
		data: {
			state: obj.data('state'),
			host: host,
			Lcu: lcu,
			date: $('#value').val(),
			chartList: $('input[name=chartList]').val()
		},
		success: function (data) {
			if(data.state === 1 && data.ok === true){
				obj.removeClass('btn-default');
				obj.addClass('btn-info');
				$(self).removeClass('btn-default');
				$(self).addClass('btn-info');
				obj.text('采集中');
				$(self).text('采集中');
				obj.data('state', data.state);
			}
			if(data.state === 0 && data.ok === true){
				obj.removeClass('btn-info');
				obj.addClass('btn-default');
				obj.text('已停止');
				$(self).removeClass('btn-info');
				$(self).addClass('btn-default');
				$(self).text('已停止');
				obj.data('state', data.state);
			}
		}
	});
}

function tuxlcuinit(host){
	var obj = $('button.tuxhelp[data-hostMonitor="'+host+'"]');
	var self = $('button.tuxoper');
	$.ajax({
		type: 'get',
		url: '/tuxlogHelperCmd',
		data: {
			state: 0,
			host: host,
			Lcu: 'lcu',
			date: '2015-06-08',
			init: 1,
			chartList: $('input[name=chartList]').val()
		},
		success: function (data) {
			self.removeClass('btn-info');
			self.addClass('btn-default');
			self.text('已停止');
			obj.removeClass('btn-info');
			obj.addClass('btn-default');
			obj.data('state', 0);
			obj.text('已停止');
		}
	});
}