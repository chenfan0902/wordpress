exports.detailConfig = {

	interfaceOutMag : {
		name: '接口迁出管理',
		scopes: ['day'],
		delayTime:1000*60*60,
		displayLength:10,
		titles: ['ID','省份', '状态', 'ErroCode', '时间'],
		sort: {'MAX':-1}
	}
}

exports.detailList = {
	interfaceOutMagList:[ {mode:'interface', type:'OutMag',subtype:''}]
}
