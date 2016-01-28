$(function(){
    var editHtml = '<tr class="edit">' +
        '<td style="display:none"><input id="_id" style="display:none"></td>'+
        '<td><input id="ISBN"></td>' +
        '<td><input id="bookName"></td>' +
        '<td><input id="press"></td>'+
        '<td><input id="author"></td>' +
        '<td><input id="publishDate"></td>' +
        '<td>' +
            '<input type="button" class="confirm btn btn-mini" value="确定">' +
            '<input type="button" class="cancel btn btn-mini" value="取消">' +
        '</td>' +
        '</tr>';

    var table = $('.table');
    var k, h, a, g, f, l;

    table.delegate('.update', 'click', function () {
        var self = $(this).parent('td').parent('tr');
        //k = self.find('td:nth-child(1)').text();
        h = self.find('td:nth-child(2)').text();
        a = self.find('td:nth-child(3)').text();
        g = self.find('td:nth-child(4)').text();
        f = self.find('td:nth-child(5)').text();
        l = self.find('td:nth-child(6)').text();
        self.addClass('edit');
        //这边标签怎么没关闭，我刚才把input都删了，不对，正还原到一半呢
        //<td><input id="_id" value="' + k + '">
        var html = '<td style="display:none"><input style="display:none" id="_id" value="' + k + '" ></td><td><input id="ISBN" value="' + h + '"></td><td><input id="bookName" value="' + a + '"></td>' +
            '<td><input id="press" value="' + g + '"</td><td><input id="author" value="' + f + '"></td>' +
            '<td><input id="publishDate" value="' + l + '"></td>' +  
            '<td>' +
            '<input class="updateConfirm btn btn-mini" value="确定"  type="button">' +
            '<input class="updateCancel btn btn-mini" value="取消"  type="button">' +
            '</td>';

        self.html(html);
    });

    table.delegate('.updateConfirm', 'click', function () {
        var self = $(this).parent('td').parent('tr');
        $.ajax({
            type: 'get',
            url: '/bookdateUpdate',
            data: {//h = self.find('td:nth-child(2)').text();
                _id: $('#_id').val(),
                //_id: $('id').val(), 这就是你原来的，粗心呀
                ISBN: $('#ISBN').val(),
                bookName: $('#bookName').val(),
                press: $('#press').val(),
                author: $('#author').val(),
                publishDate: $('#publishDate').val()
            },
            success: function(data){
                var html = '<td style="display:none">' + $('#_id').val() + '</td><td>' + $('#ISBN').val() + '</td><td>' + $('#bookName').val() + '</td><td>' + $('#press').val() + '</td><td>' + $('#author').val() + '</td><td>' + $('#publishDate').val() + '</td>' +
                    '<td>' +
                    '<input class="update btn btn-mini" value="修改" type="button">' +
                    '<input class="remove btn btn-mini" value="删除" type="button">' +
                    '</td>';
                self.html(html);
                self.removeClass('edit');
                alert('Update Success!');
            },
            failure: function () {
                var html = '<td style="display:none">' + k + '</td><td >' + h + '</td><td>' + a + '</td><td>' + g + '</td><td>' + f + '</td><td>' + l + '</td>' +
                '<td>' +
                '<input class="update btn btn-mini" value="修改" type="button">' +
                '<input class="remove btn btn-mini" value="删除" type="button">' +
                '</td>';
                self.html(html);
                self.removeClass('edit');
                alert('Update Failure!');
            }
        });
    });
    table.delegate('.updateCancel', 'click', function () {
        var html = '<td style="display:none">' + k + '</td><td>' + h + '</td><td>' + a + '</td><td>' + g + '</td><td>' + f + '</td><td>' + l + '</td>' +
            '<td>' +
            '<input class="update btn btn-mini" value="修改" type="button">' +
            '<input class="remove btn btn-mini" value="删除" type="button">' +
            '</td>';
        var self = $(this).parent('td').parent('tr');
        self.html(html);
        self.removeClass('edit')
    });

    table.delegate('.remove', 'click', function () {
        var self = $(this).parent('td').parent('tr');
        h = self.find('td:nth-child(2)').text();        
        $.ajax({
            type: 'get',
            url: '/bookdateRemove',
            data: {
                ISBN:h//$('#_id').val()
            },
            success: function(data){
                alert('Remove Success!');
                self.remove();
            },
            failure: function (data) {
                alert('Remove Failure!');
            }
        });
    });

    table.delegate('.cancel', 'click', function () {
        $('tr.edit').remove();
    });

    table.delegate('.confirm', 'click', function () {
        var self = $(this).parent('td').parent('tr');
        //var _id = $('#_id').val();
        var ISBN = $('#ISBN').val();
        var bookName = $('#bookName').val();
        var press = $('#press').val();
        var author = $('#author').val();
        var publishDate = $('#publishDate').val();
        var html = '<td style="display:none">' + _id+ '</td><td>' + ISBN + '</td><td>' + bookName + '</td><td>' + press + '</td><td>' + author + '</td><td>' + publishDate +'</td>' +
            '<td>' +
            '<input class="update btn btn-mini" value="修改"  type="button">' +
            '<input class="remove btn btn-mini" value="删除"  type="button">' +
            '</td>';
        $.ajax({
            type: 'get',
            url: '/bookdateInsert',
            data: {
                //_id: _id,
            	ISBN:ISBN,
                bookName: bookName,
                press: press,
                author: author,
                publishDate: publishDate
            },
            success: function () {
                $('tr.edit').removeClass('edit').html(html);
            }
        });
    });

    $('.insert').click(function(){
        if ($('.edit').length === 0) {
            $('.table > tbody').append(editHtml);
            var obj = $(this).data('name');
        } else {
            alert('正在编辑中...');
            return;
        }
    });

});

