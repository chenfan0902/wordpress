$(function(){
    var root;
    var typeList = 'calledOperateDayList';


    var nodesInfo = $("div#nodesInfo").text();
    root = JSON.parse(nodesInfo);


    $('.key-step-type').change(function(){
        var tmptype = $('input[name="key-step-radio"]:checked').val();
        if('five-minute' === tmptype){
            $('label.five-minute').addClass('active');
            $('label.whole-day').removeClass('active');
            //type = 'callFiveMinute';
            typeList = 'calledPerMinuteList';
        }else{
            $('label.whole-day').addClass('active');
            $('label.five-minute').removeClass('active');
            //type = 'provCodeOprNameCallSum';
            typeList = 'calledOperateDayList';
        }
        typeof timeId !== 'undefined' && clearTimeout(timeId);
        updateAllData();
    });

    function updateAllData(){
        $.ajax({
            type: "get",
            url: "/getD3JSTradeKeyStepAllData",
            data: {
                date: $("#value").val(),
                chartList: $("#chartList").val(),
                typeList: typeList || 'calledOperateDayList'
            },
            success: function(data){
                root.forEach(function(item){
                    if(typeList === null || typeList === 'calledPerMinuteList'){
                        var tmp = {};
                        var d = data[item.webId];
                        if(~item.webId.indexOf('order')){
                            var len = d.length || 0;
                            for(var key in d[0]){
                                tmp[key] = d[0][key] - d[len-1][key];
                                tmp[key] < 0 && (tmp[key] = -tmp[key]);
                            }
                        }else{
                            for(var i=0 ;i< d.length; i++){
                                for(var key in d[i]){
                                    tmp[key] !== undefined && (tmp[key] += d[i][key]) || (tmp[key] = d[i][key]);
                                }
                            }
                        }
                        updateWebData(tmp, item);
                    } else {
                        updateWebData(data[item.webId], item);
                    }
                });
                //updateWebData(data, root, typeList);
            }
        });
        timeId = setTimeout(updateAllData, 10000);
    }
    typeof timeId !== 'undefined' && clearTimeout(timeId);
    updateAllData();
});

function formatNum(num) {
    num = ~num && num || 0;
    if (num > 1000000000) return (num/1000000000).toFixed(1)+'G';
    if (num > 1000000) return (num/1000000).toFixed(1)+'M';
    if (num > 1000) return (num/1000).toFixed(1)+'K';
    return num
};

function updateWebData(data, config){
    if(!data){
        return;
    }
    var sum = data.CALLED || -1;
    var warnClsss = config.norm.length === 5 && 'flow-item-5-warning' || 'flow-item-warning';
    config.norm.forEach(function(item, idx){
        if(~item[2].indexOf(',')){
            var arr = item[2].split(',');
            var tmpC = 0;
            arr.forEach(function(field){
                tmpC += data[field];
            });
        } else {
            var tmpC = data[item[2]] || 0;
        }
        sum === -1 && (tmpC = 0);
        var rateC = (tmpC / sum * 100).toFixed(1);
        sum === -1 && item[2] === 'CALLED' && (rateC = '100.0');

        $('.' + config.webId + ' > li:nth-child(' + (idx + 1) + ') .bar').width(rateC + '%');
        if( item[2] === 'CALLED') {
            $('.'+config.webId +' > li:nth-child('+(idx+1)+') .flow-value').text(formatNum(sum));
        }else {
            $('.' + config.webId + ' > li:nth-child(' + (idx + 1) + ') .flow-value').text(rateC + '%');
        }
        $('.'+config.webId +' > li:nth-child('+(idx+1)+') .bar > .progress-value').text(tmpC);

    });
    var target = $('.'+config.webId);
    var tmp = target.find('li:nth-child(2) > .flow-value').text();
    var c = parseInt(tmp.substring(0, tmp.length-1));
    if(c < 70){
        target.parent('.flow-bottom').parent('.flow-content').addClass(warnClsss);
    }else{
        target.parent('.flow-bottom').parent('.flow-content').removeClass(warnClsss);
    }
}
