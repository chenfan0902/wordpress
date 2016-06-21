$(document).ready(function () {
//    var data = [];
    var host = null;
    var updateInterval = 60000,
        serve_sel = null,
        query_res = null,
        isServe = false;

    function getData() {
        $.ajax({
            type: 'GET',
            url: '/getRealQueueData',
            data: {

            },
            dataType: 'json',
            success: function(data) {
                console.log('data=>' + data);
                redraw(data.data);
            },
            error: function() {

            }
        });
    }

    function redraw(data) {

        var settings = {
            padding: { left: 5, top: 5, right: 5, bottom: 5 },
            titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
            source: data,
            showBorderLine: false,
            categoryAxis:
            {
                dataField: 'Time',
                showGridLines: true
            },
            colorScheme: 'scheme01',
            seriesGroups:
                [
                    {
                        type: 'line',
                        lineWidth: 1.5,
                        columnsGapPercent: 30,
                        seriesGapPercent: 0,
                        valueAxis:
                        {
//                            minValue: 0,
//                            maxValue: 120,
                            unitInterval: 20,
                            description: '队列积压数量'
                        },
                        series: [
                            { dataField: 'Queue1', displayText: 'Queue1'},
                            { dataField: 'Queue2', displayText: 'Queue2'},
                            { dataField: 'Queue3', displayText: 'Queue3'},
                            { dataField: 'Queue4', displayText: 'Queue4'},
                            { dataField: 'Queue5', displayText: 'Queue5'},
                            { dataField: 'Queue6', displayText: 'Queue6'},
                            { dataField: 'Queue7', displayText: 'Queue7'}
                        ]
                    }
                ]
        };

        $('#D').jqxChart(settings);
    }

    $("#qm_hosts_sel").change(function(){
        isServe = false;
        getRealData();
    });

    $('#qm_serve_sel').change(function(){
        getRealDataServe();
    });

    function getRealDataServe(){
        host = $('#qm_hosts_sel').children('option:selected').text() || '134.32.28.36';
        serve_sel= $('#qm_serve_sel').children('option:selected').text() || '全部显示';

        if(serve_sel == '全部显示'){
            isServe = false;
            $.ajax({
                type: 'GET',
                //url: '/getQueueDataReal',
                url: '/getHostQueueRealMR',
                data: {
                    date: $('#value').val(),
                    host: host
                },
                dataType: 'json',
                success: function(data) {
                    query_res = data;
                    var qLabel = data.queueLabels,
                        html = '<option>全部显示</option>';
                    for(var i=0; i<qLabel.length; i++){
                        html += '<option>'+ qLabel[i] +'</option>'
                    }
                    $('#qm_serve_sel').html(html);
                },
                error: function() {

                }
            });
        }else{
            isServe = true;
            $.ajax({
                type: 'GET',
                url: '/getHostQueueServe',
                data: {
                    date: $('#value').val(),
                    host: host,
                    name: serve_sel
                },
                dataType: 'json',
                success: function(data){
                    updateReal(data.data, [serve_sel, 'serve'], [serve_sel, 'serve']);
                },
                error: function(){
                }
            });
        }
    }

    function getRealData() {
        host = $('#qm_hosts_sel').children('option:selected').text() || '134.32.28.36';
        $.ajax({
            type: 'GET',
            //url: '/getQueueDataReal',
            url: '/getHostQueueRealMRBak',
            data: {
                date: $('#value').val(),
                host: host
            },
            dataType: 'json',
            success: function(data) {
                updateReal(data.data, data.queueFields, data.queueLabels);
            },
            error: function() {

            }
        });
    }

    function updateReal(data, queueFields, queueLabels) {

        var ds = [];
        for (var m = 0; m < queueLabels.length; m++) {
            ds.push({label: queueLabels[m], data: []});
        }

        for (var i = 0; i < data.length; i++) {
//            ds.push(data[i].value);
            for (var j = 0; j < queueLabels.length; j++) {
                ds[j].data.push([data[i].time, data[i].data[j]['1']]);
            }

        }

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: false
                }
            },
            legend: {
                noColumns: 2
            },
            xaxis: {
//                tickDecimals: 0
                mode: "time",
                tickSize: [60, "second"],
                tickFormatter: function (v, axis) {
                    var date = new Date(v);

                    if (date.getSeconds() % 6 == 0) {
                        var day = (date.getMonth()+1) + '-' + date.getDate();
                        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                        return hours + ':' + minutes;
                    } else {
                        return "";
                    }
                }
            },
            yaxis: {
//                min: 0
            }
        };

        var placeholder = $("#queue_monitor");

        var plot = $.plot(placeholder, ds, options);

    }

    function update() {
        isServe = false;
        if(isServe){
            getRealDataServe();
        }else{
            getRealData();
        }

        timeId = setTimeout(update, updateInterval);
    }

    update();
});