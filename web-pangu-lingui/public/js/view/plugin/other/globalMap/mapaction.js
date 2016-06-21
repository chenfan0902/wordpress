function myFun() {
	init();
    //var relation_ids='20141207220600181916.52847113126'
    setInterval("init()", 60000);
	$('div .nav-left-btn').bind('click', function(e) {//左图标
		var dom = $('div .nav-left');
		dom.is(':hidden') ? dom.show(toggle) : dom.hide(toggle);
	});

}