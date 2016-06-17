$(function() {

    function getLcuSvr(cb){
        var host = $("#lsc_host option:selected").val();
        $.ajax({
            type: "GET",
            url: "/getLcuSvrDistinct",
            data: {
                date: $("#value").val(),
                chartList: $("#chartList").val(),
                host: host
            },
            success: function(data){
                var html = "";
                for(var i=0; i<data.length; i++){
                    html += "<option value='"+data[i]+"'>"+ data[i] +"</option>"
                }
                $("#lsc_key").html(html);
                cb && cb();
            }
        })
    }

    function update(){
        var host = $("#lsc_host option:selected").val()
            , key = $("#lsc_key option:selected").val();
        $.ajax({
            type: "GET",
            url: "/getLcuSvrAjaxData",
            data: {
                date: $("#value").val(),
                chartList: $("#chartList").val(),
                host: host,
                key: key
            },
            success: function (data) {
                var html = "";
                var k;
                if($('#chartList').val().indexOf('MonthList') !== -1){
                    k = 'day';
                }else{
                    k = 'hours';
                }
                for(var i=0; i<data.length; i++){
                    var key = data[i][k] !== undefined && data[i][k] || '00';
                    key = ('00' + key).substr(-2);
                    if(key !== '00') {
                        html += "<tr style='text-align: center'><td>" + key + "</td><td>" + data[i]._count + "</td></tr>"
                    }
                }
                $("#lsc_table tbody").html(html);
                draw(data, key, $("#placeholder-day"), k);
            }
        })
    }

    $('#lsc_key').change(function(){
        update();
    });
    $("#lsc_host").change(function(){
        getLcuSvr(update);
    });

    function draw(data, key, objDiv, t){

        var len = data.length;
        var dataset = [{
            label: key,
            data: []
        }];

        for (var i =0;i<len; i++){
            var temp = data[i];
            var tempData;
            if(t === 'hours') {
                tempData = [temp.hours, temp._count];
            } else {
                tempData = [temp.day, temp._count];
            }

            dataset[0].data.push(tempData);
        }
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
                noColumns: 2
            },
            xaxis: {
                minTickSize: 1
            },
            yaxis: {
//                min: 0
            }});
        objDiv.bind("plothover", function(event, pos, item){
            if(item){
                $('.chart-tooltip').remove();
                var x = item.datapoint[0];

                if(item.series.bars.order){
                    for(var i=0; i < item.series.data.length; i++){
                        if(item.series.data[i][3] == item.datapoint[0])
                            x = item.series.data[i][0];
                    }
                }
                var y = item.datapoint[1];
                if(t === 'hours'){
                    showTooltip(item.pageX + 5, item.pageY + 5, x + ' 时调用量为:' + y);
                }else {
                    showTooltip(item.pageX + 5, item.pageY + 5, x + ' 日调用量为:' + y);
                }
            }
            else {
                $('.chart-tooltip').remove();
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

    getLcuSvr(update);
    //update();
});
