$(function() {

    var host = null;

    $('#qr_serv').change(function(){
        updateTable();
    });

    function updateTable(){

        host = $('#qr_serv option:selected').text() || '134.32.28.36';
        $.ajax({
            type: 'get',
            url: '/getReportQueueDataBy4Days',
            data: {
                date: $('#value').val(),
                host: host
            },
            success: function(rows) {
                var html = '';
                for(var i=0; i<rows.length; i++){
                    if( i%2 == 0 ) {
                        html += '<tr class="odd">';
                    }else {
                        html += '<tr class="even">';
                    }
                    html += '<td style="text-align: center">'+rows[i]['name'] + '`' + rows[i]['queue'] +'</td>';
                    html += '<td style="text-align: center">'+rows[i]['serve']+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['28max']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['28sug']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['28size']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['31max']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['31sug']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['31size']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['02max']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['02sug']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['02size']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['03max']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['03sug']||'-')+'</td>';
                    html += '<td style="text-align: center">'+(rows[i]['03size']||'-')+'</td>';
                }
                $('#qra_table > tbody').html(html);
            }
        });
    }

    updateTable();
})