$(document).ready(function () {
//    var data = [];
    var host = null;
    var updateInterval = 60000,
        serve_sel = null,
        query_res = null,
        isServe = false,
        lastTime = 0,
        count = 0,
        pageSize = 10,
        curPage = 0,
        res = null,
        table = null,
        province = null;

    function init() {
        var prov = $('#itf_prov_sel');
        prov.val('11');
        province = prov.val();

        prov.change(function() {
            province = prov.val();
            if (province.length < 3)
                getData(province);
        });

        getData('11');
    }
    init();

    function getData(province) {

        $.ajax({
            type: 'GET',
            url: '/getIntfDataHis',
            data: {
                province: province
            },
            dataType: 'json',
            success: function(data) {
                // console.log(data);
                lastTime = data.data.lastTime;
                updateReal(data.data.records, data.data.labels);
                initTableData();
                table.fnDraw();
            },
            error: function() {

            }
        });
    }

    function updateReal(data, labels) {

        var ds = [];
        for (var m = 0; m < labels.length; m++) {
            ds.push({label: labels[m], data: []});
        }

        for (var ind in data) {
            var record = data[ind];
            ds[0].data.push([ind, record.called]);
            ds[1].data.push([ind, record.failed]);
        }

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
//                tickDecimals: 0
                mode: "time",
                tickSize: [300, "second"],
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

        var placeholder = $("#intf_monitor");


        var plot = $.plot(placeholder, ds, options);
    }

    function initTableDetail(rows) {
        $('#intf_5min_detail tbody').empty();
        var dom = '';
        for (var i = 0; i < rows.length; i++) {
            // if (i < (curPage-1)*10 || i >= curPage*10) continue;
            var row = rows[i];
            dom += '<tr><td>' + row.intfName + '</td>'
                + '<td>' + row.called + '</td>'
                + '<td>' + row.success + '</td>'
                + '<td>' + row.rate + '</td></tr>';
        }
        $('#intf_5min_detail tbody').append(dom);
        $('#intf_5min_detail').DataTable({
            "bProcessing": true,
            "bRetrieve":true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": false,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sSearch": "<span>接口名称过滤:</span> _INPUT_",
                "sLengthMenu": "<span>每页显示数:</span> _MENU_",
                "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
            },
            "fnDrawCallback": function () {

            }
        });
    }

    function initTableData() {
        table = $('#intf_5min_detail').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            // "sAjaxSource": url,
            "sAjaxSource": '/get5minDetailData',
            "fnServerParams": function ( aoData ) {
                aoData.push( { "name": "lastTime", "value": lastTime } );
                aoData.push( { "name": "province", "value": province } )
            },
            "aoColumns": [
                { "mData": "intfName" },
                { "mData": "called" },
                { "mData": "success", sClass: 'text-right' },
                { "mData": "rate1", sClass: 'text-right' }
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

        $("#intf_5min_detail tbody").delegate("tr", "dblclick", function() {
            var server = $("td:first", this).text();
            var queue = $("td:eq(1)", this).text();
            var sug = $('td:eq(10)', this).text();
        });
    }

    function initDataTableDetail(rows) {
        // console.log(rows.length)
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var tmp = [];
            tmp.push(row.intfName);
            tmp.push(row.called);
            tmp.push(row.success);
            tmp.push(row.rate);
            arr.push(tmp);
        }

        // console.log(arr)

        $('#intf_5min_detail').DataTable({
            "data": arr,
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource":'/getTableDetailData',
            "sServerMethod": "GET",
            "bRetrieve":true,
            "bJQueryUI": false,
            "bAutoWidth": false,
            "bSort": false,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sSearch": "<span>接口名称过滤:</span> _INPUT_",
                "sLengthMenu": "<span>每页显示数:</span> _MENU_",
                "oPaginate": { "sFirst": "首页", "sLast": "末页", "sNext": ">", "sPrevious": "<" },
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录"
            },
            "fnDrawCallback": function () {

            }
        })
    }

    function initTableFoot(len) {
        $('#intf_tab_foot li').unbind('click');
        $('#intf_tab_foot').empty();
        if (len == 0) {
            $('#intf_tab_foot').append('<li><a>Prev</a></li><li><a>Next</a></li>');
            return;
        }

        var dom = '<li><a>Prev</a></li>';
        var cnt = Math.ceil(len/10);
        for (var i = 0; i < cnt; i++) {
            dom += '<li id="itf_li_' + i + '"><a>' + (i+1) + '</a></li>';
        }
        dom += '<li><a>Next</a></li>';
        $('#intf_tab_foot').append(dom);
        $('#intf_tab_foot li').bind('click', function(e) {
            var txt = $(this).text();
            switch(txt) {
                case 'Prev':
                    curPage -= 1;
                    if (curPage <= 0) {
                        curPage = 1;
                        return;
                    }
                    break;
                case 'Next':
                    curPage += 1;
                    if (curPage > count) {
                        curPage = count;
                        return;
                    }
                    break;
                default:
                    curPage = txt;
                    break;
            }
            initTableDetail(res);
            // $('#intf_tab_foot li[id!="itf_li_' + (curPage-1) + '"]').removeClass('active');
            // $('#intf_tab_foot li[id="itf_li_' + (curPage-1) + '"]').addClass('active');
        })

        curPage = 1;
        count = len;
        $('#intf_tab_foot li[id="itf_li_0"]').addClass('active');
    }

    function updateTableDetail(lt) {
        $.ajax({
            type: 'GET',
            url: '/get5minDetailIntf',
            data: {
                province: $('#itf_prov_sel').val(),
                lastTime: lt,
                pageSize: 10,
                pageNum: 1
            },
            dataType: 'json',
            success: function(data) {
                // console.log(data);
                res = data.data;

                res.sort(function(r1, r2) {
                    // return r1.rate - r2.rate;
                    if (r1.rate < r2.rate) return -1;
                    else if (r1.rate == r2.rate) return r2.called - r1.called;
                    else return 1;
                })

                // initTableFoot(res.length);
                // initTableDetail(res);
                // initDataTableDetail(res);
                // initTableData();
            },
            error: function() {

            }
        });

    }

    function retrieveData( sSource111,aoData111, fnCallback111) {
        console.log('retrieveData...')
        $.ajax({
            url : '/get5minDetailIntf',//这个就是请求地址对应sAjaxSource
            data : {
                // "aoData":JSON.stringify(aoData111)
                province: $('#itf_prov_sel').val(),
                lastTime: lastTime
            },//这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
            type : 'get',
            dataType : 'json',
            async : false,
            success : function(result) {
                fnCallback111(result);//把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
            },
            error : function(msg) {
            }
        });
    }
});