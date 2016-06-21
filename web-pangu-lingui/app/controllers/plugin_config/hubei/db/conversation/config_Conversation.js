var scopeNames = {'day':'日', 'month':'月', 'year':'年'}

exports.config = {



	DbStateBaseAtTest1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i1'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTest2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp','ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_bildb_i1'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTest3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i1'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTest4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i1'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestA1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i2'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestA2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_bildb_i2'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}
	},
	DbStateBaseAtTestA3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i2'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestA4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i2'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestB1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i3'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestB2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_bildb_i3'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}
	},
	DbStateBaseAtTestB3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i3'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestB4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i3'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestC1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i4'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestC2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_bildb_i4'},
		color: "000000",
		filterColNames: [],
		sort: {'timestamp': 1},
	},
	DbStateBaseAtTestC3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i4'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestC4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i4'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestD1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i5'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestD2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_bildb_i5'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}
	},
	DbStateBaseAtTestD3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i5'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestD4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i5'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestE1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i6'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestE2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_bildb_i6'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}
	},
	DbStateBaseAtTestE3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i6'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestE4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i6'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestF1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i7'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestF2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_bildb_i7'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}
	},
	DbStateBaseAtTestF3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i7'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestF4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i7'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestG1: {
		name: '账管生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_actdb_i8'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestG2: {
		name: '计费生产实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_bildb_i8'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}
	},
	DbStateBaseAtTestG3: {
		name: '营业生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_crmdb_i8'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestG4: {
		name: '生产库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_essdb_i8'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestH1: {
		name: '中心库压力实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames : [ 'timestamp', 'ACTIVE' ],
		filter: {name:'actSession',connect:'fl_spt@cbss_cendb_i1'},
		color: "#90EE90",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp' : 1}
	},
	DbStateBaseAtTestH2: {
		name: '统计库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_statdb_i1'},
		color: "000000",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}
	},
	DbStateBaseAtTestI1: {
		name: '中心库压力实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_cendb_i2'},
		color: "#ef705b",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	},
	DbStateBaseAtTestI2: {
		name: '统计库实例',
		scopes: ['fullSuffix'],
		scopeNames: scopeNames,
		colNames: ['timestamp', 'ACTIVE'],
		filter: {name: 'actSession', connect: 'fl_spt@cbss_statdb_i2'},
		color: "#8B2323",
		filterColNames: [],
        dbCon:"databaseDb",
        model:"dbQueryResult",
		sort: {'timestamp': 1}

	}
}

exports.list = {

	dbCompareList:[
		[   {mode:'DbState', type:'Base', subtype: 'AtTest1',hostName: '生产库1域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTest2',hostName: '生产库1域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTest3',hostName: '生产库1域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTest4',hostName: '生产库1域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestA1',hostName: '生产库2域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestA2',hostName: '生产库2域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestA3',hostName: '生产库2域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestA4',hostName: '生产库2域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestB1',hostName: '生产库3域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestB2',hostName: '生产库3域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestB3',hostName: '生产库3域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestB4',hostName: '生产库3域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestC1',hostName: '生产库4域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestC2',hostName: '生产库4域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestC3',hostName: '生产库4域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestC4',hostName: '生产库4域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestD1',hostName: '生产库5域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestD2',hostName: '生产库5域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestD3',hostName: '生产库5域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestD4',hostName: '生产库5域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestE1',hostName: '生产库6域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestE2',hostName: '生产库6域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestE3',hostName: '生产库6域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestE4',hostName: '生产库6域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestF1',hostName: '生产库7域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestF2',hostName: '生产库7域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestF3',hostName: '生产库7域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestF4',hostName: '生产库7域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestG1',hostName: '生产库8域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestG2',hostName: '生产库8域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestG3',hostName: '生产库8域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestG4',hostName: '生产库8域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestH1',hostName: '中心1域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestH2',hostName: '中心1域活动会话'}
		],
		[   {mode:'DbState', type:'Base', subtype: 'AtTestI1',hostName: '中心2域活动会话'},
			{mode:'DbState', type:'Base', subtype: 'AtTestI2',hostName: '中心2域活动会话'}
		]
	]
}

exports.moduleName = {
	historyLcuSumCompareChart:'主机对比曲线图',
	historyDataBaseCompareChart:'数据库活动会话数监控',
	dbCompareList:'生产库1域活动会话'
}