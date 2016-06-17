/**
 * Created with JetBrains WebStorm.
 * User: Jacky
 * Date: 14-4-14
 * Time: 下午2:41
 * To change this template use File | Settings | File Templates.
 */
$(function () {
    // we use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [], totalPoints = 100, isInit = false, lastTime = 0, detail = [], cols = [];

    function getData() {

        $.ajax({
            type: 'get',
            url: '/getOverstockData',
            data: {
                isInit: isInit,
                chartList: $('#os_chart_list')[0].innerText
            },
            dataType: 'json',
            success: function(res) {
//                console.log('data=>' + res.data);
//                console.log('detail=>' + res.detail.length);
                //console.log(data.data.length);
                //plot.setData(data.data);

                var result = res.data;
                data = result;
                detail = res.detail;
                cols = res.cols;

                redraw(result);
                queryDetail(detail, cols);
            },
            error: function() {

            }
        })
    }

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
        //yaxis: { min: 0, max: 350 },
        //xaxis: { min: 0, max: 100, tickLength: 0 },
        yaxis: {
            min: 0
        },
        xaxis: {
            //tickDecimals: 0
            mode: "time",
            tickSize: [60, "second"],
//            tickSize: [1],
            tickFormatter: function (v, axis) {
//                return v;
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
        }/*,
        legend: {
            noColumns: 2
        },
        selection: {
            mode: 'x'
        }*/
    };

    //var plot = $.plot($("#updating"), [ getRandomData() ], options);
    console.log('updating data=>' + data);
    //var plot = $.plot($("#updating"), [[]], options);
    console.log('os_chart_list=>' + $('#os_chart_list')[0].innerText);


    var updating = $("#updating");
    var plot = $.plot(updating, [], options);

    updating.bind("plotselected", function (event, ranges) {

        console.log('ranges=>' + ranges);

        //$("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));

        $.each(plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.min = ranges.xaxis.from;
            opts.max = ranges.xaxis.to;
        });
        plot.setupGrid();
        plot.draw();
        plot.clearSelection();
    });

    updating.bind("plotunselected", function (event) {
        //$("#selection").text("");
    });

    function redraw(ds) {

        plot = $.plot(updating, [ds], options);

//        var plot = $.plot(updating, [ds], options);
//        plot.setData([ds]);
//        plot.draw();

        //queryDetail();
    }

    function queryDetail(ds, cols) {
//        console.log(ds);
//        console.log('current date=>' + $('#datepicker').val());

        $('#os_detail tr td').remove();

        for (var i = 0; i < ds.length; i++) {
            var row = ds[i];
            /*var xml = '<tr>'
                    + '<td>' + row.time + '</td>'
                    + '<td>' + row.orderTypeName + '</td>'
                    + '<td>' + row.orderTypeCode + '</td>'
                    + '<td>' + row.count + '</td>'
                    + '</tr>';*/
            var xml = '<tr>';
            for (var j = 0; j < cols.length; j++) {
                xml += '<td>' + row[cols[j]] + ' </td>';
            }
            xml += '</tr>';
            $('#os_detail tbody tr:last').after(xml);
        }
    }

    function getDataGroup() {

        $.ajax({
            type: 'get',
            url: '/other/overStock/getOverstockGroup',
            data: {
                isInit: isInit
            },
            dataType: 'json',
            success: function(res) {
//                console.log('data=>' + res.data);
//                console.log('detail=>' + res.detail.length);
                //console.log(data.data.length);
                //plot.setData(data.data);

                var result = res.data;
                data = result;
                //detail = res.detail;

                redraw(result);
//                test();
                //queryDetail(detail);
            },
            error: function() {

            }
        })
    }

    function test() {
        var data = [{
            label: "United States",
            data: [[1990, 18.9], [1991, 18.7], [1992, 18.4], [1993, 19.3], [1994, 19.5], [1995, 19.3], [1996, 19.4], [1997, 20.2], [1998, 19.8], [1999, 19.9], [2000, 20.4], [2001, 20.1], [2002, 20.0], [2003, 19.8], [2004, 20.4]]
        }, {
            label: "Russia",
            data: [[1992, 13.4], [1993, 12.2], [1994, 10.6], [1995, 10.2], [1996, 10.1], [1997, 9.7], [1998, 9.5], [1999, 9.7], [2000, 9.9], [2001, 9.9], [2002, 9.9], [2003, 10.3], [2004, 10.5]]
        }, {
            label: "United Kingdom",
            data: [[1990, 10.0], [1991, 11.3], [1992, 9.9], [1993, 9.6], [1994, 9.5], [1995, 9.5], [1996, 9.9], [1997, 9.3], [1998, 9.2], [1999, 9.2], [2000, 9.5], [2001, 9.6], [2002, 9.3], [2003, 9.4], [2004, 9.79]]
        }, {
            label: "Germany",
            data: [[1990, 12.4], [1991, 11.2], [1992, 10.8], [1993, 10.5], [1994, 10.4], [1995, 10.2], [1996, 10.5], [1997, 10.2], [1998, 10.1], [1999, 9.6], [2000, 9.7], [2001, 10.0], [2002, 9.7], [2003, 9.8], [2004, 9.79]]
        }, {
            label: "Denmark",
            data: [[1990, 9.7], [1991, 12.1], [1992, 10.3], [1993, 11.3], [1994, 11.7], [1995, 10.6], [1996, 12.8], [1997, 10.8], [1998, 10.3], [1999, 9.4], [2000, 8.7], [2001, 9.0], [2002, 8.9], [2003, 10.1], [2004, 9.80]]
        }, {
            label: "Sweden",
            data: [[1990, 5.8], [1991, 6.0], [1992, 5.9], [1993, 5.5], [1994, 5.7], [1995, 5.3], [1996, 6.1], [1997, 5.4], [1998, 5.4], [1999, 5.1], [2000, 5.2], [2001, 5.4], [2002, 6.2], [2003, 5.9], [2004, 5.89]]
        }, {
            label: "Norway",
            data: [[1990, 8.3], [1991, 8.3], [1992, 7.8], [1993, 8.3], [1994, 8.4], [1995, 5.9], [1996, 6.4], [1997, 6.7], [1998, 6.9], [1999, 7.6], [2000, 7.4], [2001, 8.1], [2002, 12.5], [2003, 9.9], [2004, 19.0]]
        }];

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            legend: {
                noColumns: 2
            },
            xaxis: {
                tickDecimals: 0
            },
            yaxis: {
                min: 0
            },
            selection: {
                mode: "x"
            }
        };

        var placeholder = $("#updating");

        placeholder.bind("plotselected", function (event, ranges) {
            console.log('plotselected...');

//            $("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));
//
//            var zoom = $("#zoom").prop("checked");
//
//            if (zoom) {
                $.each(plot.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                plot.setupGrid();
                plot.draw();
                plot.clearSelection();
//            }
        });

        placeholder.bind("plotunselected", function (event) {
//            $("#selection").text("");
        });

        var plot = $.plot(placeholder, data, options);

//        $("#clearSelection").click(function () {
//            plot.clearSelection();
//        });
//
//        $("#setSelection").click(function () {
//            plot.setSelection({
//                xaxis: {
//                    from: 1994,
//                    to: 1995
//                }
//            });
//        });

        // Add the Flot version string to the footer

//        $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
    }

    function update() {
        getData();
//        console.log('cdate=>' + $('#datepicker').val());

//        getDataGroup();
        //console.log('set data=>' + data);
        //plot.setData([data]);
        //console.log('getRandomData()=>' + getRandomData());
        //plot.setData([ getRandomData() ]);
        // since the axes don't change, we don't need to call plot.setupGrid()
        //plot.draw();

//        console.log('updateInterval=>' + updateInterval);
        timeId = setTimeout(update, updateInterval);
    }

    update();


});