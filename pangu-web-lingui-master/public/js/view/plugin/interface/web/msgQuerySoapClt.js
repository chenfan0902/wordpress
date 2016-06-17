$(function(){

    $('#content > .wrapper').toggleClass('hide-wrapper');
    var errorHtml = '<div class="msg-error alert alert-error" style="margin-top: 16px;"> ' +
        '<button type="button" class="close" data-dismiss="alert">×</button> ' +
        '<strong>错误!</strong> 查无相关记录，请重新输入！若无法确定手机号码，' +
        '可 <strong><a class="msg-err-href" href="/interface/web/msgQueryFuzzy.html?chartList=queryMsgSoapHttpH2FullyList">点此跳转</a>' +
        '</strong> 到模糊查询</div>';

    var data = JSON.parse($('#data').text());

    if(data === ''){
        $("div.widget > .navbar").after(errorHtml);
    }
});
