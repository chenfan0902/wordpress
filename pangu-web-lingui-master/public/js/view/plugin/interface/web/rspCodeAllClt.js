$(function(){

    var province_codes=
    {
        "10":"内蒙古省",
        "11":"北京市"  ,
        "13":"天津市"
        ,
        "17":"山东省"  ,
        "18":"河北省"  ,
        "19":"山西省"  ,
        "22":"澳门省"  ,
        "30":"安徽省"  ,
        "31":"上海市"  ,
        "34":"江苏省"  ,
        "36":"浙江省"  ,
        "38":"福建省"  ,
        "50":"海南省"  ,
        "51":"广东省"  ,
        "59":"广西省"  ,
        "70":"青海省"  ,
        "71":"湖北省"  ,
        "74":"湖南省"  ,
        "75":"江西省"  ,
        "76":"河南省"  ,
        "79":"西藏省"  ,
        "81":"四川省"  ,
        "83":"重庆省"  ,
        "84":"陕西省"  ,
        "85":"贵州省"  ,
        "86":"云南省"  ,
        "87":"甘肃省"  ,
        "88":"宁夏省"  ,
        "89":"新疆省"  ,
        "90":"吉林省"  ,
        "91":"辽宁省"  ,
        "97":"黑龙江省",
        "00":"其他"

    };

    getData();
    function getData(){
        $.ajax({
            type: 'get',
            url: '/InterfaceRspCodeAllData',
            data: {
                province_code: "11"
            },
            success: function(rows) {
                initChartData(rows);
            }
        });
    }

    function initChartData (data) {

        for(var x=0;x<data.length;x++) {

            $.plot($("#" + data[x].rsp_code_info), data[x].code,

                {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 2/3,
                                formatter: function(label, series){
                                    return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'+label+'<br/>'+Math.round(series.percent)+'%</div>';
                                },
                                threshold: 0.02   //小于百分之2就不显示
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
        }
    };

});
