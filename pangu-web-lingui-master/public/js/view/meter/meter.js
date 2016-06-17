$(function() {
	for(var _idx=1; _idx>0; ++_idx) {
		objDiv = $('#meterChart-'+_idx);
		if(objDiv.length == 1) {	
        var data = jQuery.parseJSON($('#meterChart-data'+_idx)[0].innerText);
        if ((data.scopes[0]).length >0){ 
            var labels = { visible: true, position: 'inside', interval: 2000,position: 'inside'};
            var caption = { offset: [0, -25], position: 'bottom' };
            caption.value = data.innerName;
            labels.interval = data.interval;
            objDiv.jqxGauge({
                ranges: [{ startValue: 0, endValue: data.endValue1, style: { fill: '#52ac52', stroke: '#52ac52' }, startDistance: '5%', endDistance: '5%', endWidth: 13, startWidth: 13 },
                         { startValue: data.endValue1, endValue: data.endValue2, style: { fill: '#feeb31', stroke: '#feeb31' }, startDistance: '5%', endDistance: '5%', endWidth: 13, startWidth: 13 },
                         { startValue: data.endValue2, endValue: data.endValue3, style: { fill: '#d03e3e', stroke: '#d03e3e' }, startDistance: '5%', endDistance: '5%', endWidth: 13, startWidth: 13 }
                        ],
                cap: { radius: 0.04 },
                caption: caption,
                value: 0,
                style: { stroke: '#ffffff', 'stroke-width': '1px', fill: '#ffffff'  },
                animationDuration: 1500,
                colorScheme: 'scheme04',
                labels: labels,
                min: 0, 
                max: data.max,
                width: '100%',
                height: '100%',
                ticksMinor: { interval: data.interval/2, size: '5%' },
                ticksMajor: { interval: data.interval, size: '10%' },
                border: {visible: true}
            });
            if(data[data.scopes[0]][0])
                objDiv.jqxGauge('setValue',data[data.scopes[0]][0][data.colNames[0]]);
        }
         	
		}else{
			break;
		}
	}
	
    $('#wellDiv').wresize(function(e){ 
        $('#meterChart-1').jqxGauge({ width: '100%' });
    	  $('#meterChart-1').jqxGauge({ height: '100%' });
    	  $('#meterChart-2').jqxGauge({ width: '100%' });
    	  $('#meterChart-2').jqxGauge({ height: '100%' });
    	  $('#meterChart-3').jqxGauge({ width: '100%' });
    	  $('#meterChart-3').jqxGauge({ height: '100%' });     
    });	
	

});
