// JavaScript Document

/**
 * add by huangyk 省份信息绘制
 */
function initProvince(){
	var datas = CBData.provinceData;
	for (var ind in datas) {
		var date = datas[ind];
		var text = '<p style="color:#D3D4D7;position:absolute;z-Index:3;top:'+date.top+'px;left:'+date.left+'px;">'+date.name+'</a>';
		$("body").append(text);
	}
}

/**
 * add by huangyk 地图告警
 */
function wramInMap(){
	var datas = CBData.provinceData;
	for (var ind in datas) {
		var date = datas[ind];
		for (var i in warmCodes){
			var warmCode = warmCodes[i];
			if(date.code==warmCode){
				var txt = '<div id="warm-bu'+i+'" class="warn-bubble"  style="top:'+date.top+'px;left:'+date.left+'px;"><div class="warn-bubble-area"></div></div>';
				$("#content").append(txt);
				var text = '<img src="'+date.img+'" class="warmPro" id="'+date.id+'" style="position:absolute;z-Index:1;" />';
				$("body").append(text);
			}
		}
	}
}

/**
 * add by huangyk 取消地图告警
 */	
function removeWarm() {
		$(".warn-bubble").remove();
		$('.warmPro').remove();
}