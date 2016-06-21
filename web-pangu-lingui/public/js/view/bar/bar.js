$(function() {
	for(var _idx=1; _idx>0; ++_idx) {
		objDiv = $('#placeholder-'+_idx);
		if(objDiv.length == 1) {
			
            var data = jQuery.parseJSON($('#placeholder-data'+_idx)[0].innerText);
            var len = data.length;
            var dataobj = {};
            var dataset =[];
            var order = 1;
          
            for (var i =0;i<len; i++){
                var temp = data[i];
                var item = temp.host;
                var tempData = [temp.hours,temp._count];
                var bars = {
                    show: true,
                    barWidth: 0.15
                };
                if(typeof(dataobj[item]) == 'undefined'){
                    var obj ={};
                    obj.data = [];
                    obj.data.push(tempData);
                    bars.order = order;
                    obj.bars = bars;
                    obj.label = item;
                     //obj.color = "#f0471a";
                     dataobj[item] = obj;
                     order ++;

                }else{
                    dataobj[item].data.push(tempData);
                }
            }
        
            for(var item in dataobj){
                dataset.push(dataobj[item]);
            }
        
			var plot = $.plot(objDiv, dataset, {
			    grid:{
                    hoverable:true
                },
			    legend: {show: true}
			   
			});


			function showTooltip(x, y, contents, areAbsoluteXY) {
                var rootElt = 'body';
                $('<div id="tooltip2" class="chart-tooltip">' + contents + '</div>').css( {
                    position: 'absolute',
                    display: 'none',
                    top: y - 45,
                    left: x - 8,
                    'z-index': '9999',
                    'color': '#fff',
                    'font-size': '11px',
                    opacity: 0.8
                }).prependTo(rootElt).show();
            }

			var previousPoint = null;
			$('#placeholder-'+_idx).bind("plothover", (function(idx){return function (event, pos, item) {

				if ($('#placeholder-'+idx).length > 0) {
					if (item) {
						if (previousPoint != item.datapoint) {
							previousPoint = item.datapoint;
							
							$('.chart-tooltip').remove();
							var x = item.datapoint[0];
							
							if(item.series.bars.order){
                                for(var i=0; i < item.series.data.length; i++){
                                    if(item.series.data[i][3] == item.datapoint[0])
                                        x = item.series.data[i][0];
                                }
                            }
 
                            var y = item.datapoint[1];
                            showTooltip(item.pageX+5, item.pageY+5,'主机'+item.series.label+':<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+x + '时调用总量为:'+ y);
						}
					}
					else {
						 $('.chart-tooltip').remove();
                         previousPoint = null;
					}
				}
			}})(_idx));

		}else{
			break;
		}
	}

});
