$(function(){
    var table = $('.table');
    table.delegate('.borrow', 'click', function () {
        var self = $(this).parent('td').parent('tr');
        var k = self.find('td:nth-child(1)').text();
        var h = self.find('td:nth-child(2)').text();
        var a = self.find('td:nth-child(3)').text();
        var g = self.find('td:nth-child(4)').text();
        var f = self.find('td:nth-child(5)').text();
        var l = self.find('td:nth-child(6)').text();
        var e = self.find("td:nth-child(7)").text();
        if(e == "可借阅"){e = "1";}
        else{e = "0";}
        if (e == "0") {//0为已借阅 1为可借阅
            alert("借阅失败！本书已被借阅。");
        }else if (e == "1"){
            e = "0";
            alert("借阅成功！");
        }else{
            alert("系统查询状态失败");}
        $.ajax({
            type: 'get',
            url: '/borrow',
            data: {
                _id: k,
                ISBN: h,
                bookName: a,
                press: g,
                author: f,
                publishDate: l,
                borrowStatus: e
            },
            // input class = "update"??? 自己改
            success: function(data){
                if(e == "1"){e = "可借阅";}
                 else{e = "已借阅";}
                var html = '<td style="display:none">' + k + '</td><td>' + h + '</td><td>' + a + '</td><td>' + g + '</td><td>' + f + '</td><td>' + l + '</td><td>' + e + '</td>' +
                    '<td>' +
                    '<input class="borrow btn btn-mini" value="借阅" type="button">' +
                    '<input class="returning btn btn-mini" value="归还" type="button">' +
                    '</td>';
                self.html(html);
            }, //miss ','
            failure: function(data){
                alert("借阅失败！");
            }

    });
}); //miss ");"
    table.delegate('.returning', 'click', function () {
        var self = $(this).parent('td').parent('tr');
        var k = self.find('td:nth-child(1)').text();
        var h = self.find('td:nth-child(2)').text();
        var a = self.find('td:nth-child(3)').text();
        var g = self.find('td:nth-child(4)').text();
        var f = self.find('td:nth-child(5)').text();
        var l = self.find('td:nth-child(6)').text();
        var e = self.find("td:nth-child(7)").text();
        if(e == "可借阅"){e = "1";}
        else{e = "0";}
        if (e == "1") {
            alert("归还失败！本书已被归还。"); 
        }else if (e == "0"){
            e = "1";
            alert("归还成功！")
        }else{
            alert("系统查询状态失败");}
        $.ajax({
            type: 'get',
            url: '/returning',
            data: {//h = self.find('td:nth-child(2)').text();
                _id: k,
                //_id: $('id').val(), 这就是你原来的，粗心呀
                ISBN: h,
                bookName: a,
                press: g,
                author: f,
                publishDate: l,
                borrowStatus: e
            },
            success: function(data){
                if(e == "1"){e = "可借阅";}
                 else{e = "已借阅";}
                var html = '<td style="display:none">' + k + '</td><td>' + h + '</td><td>' + a + '</td><td>' + g + '</td><td>' + f + '</td><td>' + l + '</td><td>' + e + '</td>' +
                    '<td>' +
                    '<input class="borrow btn btn-mini" value="借阅" type="button">' +
                    '<input class="returning btn btn-mini" value="归还" type="button">' +
                    '</td>';
                self.html(html);
            }, //miss ','
            failure: function (data){
                alert("借阅失败！");
            }
        });
    });
});



