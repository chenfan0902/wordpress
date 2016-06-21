$(function() {
	for(var _idx=1; _idx>0; ++_idx) {
		obj = $('#chart-pie-'+_idx);

		if(obj.length == 1) {
			data = jQuery.parseJSON($('#chart-pie-data'+_idx)[0].innerText)
			var plot = $.plot($('#chart-pie-'+_idx), data, 
			{
				series: {
					pie: { 
						show: true,
						radius: 1,
						label: {
							show: true,
							radius: 2/3,
							formatter: function(label, series){
								return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'+label+'<br/>'+Math.round(series.percent)+'%</div>';
							},
							threshold: 0.1
						}
					}
				},
				legend: {
					show: false
				}
			});
		
		}else{
			break;
		}
	}

});


