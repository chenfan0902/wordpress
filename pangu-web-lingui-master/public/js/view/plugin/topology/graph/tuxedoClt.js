$(function(){
    // 全屏显示
    $('body').toggleClass('clean');
    $('#sidebar').toggleClass('hide-sidebar mobile-sidebar');
    $('#content').toggleClass('full-content');
    $('#content > .wrapper').toggleClass('hide-wrapper');
    $('.navigation.widget').toggleClass("hide");

    var tuxedoInterval = 60 * 1000;
    var warnInterval = 10 * 1000;
    var root, bakdata = {};
    var warnTuxedoQue = {};
    var intfWarningQueLen = 0;
    var cConfig = JSON.parse($('#cConfig').text());
    var width = cConfig.width || getNtgWidth();
    var height = cConfig.height || 598;
    var lcuTable = null;
    var warnTable = null;
    var lcuQueryurl = $('#lcuQueryUrl').val();
    var warnQueryurl = $('#warnQueryUrl').val();
    var type;
    var noInfo = '<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">No matching records found</td></tr>';
    //默认滚动速度
    var speedTrade = 30;
    var speedRegion = 30;
    var speedWarning = 20;

    var force = d3.layout.force()
        //.gravity(.1)
        //.distance(100)
        .linkDistance(function(d) {return (d.source.type === 1 && 80) || (d.source.type === 2 && 60) || 45 })
        .charge(-500)
        .size([width, height])
        .on('tick', tick);

    var svg = d3.select('#topology').insert('svg', '.msgWarningInfo')
        .attr('width', width)
        .attr('height', height);

    var tooltip = d3.select('#tooltip-topology');

    var link = svg.selectAll('.link'),
        node = svg.selectAll('.node');

    $.ajax({
        type: 'get',
        url: '/getNTGNodes',
        data: {
            chartList: $('#chartList').val()
        },
        success: function(data){
            root = data;
            $.extend(bakdata, data);
            changeState();
            changeDataInfo();
        }
    });

    $('.fullview').click(function(){
        if($('#topology > svg').css('display') === 'none'){
            $('.ntg-balloon-group').css('display', 'block');
            $('#topology > svg').css('display', 'block');
            $('#topology > .msgWarningInfo').css('display', 'block');
        }else{
            $('.ntg-balloon-group').css('display', 'none');
            $('#topology > svg').css('display', 'none');
            $('#topology > .msgWarningInfo').css('display', 'none');
        }
    });

    function getNtgWidth(){
        if($(window).width() <= 1001){
            return $(window).width();
        }
        var tmp = $(window).width() - $('.ntg-side-left').width() - $('.ntg-side-right').width() - 43;
        tmp <=0 && (tmp = $(window).width() - 615);
        return tmp;
    }

    function changeDataInfo(){
        typeof tuxedoChangeInfo !== 'undefined' && clearTimeout(tuxedoChangeInfo);
        $.ajax({
            type: 'get',
            url: '/getTuxedoTradeRegionData',
            data: {
                date: $('#value').val(),
                chartList: $('#chartList').val(),
                type: $('input[name="tuxedo-radio"]:checked').val()
            },
            success: function(data){
                updateData(data);
            }
        });

        tuxedoChangeInfo = setTimeout(changeDataInfo, tuxedoInterval);
    }

    function update() {
        svg.attr('width', getNtgWidth());
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        force
            .nodes(nodes)
            .links(links)
            .start();

        link = link.data(links, function(d) {return d.target.id; });
        link.exit().remove();

        link.enter().insert("line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node = node.data(nodes, function(d) { return d.id; });

        node.exit().remove();

        var nodeEnter = node.enter().append('svg:g')
            .attr('class', 'node')
            .on('click', function(d){ return d.switch !== false && click(d); })
            .on('mouseover', function (d) {
                hideTooltip();
                if(d.hover === false){
                    return;
                }
                var host = '';
                if(d.type === 4 && d.u !== undefined){
                    host = d.parentName + '_' + d.u;
                }else if(d.type === 4 && d.u === undefined){
                    host = d.parentName;
                }else{
                    var tmpC = d.children && d.children || d._children;
                    tmpC.forEach(function(item){
                        if(item.u !== undefined){
                            host += '`' + d.name + '_' + item.u;
                        }else{
                            host += '`' + d.name;
                        }
                    });
                    host = host.substring(1);
                }
                $.ajax({
                    type: 'get',
                    url: '/getStatDataByHost',
                    data: {
                        date: $('#value').val() || '2015-5-25',
                        host: host || '130.10.8.23'
                    },
                    success: function (docs) {
                        showTooltipKeys(d, docs);
                    }
                });
            })
            .on('mouseout', hideTooltip)
            .call(force.drag);

        nodeEnter.append('svg:image')
            .attr('class', 'nodeimg')
            .attr('xlink:href', function(d){
                return (d.type === 1 && '/img/ntg/ntg-cloud.png') || (d.type ===2 && '/img/ntg/ntg-switch.png')||
                    ((d.state === undefined&&d.type ===3) && '/img/ntg/ntg-hostMonitor-normal.png') ||
                    ((d.state === 0&&d.type ===3) && '/img/ntg/ntg-hostMonitor-error.png') ||
                    ((d.state === undefined&&d.type ===4) && '/img/ntg/ntg-user-normal.png') ||
                    ((d.state === 0&&d.type ===4) && '/img/icons/ntg-warning.gif') ||
                    ((d.state === 1&&d.type ===3) && '/img/ntg/ntg-hostMonitor-normal.png') ||
                    ((d.state === 1&&d.type ===4) && '/img/ntg/ntg-user-normal.png') ||
                    ((d.state === 2&&d.type ===3) && '/img/ntg/ntg-hostMonitor-warning.png') ||
                    ((d.state === 2&&d.type ===4) && '/img/ntg/ntg-user-warning.png') ||
                    'img/icons/ntg-switch.png';
            })
            .on('mouseover', function (d) {
                return false;
            })
            .on('mouseout', function (d) {
                return false;
            })
            .attr('x', function(d){
                return (d.type === 1 && '-50px') || (d.type ===2&&'-8px') ||(d.type ===3&&'-24px') || '-16px';
            })
            .attr('y', function(d){
                return (d.type === 1 && '-50px') || (d.type ===2&&'-8px') ||(d.type === 3&&'-24px') || '-16px';
            })
            .attr('width', function(d){
                return (d.type === 1 && '100px') || (d.type ===2&&'16px') ||(d.type ===3&&'48px') || '32px';
            })
            .attr('height', function(d){
                return (d.type === 1 && '100px') || (d.type ===2&&'16px') ||(d.type ===3&&'48px') || '32px';
            });

        nodeEnter.append('svg:text')
            .attr('class', 'nodetext')
            .on('mouseover', function (d) {
                return false;
            })
            .on('mouseout', function (d) {
                return false;
            })
            .attr('dx', function(d){
                return (d.type===1&& '-30px') ||(d.type===1 && '-30px') || -20;
            })
            .attr('dy', function(d){
                return (d.type===1&& '0') || -10;
            })
            .text(function(d) { return d.name; });
    }

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function click(d) {
        if(d.type === 4){
            $('#data-table-lcu > tbody').html(noInfo);
            $('#data-table-warning > tbody').html(noInfo);
            $('.chart-tooltip').remove();
            //console.log(d);
            var host;
            if(d.u !== undefined) {
                host = d.parentName + '_' + d.u;
            }else{
                host = d.parentName;
            }
            //var url = queryurl + '&hostMonitor=' + hostMonitor;
            var lcuurl = lcuQueryurl + '&hostMonitor=' + host + '&date=' + $('#value').val();
            var warnurl = warnQueryurl + '&hostMonitor=' + host + '&date=' + $('#value').val();
            $('#ntg_dialog_content_title').text(host);
            $('#ntg_dialog').fadeIn('slow');
            $('#ntg_dialog_content').addClass('active');
            $('#tab4').addClass('active');
            if(warnTable === null){
                initWarnDataTable(warnurl);
            }else {
                warnTable.fnSettings().sAjaxSource = warnurl;
                warnTable.fnDraw();
            }
            if(lcuTable === null){
                initLcuDataTable(lcuurl);
            }else {
                lcuTable.fnSettings().sAjaxSource = lcuurl;
                lcuTable.fnDraw();
            }
            return;
        }
        if(d.children){
            d._children = d.children;
            d.children = null;
        }else{
            d.children = d._children;
            d._children = null;
        }
        update();

    }

    function flatten(root) {
        var nodes = [];

        function recurse(node) {
            if (node.children) {
                node.children.forEach(recurse);
            }
            nodes.push(node);
        }
        recurse(root);
        return nodes;
    }

    function showTooltip(x, y, contents) {
        var rootElt = 'body';
        $('<div class="chart-tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y - 45,
            left: x - 8,
            'z-index': '9999',
            'color': '#fff',
            'font-size': '11px',
            opacity: 0.8
        }).prependTo(rootElt).show();
    }
    function showTooltipKeys(d, docs) {
        $('.chart-tooltip').remove();
        var w = $('.ntg-side-left').width() || 0;
        var h = 0;
        if($('.ntg-side-left').css('display') === 'none'){
            w = -15;
            h = -5;
        }
        var host;
        var usrname = '';
        var content = '';
        var note = '<b style="color: #000000">单击查看详细信息...</b>';
        if(d.type === 3){
            var tmpC = d.children || d._children;
            tmpC.forEach(function(item, idx){
                usrname += " | " + item.name;
                if(item.content !== undefined){
                    content += item.content + '</br>';
                }
            });
            usrname += " | ";
            host = d.name;
        }else{
            usrname = d.name;
            host = d.parentName;
            content = d.content && d.content + '</br>';
        }
        var rateSuccess = ((docs.CallCnt - docs.FailCnt)*100/docs.CallCnt).toFixed(2) + "%";
        var html = '主机IP&emsp;&emsp;&emsp;&emsp;:&emsp;<b>' + host + '</b></br>';
        html += '用户&emsp;&emsp;&emsp;&emsp;&emsp;:&emsp;' + usrname + '</br>';
        html += '当日调用总量&emsp;:&emsp;' + docs.CallCnt + '</br>';
        html += '当日异常总量&emsp;:&emsp;' + docs.FailCnt + '</br>';
        html += '当日成功率&emsp;&emsp;:&emsp;' + rateSuccess + '</br>';
        if(content){
            html += content;
        }

        if( d.type === 4 ){
            html += '<b>单击查看详细信息...</b>';
        }

        $('<div class="chart-tooltip">' + html + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: d.y + h - 20,
            left: d.x + w + 10,
            'z-index': '9999',
            'color': '#fff',
            'font-size': '11px',
            opacity: 0.7
        }).prependTo('body').show();
    }

    function hideTooltip(){
        $('.chart-tooltip').remove();
    }

    function getWarningInfo(message) {
        if( message.type === 'tuxedoQueue') {
            warnTuxedoQue[message.host] = message.detail;
        }
        if( message.type === 'SoapWarn' || message.type === 'IntfTabWarn') {
            addIntfWarning(message.detail);
        }
    }

    function changeState(){
        typeof timeId !== 'undefined' && clearTimeout(timeId);
        showHideNodes(root, warnTuxedoQue);
        hideTooltip();
        var trade = [];
        var region = [];
        var tmp;
        for(var key in warnTuxedoQue){
            if(key !== undefined) {
                tmp = getHostInfo(key, warnTuxedoQue[key]);
                trade.push(tmp.key);
                region.push('region'+tmp.region);
            }
        }

        cConfig.tradeType.forEach(function (item) {
            if( ~trade.indexOf(item.key) ){
                $('.balloon-'+item.key).addClass('warning');
            }else{
                $('.balloon-'+item.key).removeClass('warning');
            }
        });
        cConfig.regionType.forEach(function (item) {
            if( ~region.indexOf(item.key) ){
                $('.balloon-'+item.key).addClass('warning');
            }else{
                $('.balloon-'+item.key).removeClass('warning');
            }
        });
        tmp = {};

        $.extend(tmp, root);
        root._children = root.children;
        root.children = null;
        update();
        root.children = root._children;
        root._children = null;
        update();
        warnTuxedoQue = {};
        tmp = null;

        timeId = setTimeout(changeState, warnInterval);
    }

    $('.tuxedo-type').change(function(){
        var tmptype = $('input[name="tuxedo-radio"]:checked').val();
        if('five-minute' === tmptype){
            $('label.five-minute').addClass('active');
            $('label.whole-day').removeClass('active');
            type = 'callFiveMinute';
        }else{
            $('label.whole-day').addClass('active');
            $('label.five-minute').removeClass('active');
            type = 'provCodeOprNameCallSum';
        }
        changeState();
    });

    var $regionItems = $('.ntg-side-right .ntg-items');
    var $warningItem = $('.msgWarningInfo');

    $regionItems.hover(function(){
        typeof timeRegion !== 'undefined' && clearTimeout(timeRegion);
    },function(){
        scrollToUpRegion();
    }).trigger('mouseleave');
    $warningItem.hover(function(){
        typeof timeWarning !== 'undefined' && clearTimeout(timeWarning);
    },function(){
        scrollToLeftWarning();
    }).trigger('mouseleave');

    $('.ntg-side-right .ntg-down').mousedown(function(){
        speedRegion = 5;
        typeof timeRegion !== 'undefined' && clearTimeout(timeRegion);
        scrollToUpRegion();
    }).mouseup(function(){
        speedRegion = 30;
        typeof timeRegion !== 'undefined' && clearTimeout(timeRegion);
        scrollToUpRegion();
    });
    $('.ntg-balloon-item').hover(function(e){
        showTooltip(e.pageX - e.offsetX/2, e.pageY- e.offsetY + 5, $(this).data('name'));
    }, hideTooltip);

    $('.tip').click(function(){
        $('#ntg_dialog').fadeOut('slow');
    });

    function scrollToUpRegion(){
        if($regionItems.scrollTop() >= $regionItems.find('.ntg-content:first').height() + 26){
            $regionItems.scrollTop(0);
            $regionItems.find(".ntg-content:first").appendTo($regionItems);
        }else{
            $regionItems.scrollTop($regionItems.scrollTop()+1);
        }
        timeRegion = setTimeout(scrollToUpRegion, speedRegion);
    }
    function scrollToLeftWarning(){
        if($warningItem.scrollLeft() >= $warningItem.find('.msg-list td:first').width()){
            $warningItem.scrollLeft(0);
            var $itemFirst = $warningItem.find('.msg-list td:first');
            if($itemFirst.hasClass('msg-null')){
                $itemFirst.appendTo($warningItem.find('.msg-list'));
            }else {
                $warningItem.find('.msg-null').appendTo($warningItem.find('.msg-list'));
                $itemFirst.remove();
                intfWarningQueLen --;
            }
        }else{
            $warningItem.scrollLeft($warningItem.scrollLeft() +1);
        }
        if(intfWarningQueLen > 16) {
            speedWarning = 2;
        }
        if(intfWarningQueLen > 11 && intfWarningQueLen <= 16) {
            speedWarning = 5;
        }
        if(intfWarningQueLen > 9 && intfWarningQueLen <= 11) {
            speedWarning = 10;
        }
        if(intfWarningQueLen >= 6 && intfWarningQueLen <= 9) {
            speedWarning = 15;
        }
        if(intfWarningQueLen < 6) {
            speedWarning = 20;
        }
        if(intfWarningQueLen !== 0){
            timeWarning = setTimeout(scrollToLeftWarning, speedWarning);
        }else{
            timeWarning = -1;
        }
    }

    function initWarnDataTable(url){
        warnTable = $('#data-table-warning').dataTable({
            'bProcessing': true,
            'bServerSide': true,
            'aLengthMenu': [10, 25, 50, 100],
            'sAjaxSource': url,
            'bRetrieve':true,
            'bJQueryUI': false,
            'bAutoWidth': false,
            'bSort': false,
            //'sScrollX': '100%',
            'sScrollY': '410px',
            'sPaginationType': 'full_numbers',
            'oLanguage': {
                'sSearch': '<span>流程过滤:</span> _INPUT_',
                'sLengthMenu': '<span>每页显示数:</span> _MENU_',
                'oPaginate': { 'sFirst': '首页', 'sLast': '末页', 'sNext': '>', 'sPrevious': '<' },
                'sInfo': '当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录'
            },
            'fnDrawCallback': function () {
                if( !$('#tab-warn').hasClass('active')) {
                    $('#tab4').removeClass('active');
                }
            }
        });
    }

    function initLcuDataTable(url){
        lcuTable = $('#data-table-lcu').dataTable({
            'bProcessing': true,
            'bServerSide': true,
            'aLengthMenu': [10, 25, 50, 100],
            'sAjaxSource': url,
            'bRetrieve':true,
            'bJQueryUI': false,
            'bAutoWidth': false,
            'bSort': false,
            //'sScrollX': '100%',
            'sScrollY': '410px',
            'sPaginationType': 'full_numbers',
            'oLanguage': {
                'sSearch': '<span>明细过滤:</span> _INPUT_',
                'sLengthMenu': '<span>每页显示数:</span> _MENU_',
                'oPaginate': { 'sFirst': '首页', 'sLast': '末页', 'sNext': '>', 'sPrevious': '<' },
                'sInfo': '当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录'
            },
            'fnDrawCallback': function () {
                if( !$('#tab-lcu').hasClass('active')){
                    $('#ntg_dialog_content').removeClass('active');
                }
            }
        });
    }

    function addIntfWarning(detail){
        var msgSha = CryptoJS.SHA1(JSON.stringify(detail));
        var $msgList = $warningItem.find('.msg-list');
        if($('#'+msgSha).length === 0) {
            $msgList.append('<td id=""+msgSha><div class="msg-item">' + detail + '</div></td>');
        }

        intfWarningQueLen ++;
        if( typeof timeWarning === 'undefined' || timeWarning === -1){
            timeWarning = setTimeout(scrollToLeftWarning, speedWarning);
        }
    }

    function updateData(data){
        for(var i=0; i<cConfig.tradeType.length; i++){
            var item = cConfig.tradeType[i];
            var $obj = $('.'+item.key);
            var sum = data['trade`'+item.key+'`call'] || -1;
            var fail = data['trade`'+item.key+'`fail'] || 0;
            var suc = sum - fail || 0;
            var rateSum = sum !== -1 && '100.0%' || '0.0%';
            var rateFail = sum !== -1 && (fail / sum * 100).toFixed(1) || '0.0';
            var rateSuc = sum !== -1 && (suc / sum * 100).toFixed(1) || '0.0';
            $obj.find('li:nth-child(1) .ntg-value').text(formatNum(sum));
            $obj.find('li:nth-child(1) .progress-value').text(sum);
            $obj.find('li:nth-child(1) .bar').width(rateSum);
            $obj.find('li:nth-child(2) .ntg-value').text(rateFail+'%');
            $obj.find('li:nth-child(2) .progress-value').text(fail);
            $obj.find('li:nth-child(2) .bar').width(rateFail+'%');
            $obj.find('li:nth-child(3) .ntg-value').text(rateSuc+'%');
            $obj.find('li:nth-child(3) .progress-value').text(suc);
            $obj.find('li:nth-child(3) .bar').width(rateSuc+'%');
        }
        for(var i=0; i<cConfig.regionType.length; i++){
            var item = cConfig.regionType[i];
            var $obj = $('.'+item.key);
            var sum = data['region`'+item.key+'`call'] || -1;
            var fail = data['region`'+item.key+'`fail'] || 0;
            var suc = sum - fail || 0;
            var rateSum = sum !== -1 && '100.0%' || '0.0%';
            var rateFail = sum !== -1 && (fail / sum * 100).toFixed(1) || '0.0';
            var rateSuc = sum !== -1 && (suc / sum * 100).toFixed(1) || '0.0';
            $obj.find('li:nth-child(1) .ntg-value').text(formatNum(sum));
            $obj.find('li:nth-child(1) .progress-value').text(sum);
            $obj.find('li:nth-child(1) .bar').width(rateSum);
            $obj.find('li:nth-child(2) .ntg-value').text(rateSuc+'%');
            $obj.find('li:nth-child(2) .progress-value').text(suc);
            $obj.find('li:nth-child(2) .bar').width(rateSuc+'%');
            $obj.find('li:nth-child(3) .ntg-value').text(rateFail+'%');
            $obj.find('li:nth-child(3) .progress-value').text(fail);
            $obj.find('li:nth-child(3) .bar').width(rateFail+'%');

            if(rateSuc < 70){
                $obj.parent('.ntg-bottom').parent('.ntg-content').addClass('warning');
            }else{
                $obj.parent('.ntg-bottom').parent('.ntg-content').removeClass('warning');
            }
        }
    }

    function showHideNodes(root, warn){
        function recurseNode( node ){
            if(!node) {
                return 1;
            }
            var child = 1;
            var _child = 1;
            if( node.children ){
                for(var i=0; i<node.children.length; i++){
                    child *= recurseNode(node.children[i]);
                }
            }
            if( node._children ){
                for(var j=0; j<node._children.length; j++){
                    _child *= recurseNode(node._children[j]);
                }
            }
            if( node.type === 4 ){
                //0为高危告警；2为一般告警
                //服务:tcccrm1l1server(tcccrm2l1)启动通道数:6,目前队列数:6.队列时间:2015-11-03 09:50:38
                var tmp;
                if(node.u !== undefined){
                    tmp = node.parentName + '_' + node.u;
                }else{
                    tmp = node.parentName;
                }
                if( warn[tmp] !== undefined && /启动通道数:(\d+),目前队列数:(\d+)/.test(warn[tmp]) ){
                    var serve = RegExp.$2;
                    var queued = RegExp.$1;
                    if( serve > queued * 2){
                        node.state = 0; //state为 0 ,红色告警
                    }else{
                        if (parseInt(serve) === 1 && parseInt(queued) === 1) {
                            node.state = 1;
                        } else {
                            node.state = 2; //state为 2 ,黄色告警
                        }
                    }
                }else {
                    node.state = 1; //state为 1 ,不告警
                }
                if( node.state === 0){
                    node.content = '<span style="color: rgb(255,0,0);">'+ warn[tmp] +'</span>';
                }
                if( node.state === 2){
                    node.content = '<span style="color: rgb(255,209,0);">'+ warn[tmp] +'</span>';
                }
                if( node.state === 1){
                    delete node.content;
                }
            }else{
                node.state = child * _child === 4 ? 2 : child * _child;
                //console.log(node.name, node.state);
            }
            node.hidden === false && (node.state = 0);
            if( node.state === 1 ){
                if(node.children){
                    node._children = node.children;
                    node.children = null;
                }
            }else{
                if( node._children ){
                    node.children = node._children;
                    node._children = null;
                }
            }
            return node.state;
        }
        recurseNode(root);
    }
    window.getWarningInfo = getWarningInfo;
});
