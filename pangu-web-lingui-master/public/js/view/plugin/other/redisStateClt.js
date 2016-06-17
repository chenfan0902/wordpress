$(function() {
    //===== Datatables =====//

    oTable = $('#data-table').dataTable({
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource":$("input[name='queryUrl']").val(),
        "bRetrieve":true,
        "bJQueryUI": false,
        "bAutoWidth": false,
        "bSort": true,
        "sPaginationType": "full_numbers",
        "sDom":'<"datatable-header"fl<"startRedis"><"stopRedis"><"flushCache"><"allHits">r>t<"datatable-footer"ip>',
        "aLengthMenu": [10,30,50,100],
        "oLanguage": {
            "sSearch": "<span>关键字过滤:</span> _INPUT_",
            "sLengthMenu": "<span>每页显示数:</span> _MENU_",
            "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
        },
        "fnServerData": function ( sSource, aoData, fnCallback ) {
            $.ajax({
                "dataType": 'json',
                "type": "get",
                "url": sSource,
                "data": aoData,
                "success": fnCallback,
                "error": function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert("实时获取数据失败！"?);
                }
            });
        },
        "fnDrawCallback": function () {
            this.$('tr').dblclick(function () {
                var data = oTable.fnGetData(this);
                maintainHost(data,3);
            });
            $('#detail_dialog_header_close').click(function(){
                $('#detail_dialog').hide();
            });

        },
        "fnInitComplete": function(oSettings, json) {
        },
        "aoColumns": [
            {
                "sTitle": " <input value=\"\" type=\"checkbox\" name=\"boxAll\"  onclick =\"clkBox(this)\"/>",
                "sClass": "center",
                "fnRender": function (obj) {
                    return ' <input value=\"' + obj.aData[1]+'|'+ obj.aData[8] + '\" type=\"checkbox\" name=\"checkRow\" />';
                }
            },
            { "sTitle": "主机IP", "sClass": "center",asSorting: ['asc', 'desc']},
            { "sTitle": "业务范围","sClass": "center" ,asSorting: ['asc', 'desc']},
            { "sTitle": "版本", "sClass": "center",asSorting: ['asc', 'desc'] },
            //{ "sTitle": "使用内存", "sClass": "center" },
            {
                "sTitle": "使用内存",
                "sClass": "center",
                asSorting: ['asc', 'desc'],
                "fnRender": function (obj) {
                    return obj.aData[4]+'M' + '&nbsp;&nbsp;&nbsp;<a href="javascript:redisStateGraph(\'mem\',\''+ obj.aData[1] +'\',\''+obj.aData[2]+'\')"><i class="ico-search"></i></a>';
                }
            },
            {
                "sTitle": "db0",
                "sClass": "center",
                asSorting: ['asc', 'desc'],
                "fnRender": function (obj) {
                    return obj.aData[5] + '&nbsp;&nbsp;&nbsp;<a href="javascript:redisStateGraph(\'keys\',\''+ obj.aData[1] +'\',\''+obj.aData[2]+'\')"><i class="ico-search"></i></a>';
                }
            },
            {
                "sTitle": "查询命中次数",
                "sClass": "center",
                asSorting: ['asc', 'desc'],
                "fnRender": function (obj) {
                    return obj.aData[6] + '&nbsp;&nbsp;&nbsp;<a href="javascript:redisStateGraph(\'hits\',\''+ obj.aData[1] +'\',\''+obj.aData[2]+'\')"><i class="ico-search"></i></a>';
                }
            },
            { "sTitle": "状态", "sClass": "center",asSorting: ['asc', 'desc'] },

            { "sTitle": "操作", "bSearchable": false, "bVisible": false,"sClass": "center" },
            {
                "sTitle": "总数",
                "bSearchable": false,
                "bVisible": false,
                "sClass": "center",
                "fnRender": function (obj) {
                    $('.allHits').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>查询命中总数：<font color=\"red\">"+obj.aData[9]+"</font></strong>");
                    return obj.aData[9];
                }
            },
            {
                "sTitle": "QPS",
                "sClass": "center",
                asSorting: ['asc', 'desc'],
                "fnRender": function (obj) {
                    return obj.aData[10] + '&nbsp;&nbsp;&nbsp;<a href="javascript:redisStateGraph(\'qps\',\''+ obj.aData[1] +'\',\''+obj.aData[2]+'\')"><i class="ico-search"></i></a>';
                }
            },
            { "sTitle": "连接数", "sClass": "center",asSorting: ['asc', 'desc'] },
            { "sTitle": "时间", "sClass": "center",asSorting: ['asc', 'desc']}
            /*{
             "sTitle": "操作",
             "sClass": "center",
             "fnRender": function (obj) {
             return '<a href=\"'+obj.aData[1]+'\" class=\"pull-center\">查询key值</a>';
             }
             }*/
        ]
    });

    $(".startRedis").html("<button class=\"btn\" id =\"loadBtn\" onclick = \"sendCmd(0)\"type=\"button\">启动服务</button>").css("float","left").css("margin","12px auto auto auto");
    $(".stopRedis").html("&nbsp;<button class=\"btn\" onclick = \"sendCmd(1)\"type=\"button\">停止服务</button>").css("float","left").css("margin","12px auto auto auto");
    $(".flushCache").html("&nbsp;<button class=\"btn\" onclick = \"sendCmd(2)\"type=\"button\">清除缓存</button>").css("float","left").css("margin","12px auto auto auto");
    $(".allHits").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>查询命中总数：<font color=\"red\">"+0+"</font></strong>").css("float","left").css("margin","18px auto auto auto");
    var oSettings = oTable.fnSettings();

});


function maintainHost(data,tag) {
    if (tag === 1){
        $("#hostIp").show();
        $("#hostIp").attr("disabled",false);
        $("#hostInfo").show();
        $("#monitorTypeV").show();
        $("#addHost").show();
        $("#delHost").hide();
        $("#modHost").hide();
        $("#hostIp").val('');
        $("#hostInfo").val('');
    }/*else if (tag === 2){
        if(data){
            $("#hostIp").attr("value", data[1]);
        }
        $("#hostIp").show();
        $("#hostIp").attr("disabled",false);
        $("#hostInfo").hide();
        $("#monitorTypeV").hide();
        $("#addHost").hide();
        $("#delHost").show();
        $("#modHost").hide();
    }*/else {
        $("#hostIp").show();
        $("#hostIp").attr("disabled",true);
        $("#hostInfo").show();
        $("#monitorTypeV").show();
        $("#addHost").hide();
        $("#delHost").show();
        $("#modHost").show();
        $("#hostIp").attr("value", data[1]);
        $("#hostInfo").attr("value", data[2]);
    }
    $('#detail_dialog').show();
}


function clkBox(box){
    if(box.checked){
        $("input[name='checkRow']").attr("checked","true");
    }else{
        $("input[name='checkRow']").removeAttr("checked");
    }
}

function sendCmd(type) {
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

    $.ajax({
        type: 'get',
        url: '/other/redisSendCmd',
        data: {
            type: type,
            cmdContent: cmdContent
        },
        success: function (data) {
            alert(JSON.stringify(data).replace('{','').replace('}',''));
            $("input[name='checkRow']").removeAttr("checked");
            $("input[name='boxAll']").removeAttr("checked");
            oTable.fnPageChange(0,true);
        }
    });
}


var graphOptions = {
    series: {
        lines: {
            show: true,
            breakPoint: true
        },
        points: {
            show: true
        }
    },
    xaxis: {
        mode: "time",
        minTickSize: [300, "second"],
        tickFormatter: function (val, axis) {
            var d = new Date(val);
            var hours = ('000' + d.getHours()).substr(-2);
            var minute = ('000' + d.getMinutes()).substr(-2);
            return hours + ':' + minute;
        }
    },
    yaxis: {
        //min: 0
    },
    legend: {
        noColumns: 2
    },
    grid: { hoverable: true, clickable: true},
    selection: {
        mode: "x"
    }
};


function redisStateGraph(type,host,hostName){

    $.ajax({
        type: 'get',
        url: '/other/redisStateGraph',
        data: {
            type:type,
            host: host
        },
        dataType:"json",
        success: function (data1) {
            var titleText = '';
            if(type ==='mem'){
                titleText = '内存使用';
            }else if(type ==='keys'){
                titleText = 'key值数量';
            }else if(type ==='qps'){
                titleText = 'QPS';
            }else{
                titleText = '查询命中次数';
            }
            $('#graph_dialog_content_title').text(hostName+'-'+host);
            var dataset = [];
            var dataobj = {};
            dataobj.label = titleText;
            dataobj.data = [];
            for (var i =0;i<data1.length; i++){
                var temp =[];
                if(type ==='mem'){
                    temp =[data1[i].timestamp,data1[i].used_memory];
                }else if(type ==='keys'){
                    temp =[data1[i].timestamp,data1[i].db];
                }else if(type ==='qps'){
                    temp =[data1[i].timestamp,data1[i].instantaneous_ops_per_sec];
                }else{
                    temp =[data1[i].timestamp,data1[i].keyspace_hits];
                }
                dataobj.data.push(temp);
            }

            $('#graph_dialog').show();
            dataset.push(dataobj);
            drawGraph(dataset)

        }
    });

}


function drawGraph(dataset){

    var placeholder = $('#redisStateGraph');

    var plot = $.plot(placeholder, dataset, graphOptions);

    placeholder.bind("plotselected", function (event, ranges) {
        $.each(plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.min = ranges.xaxis.from;
            opts.max = ranges.xaxis.to;
        });
        plot.setupGrid();
        plot.draw();
        plot.clearSelection();
    });


    function showTooltip(x, y, contents) {
        $('<div id="tooltip" class="chart-tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y - 46,
            left: x - 9,
            'z-index': '9999',
            opacity: 0.9
        }).appendTo("body").fadeIn(200);
    };


    var previousPoint = null;
    placeholder.bind("plothover", function (event, pos, item) {
        if(pos.x && pos.y){
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));
        }
        if (placeholder.length > 0) {
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0],
                        y = item.datapoint[1];
                    var time = new Date(x);
                    var tx = time.getHours() > 9 ? time.getHours() : ('0' + time.getHours());
                    tx += ':';
                    tx += time.getMinutes() > 9 ? time.getMinutes() : ('0' + time.getMinutes());

                    showTooltip(item.pageX, item.pageY,
                            "当前坐标值 <strong>" + tx + "</strong> - " + item.series.label + " " + "<strong>" + y + "</strong>");
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        }
    });

    pageInit();


    $('#graph_dialog_header_max').click(function() {
        plot.getAxes().min = null;
        plot.getAxes().max = null;
        plot = $.plot(placeholder, dataset, graphOptions);
    });

}

function pageInit() {
    $('#graph_dialog_header_close').click(function () {
        $('#graph_dialog').hide();
        $('#redisStateGraph').html('');
        $('#redisStateGraph').unbind();
    });
}

var freshRate  = 30000;
function ctrolAjax(tag) {
    if(tag === '2'){
        if(typeof(timeId) !=='undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
    }else if(tag === '0' ){
        if(typeof(timeId) !=='undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
        freshRate  = 30000;
        loadData();
    }else{
        if(typeof(timeId) !=='undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
        freshRate  = 60000;
        loadData();
    }
}


function modifyHostInfo(tag){

    if($("#hostIp").val() === ''){
        alert("主机不能为空！");
        return;
    }
    $.ajax({
        type: 'get',
        url: '/other/modifyRedisHostInfo',
        data: {
            hostIp:$("#hostIp").val(),
            hostInfo: $("#hostInfo").val(),
            tag:tag,
            monitorType:$("#monitorType").val()
        },
        dataType:"text",
        success: function (data) {
            $("#hostIp").attr("value","");
            $("#hostInfo").attr("value","");
            alert(data);
            $('#detail_dialog').hide();
            oTable.fnPageChange(0,true);
        }
    });

}

function loadData(){
    if(typeof oTable !== 'undefined')
        oTable.fnPageChange(0,true)
    timeId = setTimeout(loadData, freshRate); //此处必须定义全局timeId
}
loadData();
