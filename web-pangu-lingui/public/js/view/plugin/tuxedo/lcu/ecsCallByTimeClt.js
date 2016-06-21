$(function() {

	$('#elcbt_host_sl').change(function(){
		initChartData();
		/*$.ajax({
			type: 'get',
			url: '/getTranscodeByHost',
			data: {
				value: $("input[name='value']").val(),
				hostMonitor: $('#elcbt_host_sl option:selected').text()
			},
			success: function(res) {
				var html = "";
				for(var i=0; i<res.length; i++){
					html += "<option>" + res[i] + "</option>";
				}
				$("#elcbt_clu_sl").html(html);
				initChartData();
			}
		})*/
	});

	/*$('#elcbt_clu_sl').change(function(){
		initChartData();
	});*/

	//初始化图表数据
	function initChartData() {
		var start = $("input[name='_start']").val(),
			interval = $("input[name='interval']").val(),
			end = $("input[name='_end']").val(),
			_cnt = (parseInt(end) - parseInt(start) + 1)/(interval*60*1000);
		if(_cnt != 18){
			_cnt = 18
		}
		console.log('===',start,interval,end,_cnt,'=====')
		$.ajax({
			type: 'get',
			url: '/getECSCallByTimeData',
			data: {
				date: $("input[name='value']").val(),
				host: $('#elcbt_host_sl option:selected').text(),
				_start: start,
				interval: interval,
				_cnt: _cnt
				//TRANSCODE: $('#elcbt_clu_sl option:selected').text()
			},
			success: function(docs) {
				console.log(docs)
				var html = '';
				for(var i=0; i<docs.length; i++){
					if( i%2 == 0 ) {
						html += '<tr class="odd">';
					}else {
						html += '<tr class="even">';
					}
					html += '<td style="text-align: center">'+docs[i]['TIME']+'</td>';
					html += '<td style="text-align: center">'+docs[i]['count']+'</td>';
				}
				$('#elcbt_table > tbody').html(html);
			}
		})
	}

	initChartData();


});
