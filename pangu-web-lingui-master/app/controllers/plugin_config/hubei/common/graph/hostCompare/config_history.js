var scopeNames = {'day':'日', 'month':'月', 'year':'年'}

exports.config = {
    TuxStateCalledSumByTimeByHostAt25_41_tuxapp: {
        name: '134.200.25.41',
        scopes: ['day'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false},host: '134.200.25.41_tuxapp'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },
	TuxStateCalledSumByTimeByHostAt248_50_tuxapp: {
		name: '130.71.248.50',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false},host: '130.71.248.50_tuxapp'},
		color: "#ef705b",
		filterColNames: [],
		sort: {'hours' : 1}
	},
    TuxStateCalledSumByTimeByHostAt25_40_tuxapp: {
		name: '134.200.25.40',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false},host: '134.200.25.40_tuxapp'},
		color: "#8B2323",
		filterColNames: [],
		sort: {'hours' : 1}
	},
	TuxStateCalledSumByTimeByHostAt248_35_tuxapp: {
		name: '130.71.248.35',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false},host: '130.71.248.35_tuxapp'},
		color: "#4bb0ce",
		filterColNames: [],
		sort: {'hours' : 1}
	},
	TuxStateCalledSumByTimeByHostAt248_36_tuxapp: {
		name: '130.71.248.36',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false},host: '130.71.248.36_tuxapp'},
		color: "#FFB5C5",
		filterColNames: [],
		sort: {'hours' : 1}
	},
	TuxStateCalledSumByTimeByHostAt248_37_tuxapp: {
		name: '130.71.248.37',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false},host: '130.71.248.37_tuxapp'},
		color: "#BDB76B",
		filterColNames: [],
		sort: {'hours' : 1}
	},
	TuxStateCalledSumByTimeByHostAt248_38_tuxapp: {
		name: '130.71.248.38',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false},host: '130.71.248.38_tuxapp'},
		color: "#C6E2FF",
		filterColNames: [],
		sort: {'hours' : 1}
	},

	TuxStateCalledSumByTimeByHostAt25_37_tuxapp: {
		name: '134.200.25.37',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false}, host:'134.200.25.37_tuxapp'},
		color: "#ef705b",
		filterColNames: [],
		sort: {'hours' : 1}
	},

	TuxStateCalledSumByTimeByHostAt25_38_tuxapp: {
		name: '134.200.25.38',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ], 
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false}, host:'134.200.25.38_tuxapp'},
		color: "#4bb0ce",
		filterColNames: [],
		sort: {'hours' : 1}
	},

	TuxStateCalledSumByTimeByHostAt25_42_tuxapp: {
		name: '134.200.25.42',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false}, host:'134.200.25.42_tuxapp'},
		color: "#FFB5C5",
		filterColNames: [],
		sort: {'hours' : 1}
	},

	TuxStateCalledSumByTimeByHostAt25_43_tuxapp: {
		name: '134.200.25.43',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false}, host:'134.200.25.43_tuxapp'},
		color: "#8B2323",
		filterColNames: [],
		sort: {'hours' : 1}
	},

	TuxStateCalledSumByTimeByHostAt25_44_tuxapp: {
		name: '134.200.25.43',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false}, host:'134.200.25.44_tuxapp'},
		color: "#BDB76B",
		filterColNames: [],
		sort: {'hours' : 1}
	},


	TuxStateCalledSumByTimeByHostAt248_39_tuxapp: {
		name: '130.71.248.39',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false}, host:'130.71.248.39_tuxapp'},
		color: "#CD950C",
		filterColNames: [],
		sort: {'hours' : 1}
	},


	TuxStateCalledSumByTimeByHostAt248_40_tuxapp: {
		name: '130.71.248.40',
		scopes: ['day'],
		scopeNames: scopeNames,
		colNames : [ 'hours', '_count' ],
		filter: {SVRNAME: {$exists: false}, TRANSCODE:{$exists:false}, host:'130.71.248.40_tuxapp'},
		color: "#90EE90",
		filterColNames: [],
		sort: {'hours' : 1}
	},

    //域1
    spt_bh_oracleSession_hourAtactdb_i1_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i1'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },

    //域2
    spt_bh_oracleSession_hourAtactdb_i2_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i2'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },

    //域3
    spt_bh_oracleSession_hourAtactdb_i3_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i3'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },

    //域4
    spt_bh_oracleSession_hourAtactdb_i4_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i4'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },

    //域5
    spt_bh_oracleSession_hourAtactdb_i5_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i5'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },

    //域6
    spt_bh_oracleSession_hourAtactdb_i6_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i6'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },


    //域7
    spt_bh_oracleSession_hourAtactdb_i7_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i7'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },

    //域8
    spt_bh_oracleSession_hourAtactdb_i8_keyword1: {
        name: 'CBSS_账管生产库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_actdb_i8'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },


    //中心库
    spt_bh_oracleSession_hourAtcendb_i1_keyword1: {
        name: '中心1库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_cendb_i1'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    },


    //统计库
    spt_bh_oracleSession_hourAtstatdb_i1_keyword1: {
        name: '统计1库实例1',
        scopes: ['suffix'],
        scopeNames: scopeNames,
        colNames : [ 'hours', '_count' ],
        filter: {keyword:'1',db_id:'cbss_statdb_i1'},
        color: "#8B2323",
        filterColNames: [],
        sort: {'hours' : 1}
    }
};

exports.list = {
    

	historyLcuSumCompareChart:[
		[
			{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At25_41_tuxapp',hostName: 'VC一卡充主机调用数(日)'}
		]
        ,
		[
			{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At25_40_tuxapp',hostName: '4G全业务主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At248_50_tuxapp',hostName: '4G全业务主机调用数(日)'}
		]
		,
		[
			{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At248_35_tuxapp',hostName: 'BSS前台主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At248_36_tuxapp',hostName: 'BSS前台主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At248_37_tuxapp',hostName: 'BSS前台主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At248_38_tuxapp',hostName: 'BSS前台主机调用数(日)'}
		]
		,
		[
			{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At25_37_tuxapp',hostName: 'ECS主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At25_38_tuxapp',hostName: 'ECS主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At25_42_tuxapp',hostName: 'ECS主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At25_43_tuxapp',hostName: 'ECS主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At25_44_tuxapp',hostName: 'ECS主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At248_39_tuxapp',hostName: 'ECS主机调用数(日)'}
			,{mode:'TuxState',type:'CalledSumByTimeByHost', subtype: 'At248_40_tuxapp',hostName: 'ECS主机调用数(日)'}
		]
	],

    historyDataBaseCompareChart:[

        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i1_keyword1',hostName: '1域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i2_keyword1',hostName: '2域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i3_keyword1',hostName: '3域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i4_keyword1',hostName: '4域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i5_keyword1',hostName: '5域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i6_keyword1',hostName: '6域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i7_keyword1',hostName: '7域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atactdb_i8_keyword1',hostName: '8域数据库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atcendb_i1_keyword1',hostName: '中心库压力轨迹'}
        ],
        [   {mode:'spt',type:'_bh_oracleSession_hour', subtype: 'Atstatdb_i1_keyword1',hostName: '统计库压力轨迹'}
        ]

    ]
};

exports.moduleName = {
    historyLcuSumCompareChart:'主机对比曲线图',
    historyDataBaseCompareChart:'数据库活动会话数监控'
};