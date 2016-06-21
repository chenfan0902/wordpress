$(function () {
    
    var index = 0;
    var dataset =[];
    var dataobj = {};
    var now = new Date();
    var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    var month = (now.getMonth()+1) < 10 ? "0" + (now.getMonth()+1) : (now.getMonth()+1);
    var year = now.getFullYear();     
    var value = year+"-"+month+"-"+date;
    
    if($("#datepicker") && $("#datepicker").attr("value") != ""){        
        value = $("#datepicker").attr("value");
    }

   var param = "";
    $('#transcodeValue').change(function(){
        param=$(this).children('option:selected').val();
        GetData(cb);     
    });  

    function GetData(cb) { 
           
        $.ajax({  
            type:"GET",  
            url:"/getHistoryGraphData",  
            data:"date="+value+"&chartList="+$('#chart-list')[0].innerText+"&index="+index+"&TRANSCODE="+param,
            dataType:"json",  
            success:function(data1){  
                
                for(var item in data1){ 
                   
                   if ((data1[item][data1[item].scopes[0]]).length >0){ 
                        for (var i =0;i<(data1[item][data1[item].scopes[0]]).length; i++){
                            var data = [];
                            var temp =[];
                            temp = [(data1[item][data1[item].scopes[0]])[i][data1[item].colNames[0]],(data1[item][data1[item].scopes[0]])[i][data1[item].colNames[1]]];
                            if(typeof(dataobj[item]) == 'undefined'){
                                data.push(temp);
                                var obj ={};
                                obj.label = data1[item].name;
                                obj.color = data1[item].color;
                                obj.data = data;
                                dataobj[item] = obj;
                               
                            }else{
                                dataobj[item].data.push(temp);
                            }
                        }
                   }
                }
                cb();
                dataset = [];
                dataobj ={};  
                index = index +1;
                if(index < parseInt($('#chart-listCnt')[0].innerText))
                    GetData(cb)
                else
                    index = 0;

            },  
            error:function(){  
                
            }  
        }); 
        
    }
    
    var options = {};
    
    if($("#form-Tag").attr("value") == "true"){  
        options = {
            series: {
                lines: {
                    lineWidth: 1,
                    fill: true,
                    fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] },
                    show: true
    		    },
                points: {
                    show: true,
                    radius: 2.5,
                    fill: true,
                    fillColor: "#ffffff",
                    symbol: "circle",
                    lineWidth: 1.5
                }
            },
            xaxis: {
                show: true,
                axisLabelFontSizePixels: 11
    	    },
            yaxis: {
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 11,
                autoscaleMargin: 0.01,
                axisLabelPadding: 5
            },
            legend: {
                show: true,
                //container: $('#label'+index),
                labelBoxBorderColor: "#ccc",
                backgroundOpacity: 0.85,
                labelFormatter:function(label){return "<FONT COLOR =#97694F SIZE=2>"+label+"</FONT>"}

            },
            grid: { hoverable: true, clickable: true }
        };
    }else{
        options = {
            series: {
                lines: { 
                    lineWidth: 3,
                    fill: false,
                    fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] },
                    show: true
                },
                points: {
                  show: true,
                  radius: 2.5,
                  fill: true,
                  fillColor: "#ffffff",
                  symbol: "circle",
                  lineWidth: 1.5
                }
            },
            xaxis: {
                show: true,
                axisLabelFontSizePixels: 11
            },
            yaxis: {
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 11,
                autoscaleMargin: 0.01,
                axisLabelPadding: 5
            },
            legend: {
                show: true,
                //container: $('#label'+index),
                labelBoxBorderColor: "#ccc",
                backgroundOpacity: 0.85,
                noColumns: 5,
                margin: 2,
                labelFormatter:function(label){return "<FONT COLOR =#97694F SIZE=2>"+label+"</FONT>"}

            },
            grid: { hoverable: true, clickable: true }
        };
    }
    
    function cb(){
        
        for(var item in dataobj){ 
            dataset.push(dataobj[item]);
        }
        //options.legend.container = $('#label'+index);
        $.plot($('#compGraph'+index), dataset, options);
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
    for(var m=0;m<parseInt($('#chart-listCnt')[0].innerText);m++){
        $('#compGraph'+m).bind("plothover", (function(idx){return function (event, pos, item) {
            if(pos.x && pos.y){
                $("#x").text(pos.x.toFixed(2));
                $("#y").text(pos.y.toFixed(2));
            }
            if ($('#compGraph'+idx).length > 0) {
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
        }})(m));
    }

   GetData(cb);  
    
	});