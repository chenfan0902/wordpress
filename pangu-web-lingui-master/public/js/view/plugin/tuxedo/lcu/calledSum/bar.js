$(function() {
  
    
    /*var now = new Date();
    var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    var month = (now.getMonth()+1) < 10 ? "0" + (now.getMonth()+1) : (now.getMonth()+1);
    var year = now.getFullYear();     
    var value = year+"-"+month+"-"+Date;*/
    var value = $('#value').text();
    var barIndex = $('#barIndex')[0].innerText;
    console.log(barIndex)
    
    $('#transcodeValue').change(function(){
        var param = "";
        param=$(this).children('option:selected').val();
        
        if($("#datepicker") && $("#datepicker").attr("value") != ""){        
            value = $("#datepicker").attr("value");
        }

        $.ajax({  
            type:"GET",  
            url:"/tuxedo/lcu/calledSum/history.html",
            data:"date="+value+"&chartList="+$('#chart-list')[0].innerText+"&TRANSCODE="+param+"&ajaxGetTag=true",
            dataType:"json",  
            success:function(data1){        
              for(var item in data1){
                  var tmstr = "" + barIndex,
                      tmlen = tmstr.length;
                  for(var i=0; i<tmlen; i++){
                      var objDiv = $('#placeholder-'+data1[item].scopes[0]);
                      if($('#placeholder-data-'+data1[item].scopes[0])[0].innerText.indexOf('hours')>0 && JSON.stringify(data1[item]).indexOf('hours')>0){
                          draw(data1[item][data1[item].scopes[0]],objDiv);
                      }
                  }
                   
              } 
             
            },  
            error:function(){         
            }  
        });    
    }); 
    
    
  function draw(data,objDiv){ 

      var len = data.length;
      var dataobj = {};
      var dataset =[];
      var order = 1;
      
      for (var i =0;i<len; i++){
          var temp = data[i];
          var item = temp.host;
          var tempData;
          if(temp.hours)
            tempData = [temp.hours,temp._count];
          else
            tempData = [temp.day,temp._count];
          var bars = {
              show: true, 
              barWidth: 0.8,
              lineWidth:0
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
	    legend: {show: true},
	    xaxis: {
            tickFormatter: function (v, axis) {
                return parseInt(v)
            }        
         }
	   
	  });
	 
  }
  
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

	var previousPoint = null,
        str = ""+barIndex,
        len = str.length;
    for(var i = 0;i<len;i++){
        var idx1 = i == 0 ? "day" : i == 1 ? "month" : "year";
        $('#placeholder-'+idx1).bind("plothover",(function(idx){return function (event, pos, item) {

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
                        showTooltip(item.pageX+5, item.pageY+5,x + '(日)时调用量为:'+ y);
                    }
                }
                else {
                    $('.chart-tooltip').remove();
                    previousPoint = null;
                }
            }
        }})(idx1));
    }

    for(var i=0; i<len; i++){
        var idx2 = i == 0 ? "day" : i == 1 ? "month" : "year";
        var objDiv = $('#placeholder-'+idx2);
        draw(jQuery.parseJSON($('#placeholder-data-'+idx2)[0].innerText),objDiv);
    }

});
