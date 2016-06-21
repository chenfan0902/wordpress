$(function() {

    var value ='';
    if($('#datepicker') && $('#datepicker').attr('value') != ''){
        value = $('#datepicker').attr('value');
    }
    function drawBubbleGraph(bubbleData) {
        $('#container1').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy',
            height:650
        },
        colors: ['#EE0000','#4572A7', '#89A54E', '#80699B', '#3D96AE',
            '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
        plotOptions: {
            bubble: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                minSize: 8,
                maxSize: 55
            }
        },

        title: {
            text: '<strong>' + $("#bubbleTitle").attr("value") + '</strong>'
        },

        xAxis: {
            title: {
                text: '调用异常数'
            },
            allowDecimals: false
            // categories: ['cBss','内蒙古', '北京','天津','山东','河北','山西','澳门','安徽','上海','江苏','浙江','福建','海南','广东','广西','青海','湖北','湖南','江西','河南','西藏']
        },

        yAxis: {
            title: {
                text: '调用总数'
            },
            //tickPositions: [0, 50, 100, 150], // 指定竖轴坐标点的值
            startOnTick: true,
            endOnTick: false,
            allowDecimals: false
        },
        credits: {
            enabled: false
        },

        tooltip: {
            formatter: function () {
                var s = this.point.name + '-' + this.series.name + ': ' + '<br/>' +
                    '调用总数:' + this.y + '<br/>' +
                    '调用异常数:' + this.point.m + '<br/>' +
                    '调用异常率:' + this.point.z + '%';
                return s;
            },
            shared: true
        },
        selected: true,
        series: bubbleData

    });
    }


    $('#lsc_key').change(function(){
        if($('#lsc_key option:selected').val() !== '') {
            getData($('#lsc_key option:selected').val());
        }else{
            getData('');
        }
    });

    $('#lsc_host').change(function(){
        $('#lsc_key').val('');
        getData('');
    });


    function getData(code) {

        $.ajax({
            type:'GET',
            url:'/getBubbleChartData.html',
            data:'date='+value+'&chartList='+$('#chartList').attr('value')+'&filterHost='+ $('#lsc_host option:selected').val()+
                '&filterCode='+ code,
            dataType:'json',
            success:function(data){
                drawBubbleGraph(data);
            },
            error:function(){

            }
        });

    }
    getData('');
});