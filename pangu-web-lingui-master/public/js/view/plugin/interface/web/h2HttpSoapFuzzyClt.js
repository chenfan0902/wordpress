$(function() {
    //if($('body').scrollTop() > 100) {
    //    $('body').animate({scrollTop: '0px'}, 500, function () {
    //        $('input:radio[name=provinceSelect]').focus();
    //    });
    //}else{

    var start_hour = null;
    var start_minute=null;
    var end_hour = null;
    var end_minute=null;
    var useflag=null;
    $('input:radio[name=provinceSelect]').focus();
    //}

    var errorHtml = '<div class="msg-error alert alert-error" style="margin-top: 16px;"> ' +
        '<button type="button" class="close" data-dismiss="alert">×</button> ' +
        '<strong>错误!</strong> 查无相关记录，请重新输入！若无法确定手机号码，' +
        '可 <strong><a class="msg-err-href" href="#">点此跳转</a>' +
        '</strong> 到模糊查询</div>';

    var noInfo = '<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">No matching records found</td></tr>';

    function updateInfo() {
        addVisitCount();
        //start_hour = (!start_hour || start_hour == '') ? $('#select1 option:selected').text() : start_hour;
        //start_minute = (!start_minute || start_minute == '') ? $('#select2 option:selected').text() : start_minute;
        //end_hour = (!end_hour || end_hour == '') ? $('#select3 option:selected').text() : end_hour;
        //end_minute = (!end_minute || end_minute == '') ? $('#select4 option:selected').text() : end_minute;
        start_hour =  $('#select1 option:selected').text() ;
        start_minute = $('#select2 option:selected').text();
        end_hour = $('#select3 option:selected').text() ;
        end_minute = $('#select4 option:selected').text() ;
        useflag = $('#useflag option:selected').text() ;
        console.debug(start_hour+":"+start_hour+"------"+end_hour+":"+end_minute);
        $("div.msg-error.alert.alert-error").remove();
        $("#query_msg_processing").show();
        $.ajax({
            type: "get",
            url: "/getH2HttpSoapFuzzyData",
            data: {
                date: $('#value').val(),
                chartList: $('#chartList').val(),
                key: $("#msg_query_in").val() || null,
                useflag:useflag,
                start_hour:start_hour,
                start_minute:start_minute,
                end_hour:end_hour,
                end_minute:end_minute
            },
            success: function(data){
                if(!data || (data.soapCnt === 0 && data.httpCnt === 0 && data.h2Cnt === 0)){
                    $("#query_msg_processing").hide();
                    $("div.search.widget").after(errorHtml);
                    return;
                }
                //console.log("---"+data);
                setInfo(data);

                $("#query_msg_processing").hide();
            },
            failure: function(err){
                if(err){
                    console.log(err);
                }
                $("#query_msg_processing").hide();
            }

        });
    }

    $("#submit").click(function(e){
        clearInfo();
        e.preventDefault();
        updateInfo();
    });

    $('#msg_query_in').keydown(function(e){
        if(e.keyCode === 13){
            clearInfo();
            e.preventDefault();
            updateInfo();
        }
    });
    $("input:radio[name=provinceSelect]").keydown(function(e){
        if(e.keyCode === 13){
            $("#msg_query_in").focus();
        }
    });

    function setInfo(data, date){

        date = date || $('#value').val();
        $('.query-msg-cnt').html('SOAP: '+data.soapCnt+', HTTP: '+data.httpCnt+', H2: '+data.h2Cnt);
        var soap = '';
        var http = '';
        var h2 = '';
        for(var i=0; i< data.soap.length; i++){
            soap += '<tr><td class="text-center">'+ data.soap[i].TRANS_IDO +'</td>';
            soap += '<td class="text-center">'+ data.soap[i].TIME +'</td>';
            soap += '<td class="text-center">'+data.soap[i].SERVICE_NAME +'</td>';
            soap += '<td class="text-center">'+data.soap[i].OPERATE_NAME +'</td>';
            soap += '<td class="text-center">'+data.soap[i].RSP_CODE +'</td>';


            soap += '<td class="text-center"><a href="/interface/web/msgQuerySoap.html?chartList=IntfSoapHeadAndMsgPROV'+
            '&TRANS_IDO='+data.soap[i].TRANS_IDO+
            '&date='+ date + '" target="_blank" class="query-detail">查询</a></td></tr>';

        }
        $("#query_msg_soap > tbody").html(soap);
        for(i=0; i< data.http.length; i++){
            http += '<tr><td class="text-center">'+ data.http[i].TransIDO +'</td>';
            http += '<td class="text-center">'+ data.http[i].TIME +'</td>';
            http += '<td class="text-center">'+data.http[i].BIPCode +'</td>';
            http += '<td class="text-center">'+data.http[i].ActivityCode +'</td>';
            http += '<td class="text-center">'+data.http[i].RspCode +'</td>';
            http += '<td class="text-center"><a href="/interface/web/msgQueryHttp.html?chartList=IntfHttpHeadAndMsgPROV'+
            '&TRANS_IDO='+data.http[i].TransIDO +
            '&date='+ date + '" target="_blank" class="query-detail">查询</a></td></tr>';
        }
        $("#query_msg_http > tbody").html(http);
        for(i=0; i< data.h2.length; i++){
            h2 += '<tr><td class="text-center">'+ data.h2[i].TRADE_ID +'</td>';
            h2 += '<td class="text-center">'+ data.h2[i].TIME +'</td>';
            h2 += '<td class="text-center">'+data.h2[i].SERVICE_TYPE +'</td>';
            h2 += '<td class="text-center">'+data.h2[i].TRADE_NUM +'</td>';
            h2 += '<td class="text-center">'+data.h2[i].RSP_CODE +'</td>';
            h2 += '<td class="text-center"><a href="/interface/web/msgQueryH2.html?chartList=IntfH2HeadAndMsgPROV'+
            '&TRANS_IDO='+data.h2[i].TRADE_ID +
            '&date='+ date + '" target="_blank" class="query-detail">查询</a></td></tr>';
        }
        $("#query_msg_h2 > tbody").html(h2);
        if(data.h2Cnt === 0 ){
            $("#query_msg_h2 > tbody").html(noInfo);
        }else{
            $('.ttt > li:nth-child(3)').addClass('active');
            $('.ttt > li:nth-child(1)').removeClass('active');
            $('.ttt > li:nth-child(2)').removeClass('active');
            $('#soap').removeClass('active');
            $('#http').removeClass('active');
            $('#h2').addClass('active');
        }
        if(data.httpCnt === 0 ){
            $("#query_msg_http > tbody").html(noInfo);
        }else{
            $('.ttt > li:nth-child(2)').addClass('active');
            $('.ttt > li:nth-child(1)').removeClass('active');
            $('.ttt > li:nth-child(3)').removeClass('active');
            $('#soap').removeClass('active');
            $('#h2').removeClass('active');
            $('#http').addClass('active');
        }
        if(data.soapCnt === 0 ){
            $("#query_msg_soap > tbody").html(noInfo);
        }else{
            $('.ttt > li:nth-child(1)').addClass('active');
            $('.ttt > li:nth-child(2)').removeClass('active');
            $('.ttt > li:nth-child(3)').removeClass('active');
            $('#h2').removeClass('active');
            $('#http').removeClass('active');
            $('#soap').addClass('active');
        }
    }
    function clearInfo(){
        $("#query_msg_soap > tbody").html(noInfo);
        $("#query_msg_http > tbody").html(noInfo);
        $("#query_msg_h2 > tbody").html(noInfo);
    }
});
