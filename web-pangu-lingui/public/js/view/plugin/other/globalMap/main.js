var curInd = 0;
var selInd = 0;
var toggle = 500;
var colors = ['#5ccb66', '#f05a5a', '#56c0d6', '#bd2010', '#e7ba10', '#639629', '#9c55ad', '#cec3c6'];
var mc_state="";
//var warmCodes = ['97','38','70','17'];//报错省份编码
var warmCodes = null;//报错省份编码
//var warmData=null;
var simpleData=null;
var warnData=[];
var sysData=[];
var warnDataPerType=[];
var warnText="";

function init() {
	var dates=new Date();

	CBData();


	initEvt();

}

function test() {
	initTab();
}

function initLeft(relationId) {
	var ds = warnData;
	var data = null;
	if (relationId == null || !relationId) {
		// Intf
		data = ds[0];
		// Tuxedo
		data = ds[1];
		// Oracle
		data = ds[2];
	} else {
		for (var ind in ds) {
			var tmp = ds[ind];
			if (relationId == tmp.relation_id) {
				data = tmp;
				return;
			}
		}
	}

	initLeftPanel(4, data);
}

function selectWarn() {
	var selData = null;

	for(var x=0;x<warnData.length;x++){
		if(warnData[x].relation_id==selInd){
			selData=warnData[x];
		}

	}
	console.log("selData----"+JSON.stringify(selData));

	var type = 1;
	switch (selData.type) {
		case 'intf_Soap':
			type = 5;
			break;
		case 'tuxedo_Que':
			type = 1;
			break;
		case 'oracle_Session':
			type = 4;
			break;
		default:
			break;
	}
	initLeftPanel(type, selData);
//	initFlowPanel(selData.status);
}

function selectHandlDetail() {


	//var handleDetailData = CBData.handleDetailData;
	//initLeftPanel(3, handleDetailData);

	if(selInd==0){

	}else{
		var actions="/getGlobalMapRelationByRelationId.html?relation_id="+selInd;
		$.getJSON(actions, function(data) {

			initLeftPanel(3, data);
		});
	}

}

function initLeftPanel(ind, data) {
	initShowPanel(ind);
	switch(ind) {
		case 1:
			initLeftPanel1(data);
			initLeftPanel2(data);
			break;
		case 2:
			break;
		case 3:
			initLeftPanel3(data);
			break;
		case 4:
			initLeftPanel4(data);
			initLeftPanel2(data);
			break;
		case 5:
			initLeftPanel5(data);
			initLeftPanel2(data);
			break;
		default:
			break;
	}
}

function initShowPanel(ind) {
	for (var i = 1; i < 6; i++) {
		if (ind == i) $('.nav-left-content-' + i).show();
		else $('.nav-left-content-' + i).hide();
	}
}

function initTuxedoPanel() {
	initLeftPanel(1, warnData[1]);
}

function initFlowPanel(status) {
	initLeftPanel(2, status);
}

function initHandleDetail() {
	initLeftPanel(3, CBData.handleDetailData);
}

function initOraclePanel() {
	initLeftPanel(4, warnData[2]);
}

function initIntfPanel() {
	initLeftPanel(5, warnData[0]);
}

/**
 * State
 */
function initStatePanel() {
	//removeWarm();//add by huangyk
	var data = sysData;
	$('#mc_state_1_qry').unbind('click');
	$('#mc_state_2_qry').unbind('click');
	$('#mc_state_3_qry').unbind('click');
	$('#mc_state_4_qry').unbind('click');
	for (var i = 0; i < 4; i++) {
		var item = data[i];
		var angle = item.times*2*Math.PI/100;
		var arc = [{
			type: 'arc',
			lineWidth: 10,
			centerX: 50,
			centerY: 50,
			radius: 45,
			start: 0,
			end: angle,
			color: '#00ff00',
			opacity: 0.8,
			cw: true
		}];
		draw('can_state_' + (i+1), arc);
		$('#mc_state_' + (i+1) + '_num').text(item.times);

		if (item.flag > 0) {
			$(this).css({'background-color': 'bc2c2c'});
			$('#mc_state_' + (i+1) + '_qry').addClass('bg-state-error');
			$('#mc_state_' + (i+1) + '_qry').bind('click', function(e) {
				mc_state=$(e.target).attr('id');//类型


				initStateDetailPanel();
			});
		}else{
	        $('#mc_state_' + (i+1) + '_qry').removeClass('bg-state-error')
			//$('#mc_state_' + (i+1) + '_qry').addClass('nav-mid-state-btn-disble');
			//$('#mc_state_' + (i+1) + '_qry').unbind('click');
		}

	}
}

function initStateDetailPanel() {
	//var types = $(this).attr('id');
	console.log("mc_state------"+mc_state);
	var monitor_type="";
	if(mc_state=='mc_state_1_qry'){
		monitor_type='tuxedo';
	}
	if(mc_state=='mc_state_2_qry'){
		monitor_type='oracle';
	}
	if(mc_state=='mc_state_3_qry'){
		monitor_type='intf';
	}
	if(mc_state=='mc_state_4_qry'){
		monitor_type='weblogic';
	}



	var getGlobalMapByType="/getGlobalMapByType.html?monitor_type="+monitor_type;
	$.getJSON(getGlobalMapByType, function(data) {
		//var data = warnDataPerType;
		$('#mp_warn_detail').unbind('click');
		$('#mp_warn_detail').empty();

		for (var ind in data) {
			var item = data[ind];
			$('#mp_warn_detail').append('<li id="' + item.relation_id + '">' + item.detail + '</li>')
		}

		$('#mp_warn_detail li').bind('click', function (e) {
			//var dom = $('div .nav-mid-panel');
			//dom.hide(toggle);
            console.log("target----"+$(e.target).attr('id'));
			selInd=$(e.target).attr('id');
			var dom = $('div .nav-left');
			dom.show(toggle);
			selectWarn();
		});
	});
}

/**
 * Tab
 */
function initTab() {

	var data = warnData;
	console.log("data----"+JSON.stringify(data));
	$('#lc_tab li').unbind('click');
	$('#lc_tab').empty();
	for (var i = 0; i < data.length; i++) {
		var ind = ((curInd + i) >= warnData.length) ? (curInd + i - warnData.length) : (curInd + i);
		var item = data[ind];
		$('#lc_tab').append('<li id="'+ind+ '"  relation_id="' + item.relation_id + '">' + item.titlemain + '</li>');
	}

	$('#lc_tab li').bind('click', function(e) {
		//selInd = $(this).attr('id');
		selInd = $(this).attr('relation_id');
		addTabSelectClass();
		selectWarn();
		funcTabSelectCss(1);
	});
}

function addTabSelectClass() {
	for (var i = 0; i < 4; i++) {
		$('#lc_tab li[id="' + selInd + '"]').addClass('domain-select');
		$('#lc_tab li[id!="' + selInd + '"]').removeClass('domain-select');
	}
}

/**
 * Flow
 * @param {Object} status
 */
function initLeftPanel2(data) {
	drawHandleFlow(data.status);
}

/**
 * Handler Detail
 * @param {Object} data
 */
function initLeftPanel3(data) {
	$('#lc_3_handle_detail').empty();
	for (var ind in data) {
		var item = data[ind];
		$('#lc_3_handle_detail').append('<li>' + item.relation_detial + '</li>');
	}
}

/**
 * Oracle
 * @param {Object} data
 */
function initLeftPanel4(data) {
	$('#lc_4_t1_title').text(data.title1);
	$('#lc_4_t1_host').text(data.title1_1);
	$('#lc_4_t1_ins').text(data.title1_2);
	$('#lc_4_t1_type').text(data.title1_3);
	$('#lc_4_t1_domain').text(data.title1_4);
	$('#lc_4_t1_session').text(data.title1_5);
	if(data.title1_6==null||data.title1_6==""){
		$('#lc_4_t1_handler').text('无');
	}else{
		$('#lc_4_t1_handler').text(data.title1_6.join(','));
	}


	$('#lc_4_t2_title').text(data.title2);
	drawOracleMin('can_ora_min', data.title2_1, 'time');

	$('#lc_4_t3_title').text(data.title3);
	drawOracleMin('can_ora_hour', data.title3_1, 'hour');

//	initFlowPanel(data.status);
//	initHandleDetail();
//	initStatePanel(sysData);
}

function drawOracleMin(id, data, xc) {
	var max = 0,
		min = 0;
	var xarr = [];
	var colLen = 0;
	var i = 0;
	for (var ind in data) {
		i++;
		var item = data[ind];
		xarr.push(item[xc]);

		for (var p in item) {
			if (i <= 1) colLen++;
			var val = item[p];
			max = max < val ? val : max;
		}
	}

	//max = Math.ceil(max/10)*10;
	max = calMaxScale(max);
	var ds = [];
	for (var i = 0; i < (colLen-1); i++) {
		ds.push([]);
	}

	for (var ind in data) {
		var item = data[ind];

		var j = 0;
		for (var p in item) {
			var val = item[p];

			if (p != xc) ds[j++].push(100 - Math.floor(val*100/max));
		}
	}

	drawLineChart(id, xarr, max, ds, colors);
	showLineScale(id, max);
}

/**
 * Tuxedo
 * @param {Object} data
 */
function initLeftPanel1(data) {
	$('#lc_1_title').text(data.title1);
	$('#lc_1_host').text(data.title1_1);
	$('#lc_1_serv').text(data.title1_2);
	$('#lc_1_domain').text(data.title1_3);
	$('#lc_1_chanel').text(data.title1_4);
	$('#lc_1_queue').text(data.title1_5);

	//$('#lc_1_handler').text(data.title1_6.join(','));


	if(data.title1_6==""||data.title1_6==null){
		$('#lc_1_handler').text("无");
	}else{
		$('#lc_1_handler').text(data.title1_6.join(','));
	}
	$('#lc_1_t2_title').text(data.title2);
	var tops = data.title2_1;
	$('#lc_1_t2_top').empty();
	for (var ind in tops) {
		$('#lc_1_t2_top').append('<li>' + tops[ind] + '</li>');
	}

	$('#lc_1_t3_title').text(data.title3);
	drawTopPath(data.title3_1) ;
}

function drawTopPath(data) {
	var max = 0,
		min = 0;
	var xarr = [];
	var colLen = 0;
	var i = 0;
	for (var ind in data) {
		i++;
		var item = data[ind];
		xarr.push(item.mi);

		for (var p in item) {
			if (i <= 1) colLen++;
			var val = item[p];
			max = max < val ? val : max;
		}
	}

	//max = Math.ceil(max/10)*10;
	max = calMaxScale(max);
	var ds = [];
	for (var i = 0; i < (colLen-1); i++) {
		ds.push([]);
	}

	for (var ind in data) {
		var item = data[ind];

		var j = 0;
		for (var p in item) {
			var val = item[p];

			if (p != 'mi') ds[j++].push(100 - Math.floor(val*100/max));
		}
	}

	drawLineChart('can_itf_failure', xarr, max, ds, colors);
	showLineScale('can_itf_failure', max);
}

/**
 * Intf
 * @param {Object} data
 */
function initLeftPanel5(data) {

	$('#lc_5_title').text(data.title1);
	$('#lc_5_intf').text(data.title1_1);
	$('#lc_5_type').text(data.title1_2);
	$('#lc_5_domain').text(data.title1_3);
	$('#lc_5_province').text(data.title1_4);
	$('#lc_5_to').text(data.title1_5);
	//$('#lc_5_handler').text(data.title1_6.join(','));


	if(data.title1_6==""||data.title1_6==null){
		$('#lc_5_handler').text("无");
	}else{
		$('#lc_5_handler').text(data.title1_6.join(','));
	}
	$('#lc_5_2_title').text(data.title2);
	$('#lc_5_3_title').text(data.title3);

	var intf_failure_rate = data.title2_1;
	$('#lc_5_2_rate').text(intf_failure_rate.successful);
	var ang1 = Math.PI*2*intf_failure_rate.successful/100;
	var ang2 = Math.PI*2*intf_failure_rate.fail/100
	var ang3 = Math.PI*2*intf_failure_rate.other/100

	var rateData = [{
		type: 'arcseg',
		centerX: 165,
		centerY: 75,
		radius: 55,
		lineWidth: 20,
		segments: [{
			start: 0,
			end: ang1,
			color: '#5ccb66'
		}, {
			start: ang1,
			end: ang1 + ang2,
			color: '#f05a5a'
		}, {
			start: ang1 + ang2,
			end: ang1 + ang2 + ang3,
			color: '#56c0d6'
		}]
	}];

	draw('can_itf_failure_min', rateData);

	var pathData = data.title3_1;
	drawIntfPath('can_itf_exec_min', pathData);
}

function drawIntfPath(id, data) {
	var max = 0,
		min = 0;
	var xarr = [];
	for (var ind in data) {
		var item = data[ind];
		xarr.push(item.mi);
		max = max < item.successful ? item.successful : max;
		max = max < item.fail ? item.fail : max;
		max = max < item.other ? item.other : max;
	}




	//var bit = max + '';
	//if (bit.length > 2) {
	//	var len = bit.length - 2;
	//	max = Math.ceil(max/Math.pow(10, len)) * Math.pow(10, len);
	//} else {
	//	max = Math.ceil(max / 10) * 10;
	//}
	//max = max < 10 ? 10 : max;

	max = calMaxScale(max);



	var sarr = [],
		farr = [],
		oarr = [];
	for (var ind in data) {
		var item = data[ind];
		var sy = item.successful;
		var fy = item.fail;
		var oy = item.other;

		sarr.push(100 - Math.floor(sy*100/max));
		farr.push(100 - Math.floor(fy*100/max));
		oarr.push(100 - Math.floor(oy*100/max));
	}
	var ds = [];
	ds.push(sarr);
	ds.push(farr);
	ds.push(oarr);

	drawLineChart(id, xarr, max, ds, colors);
	showLineScale(id, max);
}
function showLineScale(id, max) {
	var sp = $('#'+id).parent().find('.lc-line-scale');
	sp.empty();
	var av = max/5;
	for (var i = 0; i < 5; i++) {
		sp.append('<i>' + (max-av*i) + '</i>')
	}
}


function calMaxScale(max) {
	var bit = max + '';
	if (bit.length > 2) {
		var len = bit.length - 2;
		max = Math.ceil(max/Math.pow(10, len)) * Math.pow(10, len);
	} else {
		max = Math.ceil(max / 10) * 10;
	}
	max = max < 10 ? 10 : max;
	return max;
}
function drawLineChart(id, xs, my, ds, cs) {
	var split = 5;
	var wid = 320;
	var hei = 140;
	var data = [];
	var sx = 5;
	var sy = 5;
	var gx = wid/(xs.length - 1);
	//var gy = hei/5;
	var gy = hei/split;
	data.push({
		type: 'line',
		lineWidth: 2,
		lineCap: 'butt',
		color: '#919ebc',
		close: false,
		pos: [{
			x: sx,
			y: 0
		}, {
			x: sx,
			y: hei + sy
		}, {
			x: sx + wid + 5,
			y: hei + sy
		}]
	});

	var ps = [];
	for(var i = 0; i < ds.length; i++) {
		ps.push([]);
	}

	for (var i = 1; i < xs.length; i++) {

		var x = xs[i];
		var cx = sx + gx * i;
		data.push({
			type: 'line',
			lineWidth: 1,
			lineCap: 'butt',
			color: '#919ebc',
			close: false,
			pos: [{
				x: cx,
				y: sy+hei
			}, {
				x: cx,
				y: sy+hei-5
			}]
		});
	}

	for (var i = 0; i < split; i++) {
		var cy = sy + i*gy;
		data.push({
			type: 'line',
			lineWidth: 1,
			lineCap: 'butt',
			color: '#919ebc',
			close: false,
			pos: [{
				x: sx,
				y: cy
			}, {
				x: sx+5,
				y: cy
			}]
		});

		/*data.push({
		 type: 'text',
		 color: '#919ebc',
		 text: 8888,
		 x: sx-13,
		 y: cy+5
		 });*/
	}


	for (var i = 0; i < xs.length; i++) {
		var x = xs[i];
		var cx = sx + gx * i;
		for (var j = 0; j < ds.length; j++) {
			var item = ds[j];
			var cy = sy + item[i]*hei/100;
			ps[j].push({
				x: cx,
				y: cy
			});
		}
	}

	for(var i = 0; i < ps.length; i++) {
		data.push({
			type: 'line',
			lineWidth: 1,
			lineCap: 'butt',
			color: cs[i],
			close: false,
			pos: ps[i]
		});

		data.push({
			type: 'point',
			width: 10,
			color: cs[i],
			opacity: 0.5,
			pos: ps[i]
		});
	}

	draw(id, data);
}

function initEvt() {
	//$('div .nav-left-btn').bind('click', function(e) {//左图标
	//	var dom = $('div .nav-left');
	//	dom.is(':hidden') ? dom.show(toggle) : dom.hide(toggle);
	//});

	$('div .nav-right-btn').bind('click', function(e) {//图标
		initStatePanel();
		var dom = $('div .nav-mid-panel');
		dom.show(toggle);
		//dom.is(':hidden') ? dom.show(toggle) : dom.hide(toggle);
	});

	$('.nav-title-close').bind('click', function(e) {
		$('div .nav-mid-panel').hide();
	});

	$('#nav_left_func_warn').bind('click', function(e) {
//		leftPanelShow(1);
		selectWarn();
		funcTabSelectCss(1);
	});

	$('#nav_left_func_flow').bind('click', function(e) {
		leftPanelShow(2);
		funcTabSelectCss(2);
	});

	$('#nav_left_func_detail').bind('click', function(e) {
//		leftPanelShow(3);
		selectHandlDetail();
		funcTabSelectCss(3);
	});

	$('.nav-left-area-title').bind('click', function(e) {
		var title = $(this).text();

		switch(title) {
			case 'Tuxedo':
				leftPanelShow(1);
				break;
			case 'Oracle':
				leftPanelShow(4);
				break;
			case 'Intf':
				leftPanelShow(5);
				break;
			default:
				leftPanelShow(1);
				break;
		}
	});

	$('.nav-left-area-arrow').bind('click', function(e) {
		curInd++;
		curInd = curInd >= warnData.length ? (curInd - warnData.length) : curInd;
		$('#lc_tab').css({'margin-left': '0px'});
		initTab();
		$('#lc_tab').animate({'margin-left': '-90px'}, 'fast');
	});



	$('.nav-top-close').bind('click', function(e) {
		$('.nav-top').hide();
	})
}

function funcTabSelectCss(ind) {
	var fun = ['nav_left_func_warn', 'nav_left_func_flow', 'nav_left_func_detail'];
	for (var i = 1; i < 4; i++) {
		if (ind == i) $('#' + fun[i-1]).css({'background-color': '#55b45f'});
		else $('#' + fun[i-1]).css({'background-color': '#404757'});
	}
}

function leftPanelShow(ind) {
	for(var i = 0; i < 6; i++) {
		var dom = $('div .nav-left-content-' + i);
		ind == i ? dom.show() : dom.hide();
	}
}

function drawState() {
	var canvas = document.getElementById('can_state_1');
	context = canvas.getContext('2d');
	context.beginPath();
// 	context.arc(50, 50, 50, 0, Math.PI * 2, true);
//	//不关闭路径路径会一直保留下去，当然也可以利用这个特点做出意想不到的效果
//	context.fillStyle = 'rgba(0,255,0,0.25)';
//	context.fill();
//	context.closePath();
//	context.arc(50, 50, 40, 0, Math.PI * 2, true);
//	context.lineWidth = 10;
//	context.fillStyle = 'rgba(90, 99, 120, 1)';
//	context.stroke();
//	context.closePath();

	context.beginPath();
	context.arc(50, 50, 45, Math.PI * 1.5, Math.PI * 1, false);
	context.lineWidth = 10;
	var canvasGradient = context.createLinearGradient(0, 0, 100, 100);
	//在offset为0的位置(即起点位置)添加一个蓝色的渐变
	canvasGradient.addColorStop(0, "red");
	//在offset为0.2的位置(线段左起20%的位置)添加一个绿色的渐变
	canvasGradient.addColorStop(0.2, "green");
	//在offset为0的位置(即终点位置)添加一个红色的渐变
	canvasGradient.addColorStop(1, "blue");
	//将strokeStyle的属性值设为该CanvasGradient对象
	context.strokeStyle = 'rgba(0, 255, 0, 0.8)';
	context.stroke();
	context.closePath();
}

function test2() {
	var canvas = document.getElementById('can_state_1');
	ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.arc(50,50,42,0,Math.PI*2, true);
	ctx.lineWidth=10;
	var canvasGradient = ctx.createLinearGradient(50, 50, 250, 50);
	//在offset为0的位置(即起点位置)添加一个蓝色的渐变
	canvasGradient.addColorStop(0, "blue");
	//在offset为0.2的位置(线段左起20%的位置)添加一个绿色的渐变
	canvasGradient.addColorStop(0.2, "green");
	//在offset为0的位置(即终点位置)添加一个红色的渐变
	canvasGradient.addColorStop(1, "red");
	//将strokeStyle的属性值设为该CanvasGradient对象
	ctx.strokeStyle = canvasGradient;
	ctx.stroke();//画空心圆
	ctx.closePath();
}

function drawItfFailure() {
	var data = [{
		type: 'line',
		lineWidth: 2,
		lineCap: 'butt',
		color: '#919ebc',
		close: false,
		pos: [{
			x: 1,
			y: 10
		}, {
			x: 1,
			y: 140
		}, {
			x: 330,
			y: 140
		}]
	}, {
		type: 'line',
		lineWidth: 2,
		color: '#fa6a6b',
		opacity: 0.4,
		pos: [{
			x: 20,
			y: 120
		}, {
			x: 140,
			y: 80
		}, {
			x: 260,
			y: 70
		}, {
			x: 380,
			y: 40
		}, {
			x: 500,
			y: 10
		}]
	}, {
		type: 'point',
		width: 20,
		color: '#19e64d',
		opacity: 0.5,
		pos: [{
			x: 20,
			y: 120
		}, {
			x: 70,
			y: 80
		}, {
			x: 120,
			y: 70
		}, {
			x: 170,
			y: 40
		}, {
			x: 280,
			y: 10
		}]
	}/*, {
	 type: 'circle',
	 centerX: 150,
	 centerY: 100,
	 radius: 50,
	 color: 'blue'
	 }, {
	 type: 'arc',
	 centerX: 100,
	 centerY: 100,
	 radius: 50,
	 start: 0,
	 end: Math.PI * 1.5,
	 cw: true,
	 color: 'green'
	 }*/];

	draw('can_itf_failure', data);
}

function drawHandleFlow(status) {
	var radius = 44;
	var radiusAdd = 8;
	var op = 0.9;
	var opDel = 0.3;
	var pos = [{
		x: 100,
		y: 80
	}, {
		x: 264,
		y: 214
	}, {
		x: 100,
		y: 348
	}, {
		x: 264,
		y: 482
	}];
	var colors = ['#a28ddf', '#d25c60', '#56c0d6', '#55b45f'];

	var flowData = [];
	var slx = null,
		sly = null;
	for (var i = 0; i < 4; i++) {
		var point = pos[i];
		var color = colors[i];
		for (var j = 3; j > 0; j--) {
			var po = {
				type: 'arc',
				lineWidth: j,
				centerX: point.x,
				centerY: point.y,
				radius: radius + (3-j) * radiusAdd,
				start: 0,
				end: Math.PI * 2,
				color: color,
				opacity: op - (3-j) * opDel
			};
			flowData.push(po);
		}

		if (status == (i+1)+'') {
			flowData.push({
				type: 'circle',
				centerX: point.x,
				centerY: point.y,
				radius: radius,
				color: color,
				opacity: op
			});
		}

		if (slx == null || sly == null) {
			slx = point.x;
			sly = point.y;
		} else {
			var ang = angle(
				{
					x: slx,
					y: sly
				}, {
					x: point.x,
					y: point.y
				}
			);
			var offx = Math.abs((radius + radiusAdd + 2) * Math.cos(ang));
			var offy = Math.abs((radius + radiusAdd + 2) * Math.sin(ang));
			var start = {
				x: slx + ((point.x - slx) > 0 ? 1 : -1) * offx,
				y: sly + ((point.y - sly) > 0 ? 1 : -1) * offy
			};
			var end = {
				x: point.x - ((point.x - slx) > 0 ? 1 : -1) * offx,
				y: point.y - ((point.y - sly) > 0 ? 1 : -1) * offy
			}
			var lo = {
				type: 'line',
				lineWidth: 2,
				color: color,
				opacity: 0.4,
				pos: [start, end]
			};
			slx = point.x;
			sly = point.y;
			flowData.push(lo);
		}
	}

	draw('can_handle_flow', flowData);
}

function draw(id, data) {
	var canvas = document.getElementById(id);
	canvas.width = canvas.width;
	var ctx = canvas.getContext('2d');
	for (var ind in data) {
		var item = data[ind];
		drawBase(ctx, item.type, item);
	}
}

function drawBase(ctx, type, data) {
	if (data.opacity != null && data.color.charAt(0) == '#') {
		data.color =  hex2rgb(data.color.substr(1), data.opacity);
	}
	switch (type) {

		case 'text':
			drawText(ctx, data);
		case 'line':
			drawLine(ctx, data);
			break;
		case 'circle':
			drawCircle(ctx, data);
			break;
		case 'point':
			drawPoint(ctx, data);
			break;
		case 'arc':
			drawArc(ctx, data);
			break;
		case 'arcseg':
			drawArcSeg(ctx, data);
			break;
		default:
			break;
	}


}

function drawText(ctx, data) {
	ctx.fillText(data.text, data.x, data.y);
	ctx.fillStyle = data.color;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
}

function drawLine(ctx, data) {
	ctx.beginPath();
	ctx.lineWidth = data.lineWidth;
	ctx.lineCap = data.lineCap;
	ctx.strokeStyle = data.color;
	var num = 0;
	for (var ind in data.pos) {
		var pos = data.pos[ind];
		if (ind++ <= 0) ctx.moveTo(pos.x, pos.y);
		else ctx.lineTo(pos.x, pos.y);
	}
	if (data.close) {
		ctx.closePath();
	}
	ctx.stroke();
}

function drawCircle(ctx, data) {
	ctx.beginPath();
	ctx.arc(data.centerX, data.centerY, data.radius, 0, Math.PI * 2, false);
	ctx.fillStyle = data.color;
	ctx.fill();
	ctx.closePath();
}

function drawPoint(ctx, data) {
	var radius = data.width / 2;
	for (var ind in data.pos) {
		ctx.beginPath();
		ctx.fillStyle = data.color;
		var pos = data.pos[ind];
		ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.closePath();
	}
}

function drawArc(ctx, data) {
	ctx.beginPath();
	ctx.lineWidth = data.lineWidth;
	ctx.strokeStyle = data.color;
	ctx.arc(data.centerX, data.centerY, data.radius, data.start, data.end, !data.cw);
	ctx.stroke();
}

function drawArcSeg(ctx, data) {
	ctx.lineWidth = data.lineWidth;
	var segs = data.segments;
	for (var ind in segs) {
		var seg = segs[ind];
		ctx.beginPath();
		ctx.strokeStyle = seg.color;
		ctx.arc(data.centerX, data.centerY, data.radius, seg.start, seg.end, false);
		ctx.stroke();
	}
}

function angle(start, end) {
	var gx = end.x - start.x;
	var gy = end.y - start.y;
	return Math.atan(gy / gx);
}

function hex2rgb(h, o) {
	var r = parseInt(h.substr(0, 2), 16);
	var g = parseInt(h.substr(2, 2), 16);
	var b = parseInt(h.substr(4, 2), 16);
	return 'rgba(' + r + ', ' + g + ', ' + b + ',' +  o + ')';
}

