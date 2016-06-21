/*
var gauge = function(params) {

    $('#' + params.id).jqxGauge({
        ranges: [{
            startValue: 0,
            endValue: params.endValue1,
            style: { fill: '#52ac52', stroke: '#52ac52' },
            endWidth: 5,
            startWidth: 1
        }, {
            startValue: params.endValue1,
            endValue: params.endValue2,
            style: { fill: '#feeb31', stroke: '#feeb31' },
            endWidth: 10,
            startWidth: 5
        }, {
            startValue: params.endValue2,
            endValue: params.endValue3,
            style: { fill: '#d03e3e', stroke: '#d03e3e' },
            endWidth: 15,
            startWidth: 10
        }],
        ticksMinor: { interval: 5, size: '5%' },
        ticksMajor: { interval: 10, size: '9%' },
        value: 0,
        min: 0,
        max: 180,
        labels: {
            interval: 20
        },
        colorScheme: 'scheme05',
        animationDuration: 1200,
        width: '100%',
        height: '100%'
    });

    $('#' + params.id).jqxGauge({
        value: params.value
    });
};

$(function() {
    gauge({
        id: 'cpu_monitor',
        endValue1: 60,
        endValue2: 120,
        endValue3: 180,
        value: 33
    });

    gauge({
        id: 'memory_monitor',
        endValue1: 60,
        endValue2: 120,
        endValue3: 180,
        value: 88
    });

    gauge({
        id: 'disk_monitor',
        endValue1: 60,
        endValue2: 120,
        endValue3: 180,
        value: 144
    });
});*/

$(function () {
    // we use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [],
        totalPoints = 10,
        host = null,
        table = null;
    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);

        // do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 20;
            var y = prev + Math.random() * 10 - 5;
            if (y < 0)
                y = 0;
            if (y > 50)
                y = 50;
            data.push(y);
        }

        // zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i)
            res.push([i, data[i]])

        return res;
    }

    //绘制详细表数据
    function initTable() {

        host = (!host || host == '') ? $('#mm_serv li:first').text() : host;

        table = $('#mm_table').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": '/memoryMonitorDayPage',
            "fnServerParams": function ( aoData ) {
                aoData.push( { "name": "value", "value": $('#datepicker').val() } );
                aoData.push( { "name": "host", "value": host } )
                aoData.push( { "name": "chartList", "value": $('#mm_chart_list').text() } );
            },
            "aoColumns": [
                { "mData": "pid" },
                { "mData": "name" },
                { "mData": "time", sClass: 'text-right' },
                { "mData": "size", sClass: 'text-right' },
                { "mData": "timestamp", sClass: 'text-right' }
            ],
            "bRetrieve":true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": false,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sSearch": "<span>关键字过滤:</span> _INPUT_",
                "sLengthMenu": "<span>每页显示数:</span> _MENU_",
                "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
            }
        });

        initServ();
    }

    //服务器选择事件
    function initServ() {

        $('#mm_serv').delegate('li', 'click', function() {
            host = $(this).text();

            table.fnDraw();
        });
    }

    // setup control widget
    var updateInterval = 6000;
    $("#updateInterval").val(updateInterval).change(function () {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1)
                updateInterval = 1;
            if (updateInterval > 2000)
                updateInterval = 2000;
            $(this).val("" + updateInterval);
        }
    });

    // setup plot
    var options = {
        yaxis: { /*min: 0, max: 500*/ },
        xaxis: {
            mode: "time",
            tickSize: [30, "second"],
            tickFormatter: function (v, axis) {
                var date = new Date(v);

                if (date.getSeconds() % 6 == 0) {
                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                    return minutes + ":" + seconds;
                } else {
                    return "";
                }
            }
        },
        colors: ["#f0471a"],
        grid: { hoverable: true, clickable: true },
        series: {
            lines: {
                lineWidth: 1.5,
                fill: true,
                fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] },
                show: true
            },
            points: {
                show: true,
                radius: 2.5,
                fill: true,
                fillColor: "#ffffff",
                symbol: "circle",
                lineWidth: 1.1
            }
        }
    };
//    var plot = $.plot($("#cpu_monitor"), [ getRandomData() ], options);

    function getData() {
        if(null == host){
            host = '134.32.10.61';
        }
        $.ajax({
            type: 'GET',
            url: '/queryMemory',
            data: {
                chartList: $('#mm_chart_list')[0].innerText,
                date: $('#datepicker').val(),
                host: host
            },
            dataType: 'json',
            success: function(data) {
//                console.log(data.data);
                initData(data.data,  data.cols);
            },
            error: function() {

            }
        });
    }

    function initData(rows, cols) {

        var cdata = [],
            mdata = [],
            ds = [],
            cnum = 0,
            mnum = 0,
//            no = 0,
            tt = 0;

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];

            if (tt <= 0) {
                tt = row.timestamp;
            }

            cnum += (row.size/1024);//cpu ==> size
            mnum += (row.size/1024);//memory ==> size

//            no = row.time;

            if (tt == row.timestamp) {
                ds.push(row);
            } else {
                cdata.push([tt, cnum]);
                mdata.push([tt, mnum]);
//                console.log(tt, ' ', cnum);
//                no++;
                cnum = 0;
                mnum = 0;
                tt = row.timestamp;
                ds = [];
                ds.push(row);
            }

            if (i == rows.length - 1) {
                cdata.push([tt, cnum]);
                mdata.push([tt, mnum]);
//                console.log(tt, ' ', cnum);

                drawCpu(cdata);
                drawMemory(mdata);
                initTable();
                //drawDetail(ds, cols);
            }
        }
    }

    function drawCpu(data) {
        //[ [[1, 5], [2, 10], [3, 15], [4, 20], [5, 5], [6, 10], [7, 15], [8, 20]]]
        $.plot($("#cpu_monitor"), [data], options);
    }

    function drawMemory(data) {

        $.plot($("#memory_monitor"), [data], options);
    }

    function drawDetail(ds, cols) {
        $('#po_detail tr td').remove();

        for (var i = 0; i < ds.length; i++) {
            var row = ds[i];
            /*var xml = '<tr>'
                + '<td>' + row.processId + '</td>'
                + '<td>' + row.user + '</td>'
                + '<td>' + row.time + '</td>'
                + '<td>' + row.cpu + '</td>'
                + '<td>' + row.memory + '</td>'
                + '</tr>';*/
            var xml = '<tr>';
            for(var j = 0; j < cols.length; j++) {
                xml += '<td>' + row[cols[j]] + '</td>';
            }
            xml += '</tr>';
            $('#po_detail tbody tr:last').after(xml);
        }
    }

    function update() {
//        console.log([ getRandomData() ]);
//        plot.setData([ getRandomData() ]);
        // since the axes don't change, we don't need to call plot.setupGrid()
//        plot.draw();

        getData();

        timeId = setTimeout(update, updateInterval);
    }

    update();
});