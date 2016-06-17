$(function() {
    //===== Datatables =====//

    oTable = $('#data-table').dataTable({
        "bProcessing": false,
        "bServerSide": true,
        "sAjaxSource":"/getInterfaceOutMagData",
        "bRetrieve":true,
        "bDestroy":true,
        "bJQueryUI": false,
        "bAutoWidth": false,
        "bSort": false,
        "bPaginage":false,
        "bLengthChange":false,
        //"sPaginationType": "full_numbers",
        "sDom":'<"H"<"outBtn"><"noOutBtn"><"delBtn"><"addBtn">r>t<"F"ip>',
        "aLengthMenu": [[parseInt($("input[name='displayLength']").val())], [parseInt($("input[name='displayLength']").val())]],
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
                    //alert("实时获取数据失败！"̀);
                }
            });
        },
        "fnDrawCallback": function () {

        }
    });

    $(".outBtn").html("<button class=\"btn\" onclick = \"outBtnAjax()\"type=\"button\">变更迁出</button>").css("float","left").css("width","100px").css("margin","12px auto auto auto");
    $(".noOutBtn").html("<button class=\"btn\" onclick = \"notOutBtnAjax('1')\"type=\"button\">未迁出</button>").css("float","left").css("width","100px").css("margin","12px auto auto auto");
    $(".delBtn").html("<button class=\"btn\" onclick = \"delBtnlAjax('0')\"type=\"button\">删除</button>").css("float","left").css("width","100px").css("margin","12px auto auto auto");
    $(".addBtn").html("<button class=\"btn\" onclick = \"addBtnAjax()\"type=\"button\">新增</button>").css("float","left").css("width","320px").css("margin","12px auto auto auto");
    var oSettings = oTable.fnSettings();
    oSettings._iDisplayLength = parseInt($("input[name='displayLength']").val());
    //function updateAjax() {
    //    oTable.fnPageChange( 'next' );
    //    timeId = setTimeout(updateAjax, 3000); //此处必须定义全局timeId
    //}
    //updateAjax();

    //===== Sparklines =====//

    $('#total-visits').sparkline(
        'html', {type: 'bar', barColor: '#ef705b', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
    );
    $('#balance').sparkline(
        'html', {type: 'bar', barColor: '#91c950', height: '35px', barWidth: "5px", barSpacing: "2px", zeroAxis: "false"}
    );

    $(window).resize(function () {
        $.sparkline_display_visible();
    }).resize();

    $('#qa_dialog_header_close').click(function() {
        $('#qa_dialog').hide();
        self.location.reload();

    });
});






function addBtnAjax(idx) {
    $('#qa_dialog').show();

}




function delBtnlAjax(){
    jQuery('#selAllId').removeAttr("checked")
    var tt = "";
    jQuery("input[name='chkJob']").each(function(index,element){
        if(jQuery(this).attr("checked"))
        {
            tt += jQuery(this).val()+",";
            jQuery(this).removeAttr("checked");
        }
    });

    if(tt != ""){
        $.ajax({
            type: "get",
            url: "/delInterfaceOutData",
            data: {
                keys: tt
            },
            success: function (data) {
                if(data=="success"){
                    alert("删除成功");
                    //需要再修改
                    self.location.reload();
                    //$('#data-table').remove();
                    //oTable.fnClearTable();
                    //oTable.dataTable({"bDestroy":true});
                    //oTable.fnSettings().sAjaxSource = "/getInterfaceOutMagData";
                    //oTable.fnDraw();

                }
            }
        })
    }else{
        alert("请选择要处理的任务！");
    }
};


function notOutBtnAjax(){

    jQuery('#selAllId').removeAttr("checked")
    var tt = "";
    jQuery("input[name='chkJob']").each(function(index,element){
        if(jQuery(this).attr("checked"))
        {
            tt += jQuery(this).val()+",";
            jQuery(this).removeAttr("checked");
        }
    });

    if(tt != ""){
        $.ajax({
            type: "get",
            url: "/changeInterfaceNotOutData",
            data: {
                keys: tt
            },
            success: function (data) {
                if(data=="success"){
                    alert("变更未迁出成功");
                    //需要再修改
                    self.location.reload();
                    //$('#data-table').remove();
                    //oTable.fnClearTable();
                    //oTable.dataTable({"bDestroy":true});
                    //oTable.fnSettings().sAjaxSource = "/getInterfaceOutMagData";
                    //oTable.fnDraw();

                }
            }
        })
    }else{
        alert("请选择要处理的任务！");
    }
}

function outBtnAjax(){

    jQuery('#selAllId').removeAttr("checked")
    var tt = "";
    jQuery("input[name='chkJob']").each(function(index,element){
        if(jQuery(this).attr("checked"))
        {
            tt += jQuery(this).val()+",";
            jQuery(this).removeAttr("checked");
        }
    });

    if(tt != ""){
        $.ajax({
            type: "get",
            url: "/changeInterfaceOutData",
            data: {
                keys: tt
            },
            success: function (data) {
                if(data=="success"){
                    alert("变更迁出成功");
                    self.location.reload();
                    //oTable.fnPageChange(-1)

                }
            }
        })
    }else{
        alert("请选择要处理的任务！");
    }
}



function selAll(){
    if(jQuery('#selAllId').attr("checked")){ //选择
        jQuery("input[name='chkJob']").each(function(index,element){
            jQuery(this).attr("checked",'true');
        });
    }else{
        jQuery("input[name='chkJob']").each(function(index,element){
            jQuery(this).removeAttr("checked");
        });
    }


}

function resertForm(){
    document.getElementById("svcCode").value="";
    document.getElementById("sysCode").value="";
    document.getElementById("stateCode").value="1";
    document.getElementById("errorCode").value="";
    document.getElementById("proviceCode").value="ZZ";
   // $('#proviceCode').html("");
   //  $('#sysCode').html("");
   //  $('#svcCode').html("");
   //$('#errorCode').html("");
   // $('#stateCode').html("");
}


function saveInterface() {


    var proviceCode = $('#proviceCode').val();
    var sysCode = $('#sysCode').val();
    var svcCode = $('#svcCode').val();
    var errorCode = $('#errorCode').val();
    var state = $('#stateCode').val();

    $.ajax({
        type: "get",
        url: "/addInterfaceOutData",
        data: {
            proviceCode:proviceCode,
            sysCode : sysCode,
            svcCode :svcCode,
            errorCode :errorCode,
            state : state
},
        success: function (data) {
            if(data=="success"){
                alert("增加成功");
                resertForm();

            }
        }
    })


};


function ctrolAjax(idx) {
    if(idx == '0'){
        if(typeof(timeId) !='undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
    }else{
        if(typeof(timeId) !='undefined'){
            clearTimeout(timeId);
            delete timeId;
        }
        oTable.fnPageChange( 'next' )
        timeId = setTimeout(ctrolAjax, 3000); //此处必须定义全局timeId
    }
}