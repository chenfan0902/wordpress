$(function() {


    function update(){
        var host = $("#lsc_host option:selected").val().substring(0,16);
        $.ajax({
            type: "GET",
            url: "/getInterfaceRspCodeCountAjaxData",
            data: {
                date: $("#value").val(),
                chartList: $("#chartList").val(),
                host: host
            },
            success: function (data) {

                draw(data, "", $("#placeholder-day"));
            }
        })
    }


    $("#lsc_host").change(function(){
        update();
    });

    function draw(data, key, objDiv){
        var len = data.length;

        var dataset = [{
            label: "应答状态_0000",
            data: [],
            color:"green"
        }
            ,{
            label: "应答状态_9999",
            data: [],
            color:"red"
        },{
            label: "应答状态_other",
            data: [],
            color:"yellow"
        },{
            label: "应答状态_0000",
            data: [],
            color:"green"
        }
        ];


        for (var i =0;i<len; i++){
            var temp = data[i];
            var tempData_0000;
            var tempData_9999;
            var tempData_other;


            var hours = temp.date_time.substr(8,2);
            var minutes = temp.date_time.substr(10,2);

            if(hours!="00" && minutes!="00"){
                var myDate = new Date();
                myDate.setHours(hours);
                myDate.setMinutes(minutes);

                tempData_0000 = [myDate,temp.rsp_code['0000']];
                tempData_9999 = [myDate,temp.rsp_code['9999']];
                tempData_other = [myDate,temp.rsp_code['other']];



                dataset[0].data.push(tempData_0000);
                dataset[1].data.push(tempData_9999);
                dataset[2].data.push(tempData_other);
            }

        }

        var startDate = new Date();
        startDate.setHours("08");
        startDate.setMinutes("20");
        var endDate = new Date();
        endDate.setHours("17");
        endDate.setMinutes("40");


        var plot = $.plot(objDiv, dataset, {

            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            lines: {},
            grid: { hoverable: true, clickable: true },
            legend: {
                noColumns: 1
            },
            xaxis: {
                //max:data[0].date_time.substr(0,8)+"1740",
                //min:data[0].date_time.substr(0,8)+"0820"
                //max:"08:20",
                //min:"17:40"

                mode: "time",
                tickSize: [3600, "second"],
                tickFormatter: function (v, axis) {
                    var date = new Date(v);

                    if (date.getSeconds() % 6 == 0) {
                        var day = (date.getMonth()+1) + '-' + date.getDate();
                        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                        return hours;
                    } else {
                        return "";
                    }
                }
                ,
                max:endDate,
                min:startDate

            },
            yaxis: {
                // min: 100000,
            }
        });
        var previousPoint = null;
        objDiv.bind("plothover", function(event, pos, item){
            if(objDiv.length > 0){
                if(item){
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
                        //---------
                        var time = new Date(x);
                        var tx = time.getHours() > 9 ? time.getHours() : ('0' + time.getHours());
                        tx += ':';
                        tx += time.getMinutes() > 9 ? time.getMinutes() : ('0' + time.getMinutes());
                        //---------

                        //showTooltip(item.pageX-5, item.pageY-5,x + '应答数量为:'+ y);
                        showTooltip(item.pageX+5, item.pageY-5,tx + '应答数量为:'+ y);
                    }
                }
                else {
                    $('.chart-tooltip').remove();
                    previousPoint = null;
                }
            }
        })

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

    //getLcuSvr(update);
    update();
});
