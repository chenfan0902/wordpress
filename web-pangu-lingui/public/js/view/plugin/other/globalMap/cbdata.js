function CBData() {

  $.getJSON("/getWarmCodes.html", function (data) {

    if(data.length==0){
      warmCodes = '';

    }else{
      warmCodes = data[0].WarmCodes;
      console.log(data[0].WarmCodes);
      initProvince();
      wramInMap();
    }

  });
  $.getJSON("/getGlobalMapMainFormat.html", function (data) {
    //console.log("warnData----" + JSON.stringify(data));
    //console.log("length---" + data.length);
    if(data.length==0){
      warnData = [];
    }else{
      warnData = data;
    }



    if(data.length>0){
      selInd=data[0].relation_id;
      var dom = $('div .nav-left');
      dom.show(toggle);
      selectWarn();
    }else{
      console.log("close---" + data.length);
      removeWarm();//add by huangyk
      var dom = $('div .nav-left');
      dom.hide(toggle);
    }

  });

  //var data = CBData.sysData;
  $.getJSON("/getGlobalMapRspState.html", function (data) {


    sysData = data;

    if (sysData != "" || sysData != null) {
     var flag=1;
      for (var x = 0; x < sysData.length; x++) {
        console.log('sysData---');
        if(sysData[x].flag==1){
          warnText=sysData[x].text;
          //dom.show(toggle);
          flag=0;
        }

      }
      if(flag==1){
        //  var df=new SimpleDateFormat();
        //df.applyPlacement("yyyy-MM-dd hh:mm:ss")
         var dates=new Date();

          //var datestring=df.Format(dates);

          warnText=dates.getFullYear()+"-"+dates.getMonth()+"-"+dates.getDate()+" "+dates.getHours()+":"+dates.getMinutes()+":"+dates.getSeconds()+"各个模块状态正常";

      }

    }

    var x = $('.nav-top-innner').offset().left;
    //console.log('x---' + x+'----warnText---'+warnText);
    if (x!=0) {
      $('#testSpan').hide();
      $('#testSpan').html('');

      $('.nav-top-innner').animate({left: "+=1000px"}, 10);

    }

      $('#testSpan').show();
      $('#testSpan').html(warnText);
      $('.nav-top-innner').animate({left: "-=1000px"}, 2000);

  });
  //$('.nav-top-innner').hide();
  //




}



CBData.intfData = {
  "type": "intf_Soap",
  "relation_id": "20141207220410813379.6739023166",
  "titlemain": "接口",
  "title1": "接口(告警)",
  "title1_1": "qryResourceRemain",
  "title1_2": "Soap",
  "title1_3": "3域",
  "title1_4": "广东省",
  "title1_5": "无",
  "title1_6": [
    "刘果"
  ],
  "title2": "失败率",
  "title2_1": {
    "other": 0,
    "fail": 73,
    "successful": 27
  },
  "title3": "5分钟压力轨迹",
  "title3_1": [
    {
      "other": 0,
      "fail": 178,
      "successful": 62,
      "mi": 51
    },
    {
      "other": 0,
      "fail": 184,
      "successful": 59,
      "mi": 52
    },
    {
      "other": 0,
      "fail": 140,
      "successful": 54,
      "mi": 49
    },
    {
      "other": 0,
      "fail": 164,
      "successful": 61,
      "mi": 50
    },
    {
      "other": 0,
      "fail": 164,
      "successful": 71,
      "mi": 53
    },
    {
      "other": 0,
      "fail": 29,
      "successful": 5,
      "mi": 54
    }
  ],
  "status": "1"
};

CBData.warnDataPerType = [
  {
    "detail": "2015-08-24 15:11:02_福建省checkUserInfo接口--成功(0000和9999):1352次,失败(其他):628次,失败率=31%;(恢复)",
    "relation_id": "20141207220415459994.9166861554",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 15:16:02_广东省qryResourceRemain接口成功(0000):149次,业务失败(9999):526次,失败率=77%;(告警)",
    "relation_id": "20141207220415849151.3202872794",
    "recover_type": "1",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 15:21:03_四川省qryResourceRemain接口成功(0000):75次,业务失败(9999):184次,失败率=71%;(恢复)",
    "relation_id": "20141207220415219347.1835779277",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 11:21:04_四川省qryResourceRemain接口成功(0000):68次,业务失败(9999):181次,失败率=72%;(恢复)",
    "relation_id": "20141207220411998792.8189431778",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 11:26:03_湖南省qryResourceRemain接口成功(0000):100次,业务失败(9999):246次,失败率=71%;(恢复)",
    "relation_id": "20141207220411301041.02713272785",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 11:26:03_湖南省qryAcctInfo接口成功(0000):17次,业务失败(9999):49次,失败率=74%;(恢复)",
    "relation_id": "20141207220411311702.9547681741",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 11:41:04_北京市qryResourceRemain接口成功(0000):133次,业务失败(9999):359次,失败率=72%;(恢复)",
    "relation_id": "20141207220411480543.60236739845",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 13:01:04_四川省qryResourceRemain接口成功(0000):78次,业务失败(9999):212次,失败率=73%;(恢复)",
    "relation_id": "20141207220413651191.9924519915",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 14:01:02_黑龙江省resourcePurchase接口成功(0000):29次,业务失败(9999):94次,失败率=76%;(恢复)",
    "relation_id": "20141207220414581773.4329172483",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 14:06:02_广东省qryResourceRemain接口成功(0000):186次,业务失败(9999):584次,失败率=75%;(恢复)",
    "relation_id": "20141207220414938106.3200447976",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 14:16:02_辽宁省resourcePurchase接口--成功(0000和9999):161次,失败(其他):94次,失败率=36%;(恢复)",
    "relation_id": "20141207220414774614.5886301526",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 10:53:33_广东省qryResourceRemain接口成功(0000):177次,业务失败(9999):547次,失败率=75%;(恢复)",
    "relation_id": "20141207220410813379.6739023166",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 11:01:04_湖南省qryResourceRemain接口成功(0000):108次,业务失败(9999):275次,失败率=71%;(恢复)",
    "relation_id": "20141207220411762089.7687151403",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 11:01:04_湖南省qryAcctInfo接口成功(0000):21次,业务失败(9999):56次,失败率=72%;(恢复)",
    "relation_id": "2014120722041178134.2931274267",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 15:21:03_河北省qryResourceRemain接口成功(0000):86次,业务失败(9999):248次,失败率=74%;(恢复)",
    "relation_id": "20141207220415148448.37311153326",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 16:26:03_湖南省checkUserInfo接口--成功(0000和9999):1575次,失败(其他):821次,失败率=34%;(恢复)",
    "relation_id": "20141207220416194458.91619362877",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 16:38:06_null(恢复)",
    "relation_id": "20141207220416901081.4995430852",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 16:46:03_湖南省qryResourceRemain接口成功(0000):71次,业务失败(9999):180次,失败率=71%;(恢复)",
    "relation_id": "20141207220416551291.9372411998",
    "recover_type": "0",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 16:46:03_湖南省qryAcctInfo接口成功(0000):23次,业务失败(9999):58次,失败率=71%;(告警)",
    "relation_id": "20141207220416580500.2290088814",
    "recover_type": "1",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 16:51:02_河北省qryResourceRemain接口成功(0000):80次,业务失败(9999):207次,失败率=72%;(告警)",
    "relation_id": "20141207220416284660.6774756467",
    "recover_type": "1",
    "monitor_type": "intf"
  },
  {
    "detail": "2015-08-24 16:51:02_四川省qryResourceRemain接口成功(0000):75次,业务失败(9999):186次,失败率=71%;(告警)",
    "relation_id": "20141207220416918777.2992910943",
    "recover_type": "1",
    "monitor_type": "intf"
  }
];

CBData.sysData = [
  {
    "monitor_type": "tuxedo",
    "times": 90,
    "flag": 1
  },
  {
    "monitor_type": "oracle",
    "times": 100,
    "flag": 0
  },
  {
    "monitor_type": "intf",
    "times": 90,
    "flag": 1
  },
  {
    "monitor_type": "weblogic",
    "times": 100,
    "flag": 0
  },
  {
    "monitor_type": "crm",
    "times": 80,
    "flag": 1
  }
];

CBData.provinceData = [ {
	"name" : "安徽",
	"code" : "30",
	"id" : "anhui",
	"top" : 390,
	"left" : 875,
	"img" : "../../../../img/globalMap/anhui.png"
}, {
	"name" : "北京",
	"code" : "11",
	"id" : "beijing",
	"top" : 255,
	"left" : 845,
	"img" : "../../../../img/globalMap/beijing.png"
}, {
	"name" : "重庆",
	"code" : "83",
	"id" : "chongqing",
	"top" : 445,
	"left" : 730,
	"img" : "../../../../img/globalMap/chongqing.png"
}, {
	"name" : "福建",
	"code" : "38",
	"id" : "fujian",
	"top" : 500,
	"left" : 900,
	"img" : "../../../../img/globalMap/fujian.png"
}, {
	"name" : "甘肃",
	"code" : "87",
	"id" : "gansu",
	"top" : 260,
	"left" : 570,
	"img" : "../../../../img/globalMap/gansu.png"
}, {
	"name" : "广东",
	"code" : "51",
	"id" : "guangdong",
	"top" : 550,
	"left" : 830,
	"img" : "../../../../img/globalMap/guangdong.png"
}, {
	"name" : "广西",
	"code" : "59",
	"id" : "guangxi",
	"top" : 550,
	"left" : 740,
	"img" : "../../../../img/globalMap/guangxi.png"
}, {
	"name" : "贵州",
	"code" : "85",
	"id" : "guizhou",
	"top" : 495,
	"left" : 720,
	"img" : "../../../../img/globalMap/guizhou.png"
}, {
	"name" : "海南",
	"code" : "50",
	"id" : "hainan",
	"top" : 630,
	"left" : 775,
	"img" : "../../../../img/globalMap/hainan.png"
}, {
	"name" : "河北",
	"code" : "18",
	"id" : "hebei",
	"top" : 280,
	"left" : 830,
	"img" : "../../../../img/globalMap/hebei.png"
}, {
	"name" : "黑龙江",
	"code" : "97",
	"id" : "heilongjiang",
	"top" : 100,
	"left" : 950,
	"img" : "../../../../img/globalMap/heilongjiang.png"
}, {
	"name" : "河南",
	"code" : "76",
	"id" : "henan",
	"top" : 370,
	"left" : 805,
	"img" : "../../../../img/globalMap/henan.png"
}, {
	"name" : "湖北",
	"code" : "71",
	"id" : "hubei",
	"top" : 415,
	"left" : 800,
	"img" : "../../../../img/globalMap/hubei.png"
}, {
	"name" : "湖南",
	"code" : "74",
	"id" : "hunan",
	"top" : 480,
	"left" : 790,
	"img" : "../../../../img/globalMap/hunan.png"
}, {
	"name" : "江苏",
	"code" : "34",
	"id" : "jiangsu",
	"top" : 370,
	"left" : 910,
	"img" : "../../../../img/globalMap/jiangsu.png"
}, {
	"name" : "江西",
	"code" : "75",
	"id" : "jiangxi",
	"top" : 475,
	"left" : 855,
	"img" : "../../../../img/globalMap/jiangxi.png"
}, {
	"name" : "吉林",
	"code" : "90",
	"id" : "jilin",
	"top" : 160,
	"left" : 950,
	"img" : "../../../../img/globalMap/jilin.png"
}, {
	"name" : "辽宁",
	"code" : "91",
	"id" : "liaoning",
	"top" : 210,
	"left" : 920,
	"img" : "../../../../img/globalMap/liaoning.png"
}, {
	"name" : "内蒙古",
	"code" : "10",
	"id" : "neimenggu",
	"top" : 250,
	"left" : 710,
	"img" : "../../../../img/globalMap/neimenggu.png"
}, {
	"name" : "宁夏",
	"code" : "88",
	"id" : "ningxia",
	"top" : 310,
	"left" : 705,
	"img" : "../../../../img/globalMap/ningxia.png"
}, {
	"name" : "青海",
	"code" : "70",
	"id" : "qinghai",
	"top" : 330,
	"left" : 530,
	"img" : "../../../../img/globalMap/qinghai.png"
}, {
	"name" : "陕西",
	"code" : "84",
	"id" : "shaanxi",
	"top" : 360,
	"left" : 745,
	"img" : "../../../../img/globalMap/shaanxi.png"
}, {
	"name" : "山东",
	"code" : "17",
	"id" : "shandong",
	"top" : 315,
	"left" : 870,
	"img" : "../../../../img/globalMap/shandong.png"
}, {
	"name" : "上海",
	"code" : "31",
	"id" : "shanghai",
	"top" : 400,
	"left" : 960,
	"img" : "../../../../img/globalMap/shanghai.png"
}, {
	"name" : "山西",
	"code" : "19",
	"id" : "shanxi",
	"top" : 310,
	"left" : 790,
	"img" : "../../../../img/globalMap/shanxi.png"
}, {
	"name" : "四川",
	"code" : "81",
	"id" : "sichuan",
	"top" : 430,
	"left" : 650,
	"img" : "../../../../img/globalMap/sichuan.png"
}, {
	"name" : "台湾",
	"code" : "00",
	"id" : "taiwang",
	"top" : 540,
	"left" : 960,
	"img" : "../../../../img/globalMap/taiwang.png"
}, {
	"name" : "天津",
	"code" : "13",
	"id" : "tianjin",
	"top" : 270,
	"left" : 885,
	"img" : "../../../../img/globalMap/tianjin.png"
}, {
	"name" : "新疆",
	"code" : "89",
	"id" : "xinjiang",
	"top" : 210,
	"left" : 390,
	"img" : "../../../../img/globalMap/xinjiang.png"
}, {
	"name" : "西藏",
	"code" : "79",
	"id" : "xizang",
	"top" : 390,
	"left" : 390,
	"img" : "../../../../img/globalMap/xizang.png"
}, {
	"name" : "云南",
	"code" : "86",
	"id" : "yunnan",
	"top" : 540,
	"left" : 630,
	"img" : "../../../../img/globalMap/yunnan.png"
}, {
	"name" : "浙江",
	"code" : "36",
	"id" : "zhejiang",
	"top" : 440,
	"left" : 925,
	"img" : "../../../../img/globalMap/zhejiang.png"
} ];