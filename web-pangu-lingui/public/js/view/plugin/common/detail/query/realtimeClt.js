$(function() {
    function getQueryUrl(){
        var tempUrl = '';
        if($("input[name='chartList']").val() === 'realTimeWarningChart') {
            var host = $('#rt_host_sl option:selected').val() || '---';
            var t = $('#rt_type_sl option:selected').val() || '---';
            tempUrl = '/realtimeQueryDetailData?mode=warn&type=ing&scope=suffix&subtype=ByTime&date=' + $("input[name='value']").val();
            if( host && host !== '---') {
                tempUrl += '&hostMonitor=' + host;
            }
            if( t && t !== '---') {
                tempUrl += '&t=' + t;
            }
        }else{
            tempUrl = $("input[name='queryUrl']").val();
        }
        return tempUrl;
    }

    //===== Datatables =====//

    oTable = $('#data-table').dataTable({
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": getQueryUrl(),
        /*"sAjaxSource": '/realtimeQueryDetailData',
        "fnServerParams": function ( aoData ) {
            aoData.push( { "name": "mode", "value": 'warn' } );
            aoData.push( { "name": "type", "value": 'ing' } );
            aoData.push( { "name": "scope", "value": 'suffix' } );
            aoData.push( { "name": "subtype", "value": 'ByTime' } );
            aoData.push( { "name": "value", "value": $("input[name='value']").val() } );
            if( hostMonitor && hostMonitor !== '---') {
                aoData.push({"name": "hostMonitor", "value": hostMonitor});
            }
            if( hostMonitor && t !== '---') {
                aoData.push({"name": "t", "value": t});
            }
        },*/
        "bRetrieve":true,
        "bJQueryUI": false,
        "bAutoWidth": false,
        "bSort": false,
        "sPaginationType": "full_numbers",
        "sDom":'<"datatable-header"fl<"startCollection"><"stopCollection">r>t<"datatable-footer"ip>',
        "aLengthMenu": [10,15,20,25,30,50,100,500],
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

        }
    });

    $(".startCollection").html("<button class=\"btn\" id =\"loadBtn\" onclick = \"ctrolAjax()\"type=\"button\">数据采集中</button>").css("float","left").css("width","320px").css("margin","12px auto auto auto");
    //$(".stopCollection").html("<button class=\"btn\" onclick = \"ctrolAjax('0')\"type=\"button\">停止采集</button>").css("float","left").css("width","320px").css("margin","12px auto auto auto");
    //$(".stopCollection").html("<div id =\"loadingImg\" class=\"more\"><img src=\"/img/elements/loaders/7s.gif\" /></div>");
    var oSettings = oTable.fnSettings();
    //oSettings._iDisplayLength = parseInt($("input[name='displayLength']").val());
    /*function updateAjax() {
     oTable.fnPageChange( 'next' );
     timeId = setTimeout(updateAjax, 3000); //此处必须定义全局timeId
     }
     updateAjax();*/
    if($("input[name='chartList']").val() === 'realTimeWarningChart') {
        $('#rt_host_sl').change(function () {
            if (typeof(timeId) !== 'undefined') {
                clearTimeout(timeId);
                delete timeId;
            }
            oTable.fnSettings().sAjaxSource = getQueryUrl();
            loadData();
    });
        $('#rt_type_sl').change(function () {
            if (typeof(timeId) !== 'undefined') {
                clearTimeout(timeId);
                delete timeId;
            }
            oTable.fnSettings().sAjaxSource = getQueryUrl();
            loadData();
        });
    }

});

var loadFlag = true;
function ctrolAjax() {
    if(loadFlag === true ){
        loadFlag = false;
        $('#loadBtn').text('采集已终止');
        if(typeof(timeId) !=='undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
    }else{
        loadFlag = true;
        $('#loadBtn').text('数据采集中');
        if(typeof(timeId) !=='undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
        loadData();
    }
}

function loadData(){
    if(typeof oTable !== 'undefined')
        oTable.fnPageChange(0,true)
    timeId = setTimeout(loadData, 3000); //此处必须定义全局timeId
}
loadData();
