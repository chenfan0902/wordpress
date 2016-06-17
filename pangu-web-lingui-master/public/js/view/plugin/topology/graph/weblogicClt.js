$(function(){
    var width = 1100,
        height = 800,
        root,
        bakData,
        warn = {};

    var force = d3.layout.force()
        .gravity(.05)
        //.distance(100)
        .linkDistance(function(d) {return (d['source'].type==1 && 130) || (d['source'].type==2&&80) || 65 })
        .charge(-500)
        .size([width, height])
        .on('tick', tick);

    var svg = d3.select('#topology').append('svg')
        .attr('width', width)
        .attr('height', height);

    var tooltip = d3.select('#tooltip-topology');

    var link = svg.selectAll('.link'),
        node = svg.selectAll('.node');

    //setInterval(function(){}, updateInterval);

    $.ajax({
        type: 'get',
        url: '/getNTGNodes',
        data: {
            chartList: $('#chartList').val()
        },
        success: function(data){
            bakData = data;
            root = data;
            //showHideNodes(data, warn);
            //update();
            changeState();
        }
    })

    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        force
            .nodes(nodes)
            .links(links)
            .start();

        // Update the links…
        link = link.data(links, function(d) {return d.target.id; });

        // Exit any old links.
        link.exit().remove();

        // Enter any new links.
        link.enter().insert('line', '.node')
            .attr('class', 'link')
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        // Update the nodes…
        node = node.data(nodes, function(d) { return d.id; });

        // Exit any old nodes.
        node.exit().remove();

        // Enter any new nodes.
        var nodeEnter = node.enter().append('svg:g')
            .attr('class', 'node')
            .on('click', function(d){ return d.switch !== false && click(d) })
            .on('mouseover', function (d) {
                if(d.hover == false) return;
                var host = '';
                if(d.type == 4){
                    host = d.parentName + '_' + d.name
                }
                $.ajax({
                    type: 'get',
                    url: '/getNewestWebLogicData',
                    data: {
                        date: $('#value').val() || '2015-5-25',
                        host: '10.124.0.5_webapp' || host,
                        chartList: 'WebLogicGroupList',
                        chartBList: 'WebLogicBaseList'
                    },
                    success: function (docs) {
                        showTooltip(d, docs['aaData'])
                    }
                })
            })
            .on('mouseout', function (d) {
                hideTooltip();
            })
            .call(force.drag);

        nodeEnter.append('svg:image')
            .attr('class', 'nodeimg')
            .attr('xlink:href', function(d){
                return (d.type==1 && 'img/ntg/ntg-cloud.png') || (d.type==2 && 'img/ntg/ntg-switch.png')
                    || ((d['state']===undefined&&d.type==3) && 'img/ntg/ntg-hostMonitor-normal.png')
                    || ((d['state']==0&&d.type==3) && 'img/ntg/ntg-hostMonitor-error.png')
                    || ((d['state']===undefined&&d.type==4) && 'img/ntg/ntg-user-normal.png')
                    || ((d['state']==0&&d.type==4) && 'img/icons/ntg-warning.gif')
                    || ((d['state']==1&&d.type==3) && 'img/ntg/ntg-hostMonitor-normal.png')
                    || ((d['state']==1&&d.type==4) && 'img/ntg/ntg-user-normal.png')
                    || ((d['state']==2&&d.type==3) && 'img/ntg/ntg-hostMonitor-warning.png')
                    || ((d['state']==2&&d.type==4) && 'img/ntg/ntg-user-warning.png')
                    || 'img/icons/ntg-switch.png';
            })
            .attr('x', function(d){
                return (d.type == 1 && '-50px') || (d.type==2&&'-8px')
                    ||(d.type==3&&'-24px') || '-16px';
            })
            .attr('y', function(d){
                return (d.type == 1 && '-50px') || (d.type==2&&'-8px')
                    ||(d.type==3&&'-24px') || '-16px';
            })
            .attr('width', function(d){
                return (d.type == 1 && '100px') || (d.type==2&&'16px')
                    ||(d.type==3&&'48px') || '32px';
            })
            .attr('height', function(d){
                return (d.type == 1 && '100px') || (d.type==2&&'16px')
                    ||(d.type==3&&'48px') || '32px';
            })

        nodeEnter.append('svg:text')
            .attr('class', 'nodetext')
            .attr('dx', function(d){
                return (d.type==1&& '-30px') ||(d.type==3 && '-30px') || -20;
            })
            .attr('dy', function(d){
                return (d.type==1 && '0') || -10;
            })
            .text(function(d) { return d.name });
    }

    function tick() {
        link.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    }

// Toggle children on click.
    function click(d) {
        if (d3.event.defaultPrevented) return;
        if(d.children){
            d._children = d.children;
            d.children = null;
        }else{
            d.children = d._children;
            d._children = null;
        }
        update();

    }

// Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [], i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            //if (!node.id) node.id = ++i;
            nodes.push(node);
        }
        recurse(root);
        return nodes;
    }

    function hideTooltip(){
        $("table#tooltip-topology").hide();
        var display = $("table#tooltip-topology").css("display");
        if(display != 'none'){
            //console.log(display)
            $("table#tooltip-topology").css("display", "none");
        }
    }

    function showTooltip(d, docs) {
        var html = "";
        html += '<tr><td style="text-align: center">主机IP</td><td style="text-align: center" colspan="2">'+d["parentName"]+'</td></tr>';
        html += '<tr><td style="text-align: center">用户</td><td style="text-align: center" colspan="2">'+d["name"]+'</td></tr>';
        html += '<tr><td style="text-align: center">服务名</td><td style="text-align: center">Health|State</td><td>HeapFreeCurrent</td></tr>';
        for(var i=0; i<docs.length; i++){
            html += '<tr><td style="text-align: center">'+docs[i].Server+'</td><td style="text-align: center">'+
            (docs[i].HealthState||'--').substr(-2)+"|"+(docs[i].State||'--') +
            '</td><td style="text-align: center">'+(docs[i].HeapFreeCurrent||"--")+'</td></tr>';
        }
        $("table#tooltip-topology > tbody").html(html);
        $("table#tooltip-topology").css("top","220px").css("z-index","0").css("width","330px").show();
    }

    function getWebLogicWarning(message) {
        warn[message.host] = message.detail;
    }

    function changeState(){
        showHideNodes(root, warn);
        update();
        warn = {};

        timeId = setTimeout(changeState, 15*1000);
    }


    window.getWebLogicWarning = getWebLogicWarning;
});

