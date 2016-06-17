var scopeNames = {'day':'分省统计-日', 'month':'单台主机-月', 'year':'年'}


//柱状图配置
exports.barConfig = {

    spt_bh_rspcode_: {
        name: '应答状态统计',
        displayType:'bar',
        scopes: [''],
        scopeNames: scopeNames,
        colNames : {_id:0,rsp_code:1},
        filterColNames: ['date_time'],
        tabColNames: ["省份", "返回状态","时间"],
        statType:'LCU',
        sort: {'date_time' : 1},
        schemaName: "QueryResult"
    }
}

exports.barList = {

    interfaceRspCodeCountList:[ {mode:'spt_', type:'bh_',subtype:'rspcode_'}]
}



