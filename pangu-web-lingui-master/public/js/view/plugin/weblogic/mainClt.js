$(function() {
    var host = null,
        updateInterval = 10*1000,
        oTable = null;

    $('#wl_serv').change(function(){
        oTable.fnDraw();
    });

    $("#wl_table tbody").delegate("tr", "dblclick", function() {
        var tmp = $("td:first", this).text();
        tmp = tmp.split('`');
        var server = tmp[0];
        var queue = tmp[1];
        var sug = $('td:eq(9)', this).text();

        findDetail(server, queue, sug, host);
    });

    //查询队列运行明细
    function findDetail(serv, que, sug, host) {
        $.ajax({
            type: 'get',
            url: '/getAnalyzeDayDetail',
            data: {
                server: serv,
                queue: que,
                date: $('#value').val(),
                chartList: $('#chartList').val(),
                chartQList: $('#chartQList').val(),
                chartBList: "queueAnalyzeBaseList",
                host: host
            },
            success: function(res) {
                initChartData(res, sug);
            }
        })
    }

    //初始化图表数据
    function initChartData (rows, sug) {
        $('#wl_dialog').show();

        var data = [{
            label: '运行深度',
            data: []
        }, {
            label: '配置深度',
            data: []
        }];

        var conf;
        var date;
        var server;
        var queue;
        var data1 = new Array(24*60);
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var time = row.time;
            var queued = row.queued;

            if (i == 0) {
                conf = row.serve;
                server = row.name;
                queue = row.queue;
                date = new Date(time.split(' ')[0].replace(/-/g, '/'));
            }

            var btime = time.split(' ')[1].split(':');
            var hours = parseInt(btime[0]);
            var minutes = parseInt(btime[1]);

            data1[hours * 60 + minutes] = [date.getTime() + (hours * 60 + minutes)*60000, queued];

        }

        var data2 = new Array(24*60);
        var date3 = sug > 0 ? new Array(24*60) : null;
        for (var j = 0; j < 24*60; j++) {
            data2[j] = [date.getTime() + j*60000, conf];
            if (!data1[j]) data1[j] = [date.getTime() + j*60000, 0];
            if (sug > 0) date3[j] = [date.getTime() + j*60000, sug];
        }

        data[0].data = data1;
        data[1].data = data2;

        /*if (sug > 0) {
         data.push({
         label: '建议配置',
         data: date3
         });
         }*/

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: false
                }
            },
            grid: { hoverable: true, clickable: true },
            legend: {
                noColumns: 2
            },
            xaxis: {
//                tickDecimals: 0
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
            },
            yaxis: {
//                min: 0
            },
            selection: {
                mode: "x"
            }
        };

        drawChart(data, options, '服务:' + server + '; 队列:' + queue + '; 时间:' + $('#value').val());

    }

    //构建图表
    function drawChart(data, options, title) {
        var placeholder = $("#wl_dialog_content");

        placeholder.bind("plotselected", function (event, ranges) {
            //console.log('plotselected...');

            $.each(plot.getXAxes(), function(_, axis) {
                var opts = axis.options;
                opts.min = ranges.xaxis.from;
                opts.max = ranges.xaxis.to;
                console.log('opts=>' + opts);
            });
            plot.setupGrid();
            plot.draw();
            plot.clearSelection();
        });

        placeholder.bind("plotunselected", function (event) {
//            $("#selection").text("");
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
        placeholder.bind("plothover",function (event, pos, item) {

            if (placeholder.length > 0) {
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
                        var time = new Date(x);
                        var tx = time.getHours() > 9 ? time.getHours() : ('0' + time.getHours());
                        tx += ':';
                        tx += time.getMinutes() > 9 ? time.getMinutes() : ('0' + time.getMinutes());
                        showTooltip(
                            item.pageX+5,
                            item.pageY-20,
                            '时间: ' + tx + '<br>队列深度: ' + y);
                    }
                }
                else {
                    $('.chart-tooltip').remove();
                    previousPoint = null;
                }
            }
        });

        var plot = $.plot(placeholder, data, options);

        $('#wl_dialog_header_close').click(function() {
            $('#wl_dialog').hide();

            placeholder.unbind();
        });

        $('#wl_dialog_content_title').html(title);

        $('#wl_dialog_header_max').click(function() {
            plot.getAxes().min = null;
            plot.getAxes().max = null;
            plot = $.plot(placeholder, data, options);
        });
    }

    function updateTable(){
        oTable = $('#wl_table').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": '/getNewestWebLogicData',
            "sDom":'<"H"f<"startUpdate">r>t<"F"ip>',
            "fnServerParams": function ( aoData ) {
                aoData.push( { "name": "value", "value": $('#value').val() } );
                aoData.push( { "name": "chartList", "value": $('#chartList').val() } );
                aoData.push( { "name": "chartBList", "value": $('#chartBList').val() } );
                aoData.push( { "name": "host", "value": $('#wl_serv option:selected').text() || '10.124.0.5' } )
            },
            "aoColumns": [
                { "mData": "Server", sClass: 'text-center' },
                { "mData": "HealthState", sClass: 'text-center',
                    fnRender: function(obj){
                        return obj.aData["HealthState"] && obj.aData["HealthState"] || "-";
                    }},
                { "mData": "OpenSocketsCurrentCount", sClass: 'text-center',
                    fnRender: function(obj){
                        return obj.aData["OpenSocketsCurrentCount"] && obj.aData["OpenSocketsCurrentCount"] || "-";
                    }},
                { "mData": "State", sClass: 'text-center',
                    fnRender: function(obj){
                        return obj.aData["State"] && obj.aData["State"] || "-";
                }},
                { "mData": "HeapFreeCurrent", sClass: 'text-center',
                    fnRender: function(obj){
                        return obj.aData["HeapFreeCurrent"] && obj.aData["HeapFreeCurrent"] || "-";
                }},
                { "mData": "timestamp", sClass: 'text-center',
                    fnRender: function(obj){
                        return obj.aData["timestamp"] && formatDate(obj.aData["timestamp"]) || "-";
                }}
            ],
            "bRetrieve":true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": false,
            "bPaginate": false,
            "bFilter": true,
            "oLanguage": {
                "sSearch": "<span>关键字过滤:</span> _INPUT_",
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _END_ 条记录",
                "sInfoFiltered": ""
            },
            "fnDrawCallback": function(){
                //console.log(oTable.fnSettings().bServerSide);
            }
        });

        $(".startUpdate").html("<button class=\"btn\" type=\"button\">更新数据</button>")
            .css("float","left").css("padding-left","50px").css("margin","12px auto auto auto");


        /*hostMonitor = $('#wl_serv option:selected').text() || '10.124.0.5';
        $.ajax({
            type: 'get',
            url: '/getNewestWebLogicData',
            data: {
                value: $('#value').val(),
                chartList: $('#chartList').val(),
                chartBList: $('#chartBList').val(),
                hostMonitor: hostMonitor
            },
            success: function(data) {
                var html = '', i = 0;
                for(var key in data){
                    if( i%2 == 0 ) {
                        html += '<tr class="odd">';
                    }else {
                        html += '<tr class="even">';
                    }
                    i++;
                    html += '<td style="text-align: center">'+key+'</td>';
                    html += '<td style="text-align: center">'+data[key]['HealthState']+'</td>';
                    html += '<td style="text-align: center">'+data[key]['OpenSocketsCurrentCount']+'</td>';
                    html += '<td style="text-align: center">'+data[key]['State']+'</td>';
                    html += '<td style="text-align: center">'+data[key]['HeapFreeCurrent']+'</td>';
                    html += '<td style="text-align: center">'+formatDate(data[key]['timestamp'])+'</td>';
                }
                $('#wl_table > tbody').html(html);
            }
        });*/
    }
    updateTable();
    $(".startUpdate").click(function(){
        //console.log(oTable.fnFilter("AdminServer"))
        oTable.fnDraw();
    })
    //setInterval(updateTable, updateInterval);
})