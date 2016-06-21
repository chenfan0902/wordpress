$(function() {

    var table = null;
    var host = null;
    var param = null;

    //页面初始化调用
    function init() {

        host = (!host || host == '') ? $('#qa_serv option:selected').text() : host;
        console.log(host)
        table = $('#qa_table').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": '/queueAnalyzeDayPage',
            "fnServerParams": function ( aoData ) {
                aoData.push( { "name": "date", "value": $('#value').val() } );
                aoData.push( { "name": "chartList", "value": $('#chartList').val() } );
                aoData.push( { "name": "chartBList", "value": $('#chartBList').val() } );
                aoData.push( { "name": "host", "value": host } )
            },
            "aoColumns": [
                { "mData": "name" },
                { "mData": "queue" },
                { "mData": "serve", sClass: 'text-right' },
                { "mData": "lt_5", sClass: 'text-right' },
                { "mData": "m5-10", sClass: 'text-right' },
                { "mData": "m10-20", sClass: 'text-right' },
                { "mData": "ge20", sClass: 'text-right' },
                { "mData": "sum", sClass: 'text-right' },
                { "mData": "max_queued", sClass: 'text-right' },
                {
                    "mData": "host",
                    "sTitle": "操作",//列的标题
                    "sClass": "center",//列的样式
                    "fnRender": function (obj) {
                        return '&nbsp;&nbsp;&nbsp;<a href="javascript:analyzeLcu(\''+host +'\',\''+obj.aData['name']+'\',\''+obj.aData['queue']+'\')">分析流程</a>';
                    }
                }
            ],
            "bRetrieve":true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": false,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sSearch": "<span>关键字过滤:</span> _INPUT_",
                "sLengthMenu": "<span>每页显示数:</span> _MENU_",
                "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
            }
        });

        initServ();

        $("#qa_table tbody").delegate("tr", "dblclick", function() {
            var server = $("td:first", this).text();
            var queue = $("td:eq(1)", this).text();
            var sug = $('td:eq(10)', this).text();

            findDetail(server, queue, sug, host);
        });

    }

    //初始化服务器选择事件
    function initServ() {

        /*$('#qa_serv').delegate('li', 'click', function() {
            hostMonitor = $(this).text();

            table.fnDraw();
        });*/
        $('#qa_serv').change(function(){
            host = $('#qa_serv option:selected').text();

            table.fnDraw();
        });

        $('#qa_dialog_header_close').click(function() {
            $('#qa_dialog').hide();

            //placeholder.unbind();
        });
    }

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
                chartBList: $('#chartBList').val(),
                host: host
            },
            success: function(res) {
                if($('#chartBList').val() === 'queueAnalyzeMaxList'){
                    initMonthData(res, sug);
                }else {
                    initChartData(res, sug);
                }
            }
        })
    }

    //初始化图表数据
    function initChartData (rows, sug) {
        $('#qa_dialog').show();

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
                date = new Date(time.split(' ')[0]);
            }

            var btime = time.split(' ')[1].split(':');
            var hours = parseInt(btime[0]);
            var minutes = parseInt(btime[1]);

            data1[hours * 60 + minutes] = [date.getTime() + (hours * 60 + minutes)*60000, queued];

        }

        var data2 = new Array(24*60);
        for (var j = 0; j < 24*60; j++) {
            data2[j] = [date.getTime() + j*60000, conf];
            if (!data1[j]) {
                data1[j] = [date.getTime() + j * 60000, null];
            }
        }

        data[0].data = data1;
        data[1].data = data2;

        var options = {
            series: {
                lines: {
                    show: true,
                    breakPoint: true
                },
                points: {
                    show: true
                }
            },
            grid: { hoverable: true, clickable: true },
            legend: {
                noColumns: 2
            },
            xaxis: {
                mode: "time",
                minTickSize: [300, "second"],
                //timeformat: "%h:%M",
                tickFormatter: function (val, axis) {
                    //var d = new Date(val);
                    var d = new Date(val - 8 * 3600 * 1000);
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

        drawChart(data, options, '服务:' + server + '; 队列:' + queue + '; 时间:' + $('#value').val());

    }

    function initMonthData(rows, sug){
        $('#qa_dialog').show();

        var data = [{
            label: '运行深度',
            data: []
        }, {
            label: '配置深度',
            data: []
        }];

        var server;
        var queue;
        var i = 0;
        var data1 = new Array(31);
        var data2 = new Array(31);
        for(var k in rows) {
            var row = rows[k];
            //var time = row.timestamp - row.timestamp%3600000;
            if( 0 === i){
                server = row.name;
                queue = row.queue;
                i++;
            }

            var btime = row.time.split(' ')[0].split('-');
            var day = parseInt(btime[2]) - 1;

            data1[day] = [day, row.queued];
            data2[day] = [day, row.serve];
        }

        data[0].data = data1;
        data[1].data = data2;

        var options = {
            series: {
                lines: {
                    show: true,
                    breakPoint: true
                },
                points: {
                    show: true
                }
            },
            grid: { hoverable: true, clickable: true },
            legend: {
                noColumns: 2
            },
            xaxis: {
                tickFormatter: function (val, axis) {
                    return (val + 1) + ' 日';
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
        var placeholder = $("#qa_dialog_content");

        placeholder.bind("plotselected", function (event, ranges) {
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
                        var tx = '';
                        var y = item.datapoint[1];
                        if($('#chartBList').val() === 'queueAnalyzeMaxList'){
                            tx += (x + 1) + ' 日';
                        }else {
                            //var time = new Date(x);
                            var time = new Date(x - 8 * 3600 * 1000);
                            tx = time.getHours() > 9 ? time.getHours() : ('0' + time.getHours());
                            tx += ':';
                            tx += time.getMinutes() > 9 ? time.getMinutes() : ('0' + time.getMinutes());
                        }
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

        $('#qa_dialog_header_close').click(function() {
            $('#qa_dialog').hide();

            placeholder.unbind();
        });

        $('#qa_dialog_content_title').html(title);

        $('#qa_dialog_header_max').click(function() {
            plot.getAxes().min = null;
            plot.getAxes().max = null;
            plot = $.plot(placeholder, data, options);
        });
    }

    init();
});

var table1 = null;
//分析流程
function analyzeLcu(host,name,queue){
    host = (!host || host == '') ? $('#qa_serv option:selected').text() : host;
    var name = name;
    var queue = queue;
    $('#qa_dialog_content_title_lcu').html('服务：'+name+' 队列：'+queue+' 所执行的流程')
    $('#qa_dialog_lcu').show();
    var height = $(window).height() * 0.48;

    // $("#qa_table_lcu").dataTable().fnClearTable();
    //$("#qa_table_lcu").dataTable().fnDestroy();
    if(table1 == null) {
        table1 = $('#qa_table_lcu').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            "bFilter": false,
            "sAjaxSource": '/getAnalyzeLcu?hostMonitor='+host+'&name='+name,
            "aoColumns": [
                {
                    "sTitle": " <input value=\"\" type=\"checkbox\" name=\"boxAll\"  onclick =\"clkBox(this)\"/>",
                    "sClass": "center",
                    "mData": "key",
                    "fnRender": function (obj) {
                        //                       console.log(obj, obj.aData)
                        return ' <input value=\"' + obj.aData.name + '\" type=\"checkbox\" name=\"checkRow\" />';
                    }
                },
                { "sTitle":"流程名","mData": "name","sClass": "center" }
            ],
            "bRetrieve": true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": false,
            "bPaginage":false,
            "sScrollX":"100%",
            "sScrollY":"400px",
            "sPaginationType": "full_numbers",
            "bLengthChange":false,
            "oLanguage": {
                /*"sSearch": "<span>关键字过滤:</span> _INPUT_",
                 "sLengthMenu": "<span>每页显示数:</span> _MENU_",
                 "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },*/
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
            },

            'fnDrawCallback': function () {
            }

        });

        /*  $("#qa_table_lcu").dataTable().fnClearTable();
         $("#qa_table_lcu").dataTable().fnDestroy();*/
    }else{
        table1.fnSettings().sAjaxSource =  '/getAnalyzeLcu?hostMonitor='+host+'&name='+name;
        table1.fnDraw();
    }
    // $('#lp_dialog').fadeIn('slow');
    initServLcu();
}
function initServLcu() {
    $('#qa_dialog_header_close_lcu').click(function() {
        $('#qa_dialog_lcu').hide();
    });
}

function clkBox(box) {
    if (box.checked) {
        $("input[name='checkRow']").attr("checked", "true");
    } else {
        $("input[name='checkRow']").removeAttr("checked");
    }
}

function openAnalyse(){
    var cmdContent = "";
    $("input[name='checkRow']").each(function(i,cbo){
        if(cbo.checked){
            cmdContent+=$(this).val()+"`";
        }
    });

    if (cmdContent === ""){
        alert("请选择一条记录！");
        return;
    }
//    console.log(cmdContent, $('#qa_serv option:selected').text());
    var lcuArr = cmdContent+ $('#qa_serv option:selected').text();
    if ($('#chartList').val() !== 'queueAnalyzeListMONTH')
    {
        window.open('/common/detail/query/history.html?chartList=lcuTimeTopAnalyseRate&date=' + $("#datepicker").attr("value") + '&lcuArr=' + lcuArr, '_blank');
    } else {
        window.open('/common/detail/query/history.html?chartList=lcuTimeTopAnalyseRateMonth&date=' + $("#datepicker").attr("value") + '&lcuArr=' + lcuArr, '_blank');
    }
}