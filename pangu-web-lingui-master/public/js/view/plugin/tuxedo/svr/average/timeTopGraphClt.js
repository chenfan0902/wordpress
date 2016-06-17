$(function() {

    function update(){
        var host = $("#hostMonitor").val();
        var key = $("#SVRNAME").val();
        $.ajax({
            type: "GET",
            url: "/getSvrAverageTimeGraphData",
            data: {
                date: $("#value").val(),
                chartList: $("#chartList").val(),
                host: host,
                SVRNAME: key
            },
            success: function (data) {
                draw(data, key, $("#placeholder-day"));
            }
        })
    }

    function draw(data, key, objDiv){

        var len = data.length;
        var dataset = [{
            label: key,
            data: []
        }];

        for (var i =0; i<len; i++){
            var temp = data[i];
            var tempData;

            tempData = [temp.timestamp, temp.AVERAGE];

            dataset[0].data.push(tempData);
        }
        var options = {
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
                mode: "time",
                minTickSize: [300, "second"],
                //timeformat: "%h:%M",
                tickFormatter: function (val, axis) {
                    var d = new Date(val);
                    //var d = new Date(val - 8 * 3600 * 1000);
                    var hours = ('000' + d.getHours()).substr(-2);
                    var minute = ('000' + d.getMinutes()).substr(-2);
                    return hours + ':' + minute;
                }
            },
            yaxis: {
//                min: 0
            },
            selection: {
                mode: "x"
            }
        };
        var plot = $.plot(objDiv, dataset, options);

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
                var time = new Date(x);
                //var time = new Date(x - 8 * 3600 * 1000);
                var tx = time.getHours() > 9 ? time.getHours() : ('0' + time.getHours());
                tx += ':';
                tx += time.getMinutes() > 9 ? time.getMinutes() : ('0' + time.getMinutes());
                showTooltip(item.pageX + 5, item.pageY + 5, tx + ' 的平均耗时为:' + y);
            }
            else {
                $('.chart-tooltip').remove();
            }
        });

        objDiv.bind("plotselected", function (event, ranges) {
            //console.log('plotselected...');

            $.each(plot.getXAxes(), function(_, axis) {
                var opts = axis.options;
                opts.min = ranges.xaxis.from;
                opts.max = ranges.xaxis.to;
                //console.log('opts=>' + opts);
            });
            plot.setupGrid();
            plot.draw();
            plot.clearSelection();
        });

        $('#qa_dialog_header_max').click(function() {
            plot.getAxes().min = null;
            plot.getAxes().max = null;
            plot = $.plot(objDiv, dataset, options);
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

    update();
});
