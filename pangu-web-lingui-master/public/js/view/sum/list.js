$(function() {

	//===== Sparklines =====//
	
	$('#day-visits').sparkline(
		'html', {type: 'bar', barColor: '#ef705b', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
	);
	$('#total-visits').sparkline(
		'html', {type: 'bar', barColor: '#91c950', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
	);

	$(window).resize(function () {
		$.sparkline_display_visible();
	}).resize();


});
