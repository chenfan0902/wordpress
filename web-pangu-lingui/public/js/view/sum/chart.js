$(function() {
	for(var _idx=1; _idx>0; ++_idx) {
		obj = $('#chart-area-'+_idx);
		if(obj.length == 1) {
			
	    data = jQuery.parseJSON($('#chart-area-data'+_idx)[0].innerText)
        if(data[0].data[0]){
    			var plot = $.plot(obj, data, {
    				xaxis: {
    					show: true,
    					min: data[0].data[0][0],
    					max: data[0].data[data[0].data.length-1][0],
    					//mode: "time",
    					minTickSize: 1,
    					//monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    					//tickLength: 1,
    					axisLabel: 'Hours',
    					axisLabelFontSizePixels: 11,
    					tickFormatter: function (v, axis) {
                            return v;
                        }    
    				},
    				yaxis: {
    					//axisLabel: 'Amount',
    					axisLabelUseCanvas: true,
    					axisLabelFontSizePixels: 11,
    					autoscaleMargin: 0.01,
    					axisLabelPadding: 5
    				},
    				series: {
    					lines: {
    						show: true, 
    						fill: true,
    						fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] },
    						lineWidth: 1.5
    					},
    					points: {
    						show: true,
    						radius: 2.5,
    						fill: true,
    						fillColor: "#ffffff",
    						symbol: "circle",
    						lineWidth: 1.1
    					}
    				},
    			   grid: { hoverable: true, clickable: true },
    				legend: {
    					show: false
    				}
    			});
    	}

			function showTooltip(x, y, contents) {
				$('<div id="tooltip" class="chart-tooltip">' + contents + '</div>').css( {
					position: 'absolute',
					display: 'none',
					top: y - 46,
					left: x - 9,
					'z-index': '9999',
					opacity: 0.9
				}).appendTo("body").fadeIn(200);
			}

			var previousPoint = null;
			$('#chart-area-'+_idx).bind("plothover", (function(idx){return function (event, pos, item) {
				$("#x").text(pos.x.toFixed(2));
				$("#y").text(pos.y.toFixed(2));

				if ($('#chart-area-'+idx).length > 0) {
					if (item) {
						if (previousPoint != item.dataIndex) {
							previousPoint = item.dataIndex;
							
							$("#tooltip").remove();
							var x = item.datapoint[0],
								y = item.datapoint[1];
							
							showTooltip(item.pageX, item.pageY,
										"当前坐标值 <strong>" + x + "</strong> - " + item.series.label + " " + "<strong>" + y + "</strong>");
						}
					}
					else {
						$("#tooltip").remove();
						previousPoint = null;            
					}
				}
			}})(_idx));
/*
			$('#chart-area-'+_idx).bind("plotclick", function (event, pos, item) {
				if (item) {
					$("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
					plot.highlight(item.series, item.datapoint);
				}
			});
*/
		}else{
			break;
		}
	}

});
