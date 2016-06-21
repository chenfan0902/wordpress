$(function() {
    var now = new Date().getTime();
    
    var options = {
   
        xaxis: {
            mode: "time",
            tickSize: [1, "second"],
            tickFormatter: function (v, axis) {
                var date = new Date(v);
    
                if (date.getSeconds() % 1 == 0) {
                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    
                    return hours + ":" + minutes + ":" + seconds;
                } else {
                    return "";
                }
            }        
         },   
        legend: {
            show: true,
            noColumns: 1,
            labelBoxBorderColor: "#ccc",
            backgroundOpacity: 0.85,
            margin: 2,
            labelFormatter:function(label){return "<FONT COLOR =#97694F SIZE=2>"+label+"</FONT>"}
        },
        grid: { hoverable: true}
    };
    
    function getData() {
        var dateCa = new Date(now);
        var hours = dateCa.getHours() < 10 ? "0" + dateCa.getHours() : dateCa.getHours();
        var minutes = dateCa.getMinutes() < 10 ? "0" + dateCa.getMinutes() : dateCa.getMinutes();
        var seconds = dateCa.getSeconds() < 10 ? "0" + dateCa.getSeconds() : dateCa.getSeconds();    
        var time =  hours + ":" + minutes + ":" + seconds;
        
        var date = dateCa.getDate() < 10 ? "0" + dateCa.getDate() : dateCa.getDate();
        var month = (dateCa.getMonth()+1) < 10 ? "0" + (dateCa.getMonth()+1) : (dateCa.getMonth()+1);
        var year = dateCa.getFullYear();     
        var value = year+"-"+month+"-"+date;

        $.ajax({  
            type:"GET",  
            url:"/updateHostCompareData",  
            data:"time="+time+"&date="+value+"&collectTime="+$("#collectTime").val(),
            dataType:"json",  
            success:function(data1){  
                  
                for(var item in data1){          
                    if ((data1[item][data1[item].scopes[0]]).length >0){ 
                        var data = data1[item][data1[item].scopes[0]];
                        var len = (data1[item][data1[item].scopes[0]]).length;
                        var dataobj = {};
                        var dataset =[];
                        var order = 1; 
                                                        
                        for (var i =0;i<len; i++){
                          var temp = data[i];
                          var item1 = temp.statType;
                          var tempData = [temp.timestamp,temp._count];
                          var bars = {
                              show: true, 
                              barWidth: 80, 
                          };
                          if(typeof(dataobj[item1]) == 'undefined'){         
                              var obj ={};
                              obj.data = []; 
                              obj.data.push(tempData);
                              bars.order = order;
                              order ++;
                              obj.bars = bars;   
                              obj.label = data1[item].statTypes[item1];    
                              dataobj[item1] = obj;
                              
                           
                          }else{
                              var exists = false;
                              for(var m=0;m<dataobj[item1].data.length;m++){
                                  var tempInner = dataobj[item1].data[m];
                                  if(tempInner[0] == temp.timestamp){
                                      exists = true
                                      break;
                                  }
                              }
                              
                              if(!exists)
                                  dataobj[item1].data.push(tempData);
                          }
                        }
                        
                        for(var item2 in dataobj){ 
                            dataset.push(dataobj[item2]);
                        }

                        var plot = $.plot($('#'+item), dataset, options);

                    }else{
                        var plot = $.plot($('#'+item), [], options);
                    }
 
                }

            },  
            error:function(){ 
                 
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

	
	function update() {
      getData();
      timeId = setTimeout(update, 3000);//此处必须定义全局timeId
    
  }    
  update();

});
