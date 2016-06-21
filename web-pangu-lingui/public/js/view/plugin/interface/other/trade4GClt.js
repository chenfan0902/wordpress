$(function(){
    var _operate = null,
        type = null,
        host = null;
    $('#trade4g_operate').change(function(){
        updateTable();
    });
    $('#trade4g_type').change(function(){
        updateTable();
    });
    $('#trade4g_host').change(function(){
        updateTable();
    });

    function initChartData (data) {
        var rows = [];
        for(var i=0; i<data.results.length; i++){
            if( 'CODE' == type ) {
                rows.push({label: (data.results[i].REQUSET_CODE.split(' '))[0], data: data.results[i].count});
            }else{
                rows.push({ label: data.results[i].REQUSET_DESC.substr(0,7) + '...', data: data.results[i].count });
            }
        }
        $.plot($("#bingtu"), rows,{
                series: {
                    pie: {
                        show: true,
                        tilt: 0.6,
                        combine: {
                            color: '#999',
                            threshold: 0.05
                        }
                    }
                },
                legend: {
                    show: false
                }
        });
        $.plot($("#total"), [
            {label: '失败', data: data['failure']},
            {label: '成功', data: data['success']}
        ],{
            series: {
                pie: {
                    show: true,
                    tilt: 0.7
                }
            },
            legend: {
                show: false
            }
        });

    };

    function updateTable(){

        _operate = $('#trade4g_operate option:selected').text() || 'all';
        type = $('#trade4g_type option:selected').text() || 'CODE';
        if( type.length > 4 ){
            type = type.substr(8);
        }
        host = $('#trade4g_host option:selected').text() || '134.32.28.127';
        $.ajax({
            type: 'get',
            url: '/getTrade4GData',
            data: {
                date: $('#value').val() || '2015-02-10',
                host: host,
                _operate: _operate,
                type: type

            },
            success: function(data) {
                var html = '',
                    total = data.total,
                    rows = data.results,
                    colName = data.tabColName;
                if( rows.length == 0){
                    $('#_total').hide();
                    return;
                }else{
                    $('#_total').show();
                }
                $('#TradeTotal').html('<strong>' + data['count'] + '</strong>');
                $('#TradeSuccess').html('<strong>' + data['success'] + '</strong>');
                $('#TradeFailure').html('<strong>' + data['failure'] + '</strong>');
                $('#TradeFailureRate').html('<strong>' + (data['failure'] / data['count'] * 100).toFixed(2) + '%</strong>');
                html += '<tr>';
                for(var i=0; i<colName.length; i++){
                    html += '<th style="text-align: center">' + colName[i] + '</th>';
                }
                html += '</tr>';
                $('#trade4g_table > thead').html(html);
                html = '';
                for(var i=0; i<rows.length; i++){
                    if( i%2 == 0 ) {
                        html += '<tr class="odd">';
                    }else {
                        html += '<tr class="even">';
                    }
                    if('CODE' == type) {
                        html += '<td style="text-align: left; padding-left: 8%" width="45%">' + rows[i]['REQUSET_CODE'] + '</td>';
                    }else{
                        html += '<td style="text-align: left; padding-left: 8%" width="45%">' + rows[i]['REQUSET_DESC'] + '</td>';
                    }
                    html += '<td style="text-align: center">'+rows[i]['count']+'</td>';
                    html += '<td style="text-align: center">' + (rows[i]['count']/total*100).toFixed(3) + '</td>';

                }
                $('#trade4g_table > tbody').html(html);
                initChartData(data);
            }
        });
    }

    updateTable();
});
