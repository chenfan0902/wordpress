exports.trade = {
    trade4G: [{mode: 'Tux', type: 'Trade4G', subtype: 'Base'}],
    trade4GList: [{mode: 'Tux', type: 'Trade4G', subtype: 'ListDAY'}],
    selType: ['REQUSET_CODE', 'REQUSET_DESC'],
    operate: ['all', 'checkUserTransfer', 'checkUserTransFixedfer'],
    tabColNames_CODE: ['REQUSET_CODE', '出现次数', '占比(%)'],
    tabColNames_DESC: ['REQUSET_DESC', '出现次数', '占比(%)'],
    hosts: ['all','134.32.28.127','134.32.28.129'],
    codeAddDesc: [ {1202: '1202 [欠费号码（不包含实时欠费）]', 1203: '1203 [该用户是黑名单用户]', 1204: '1204 [号码不存在]',
        1205: '1205 [密码错误（服务密码错误或初始密码错误）]', 1303: '1303 [用户为集团成员]', 1307: '1307 [用户在协议期内]',
        1309: '1309 [融合业务未退订]', 1490: '1490 [必须先解散亲情关系]', 1493: '1493 [当前用户存在在途工单]',
        1540: '1540 [当前用户已处于停机状态（紧急停机、停机保号、违章停机）]', 1014: '1014 [客户信息不完整]', 1024: '1024 [老客户证件不合规]',
        1025: '1025 [身份证件需要升位]', 1026: '1026 [客户资料未返档]', 1542: '1542 [用户存在预约业务]', 1543: '1543 [合帐用户不能办理]',
        1546: '1546 [有代付关系的用户不准办理此业务]', 1547: '1547 [“用户有包年附加产品或资费”不允许受理]', 1607: '1607 [用户存在同振/顺振]',
        1608: '1608 [用户存在同号]', 1609: '1609 [不允许跨本地网受理迁移]', 1610: '1610 [宽带与IPTV/联网电视需要合帐]',
        1612: '1612 [IPTV和宽带必须同客户]', 1613: '1613 [融合成员必须同客户]', 1614: '1614 [移网最多10部，固话和宽带最多各一部]',
        1615: '1615 [不允许跨服务区受理迁移业务]', 1616: '1616 [融合内成员与该融合外用户存在共线关系不允许迁转]',
        1617: '1617 [省分迁转的固网号码必须带区号]', 1406: '1406 [该用户在锁定期或充值期内]', 1600: '1600 [用户存在续约未生效合约]',
        1601: '1601 [该用户为上网卡用户，不能转4G。]', 1602: '1602 [该用户为行业应用用户，不能转4G。]', 1603: '1603 [当前用户合约不能转4G]',
        1604: '1604 [携号转网用户不能办理23转4业务。]', 1611: '1611 [用户存在合约计划不允许转入智慧沃家共享版]',
        8888: '8888 [其它错误]'}]
}