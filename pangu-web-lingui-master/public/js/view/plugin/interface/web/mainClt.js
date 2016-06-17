$(function(){
    $('#interface_operate').change(function(){
        updateTable();
    });
    $('#interface_service').change(function(){
        getOperate();
    });

    function initChartData (failure, success, rows) {
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
            {label: '失败', data: failure},
            {label: '成功', data: success}
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

        var _operate = $('#interface_operate option:selected').text() || 'all',
            _service = $('#interface_service option:selected').text() || 'all',
            host = $('#hostMonitor').val();
        $.ajax({
            type: 'get',
            url: '/getInterfaceWEBData',
            data: {
                date: $('#value').val() || '2015-05-19',
                host: host,
                _operate: _operate,
                _service: _service,
                chartList: $('#chartList').val() || 'alarmWS3GESSGroupList',
                chartCList: $('#chartCList').val() || 'alarmWS3GESSCalledSumList'
            },
            success: function(data) {
                var html = '',
                    total = data.count,
                    success = data.success,
                    failure = data.failure,
                    rows = data.results,
                    colName = data.tabColName;
                if( rows.length == 0){
                    $('#_total').hide();
                    return;
                }else{
                    $('#_total').show();
                }
                $('#TradeTotal').html('<strong>' + total + '</strong>');
                $('#TradeSuccess').html('<strong>' + success + '</strong>');
                $('#TradeFailure').html('<strong>' + failure + '</strong>');
                $('#TradeFailureRate').html('<strong>' + (failure / total * 100).toFixed(2) + '%</strong>');
                html += '<tr>';
                for(var i=0; i<colName.length; i++){
                    html += '<th style="text-align: center">' + colName[i] + '</th>';
                }
                html += '</tr>';
                $('#interface_table > thead').html(html);
                html = '';
                for(var i=0; i<rows.length; i++){
                    if( i%2 == 0 ) {
                        html += '<tr class="odd">';
                    }else {
                        html += '<tr class="even">';
                    }
                    html += '<td style="text-align: left">' + rows[i]['servicename'] + '</td>';
                    html += '<td style="text-align: left">' + rows[i]['operatename'] + '</td>';
                    html += '<td style="text-align: center">' + rows[i]['rspcode'] + '</td>';
                    html += '<td style="text-align: center">'+rows[i]['count']+'</td>';
                    html += '<td style="text-align: center">' + (rows[i]['count']/total*100).toFixed(3) + '</td>';

                }
                $('#interface_table > tbody').html(html);
                initChartData(data['failure'], data['success'], data['relDocs']);
            }
        });
    }

    function getService(){
        $.ajax({
            type: 'get',
            url: '/getInterfaceWEBService',
            data: {
                date: $('#value').val() || '2015-05-19',
                host: $('#hostMonitor').val() || 'all',
                chartList: $('#chartList').val() || 'alarmWS3GESSGroupList'
            },
            success: function(rows) {
                var html = "<option>all</option>";
                for(var idx=0; idx<rows.length; idx++){
                    html += "<option>" + rows[idx] + "</option>"
                }
                $('#interface_service').html(html);
                getOperate();
            }
        });
    }

    function getOperate(){
        $.ajax({
            type: 'get',
            url: '/getInterfaceWEBOperate',
            data: {
                date: $('#value').val() || '2015-05-19',
                host: $('#hostMonitor').val() || 'all',
                chartCList: $('#chartList').val() || 'alarmWS3GESSCalledSumList',
                _service: $('#interface_service option:selected').text() || 'ESSTermSer'
            },
            success: function(rows) {
                var html = "<option>all</option>";
                for(var idx=0; idx<rows.length; idx++){
                    html += "<option>" + rows[idx] + "</option>"
                }
                $('#interface_operate').html(html);
                updateTable();
            }
        });
    }

    getService();
});
