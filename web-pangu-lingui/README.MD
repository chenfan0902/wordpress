### 启动命令
输出测试信息:

    npm start

不输出测试信息:

    node web_server.js

后台运行:

    nohup node web_server.js &

默认端口为3000, 指定端口用`-p, --port`参数, 如:

    nohup node web_server.js -p 3002 &    
    nohup node web_server.js --port 3002 &

rsWeb3002:  ./scripts/rsWebServe 3002
rsWeb3003: ./scripts/rsWebServe 3003
rsallweb: >nohup.out;npm run rsWeb3002 & npm run rsWeb3003
stopweb3002: ./scripts/stopWebServe 3002
stopweb3003: ./scripts/stopWebServe 3003
stopallweb: npm run stopweb3002 & npm run stopweb3003


### 节点信息采集权限添加

登录`fl-tux`用户，运行如下命令连接mongodb集群：

    mongo localhost:27200/admin -u flAdminRoot -p fladminroot123

继续如下命令：

    use cmddb
    db.userCommandRole.update({"role" : "TuxLcuPointOperateCMD"},{$push: {user_name: '用户名'}})   //给指定用户添加权限
    db.userCommandRole.update({"role" : "TuxLcuPointOperateCMD"},{$pop: {user_name: '用户名'}})    //删除指定用户的权限

默认是可操作所有主机，可以对host字段进行添加、删除和修改，已达到限制信息采集权限。

记录格式如下所示：

    {
        "_id" : ObjectId("56176745378b7b5f2f9ac432"),
        "user_name" : [ "admin", "phoenix" ],
        "role" : "TuxLcuPointOperateCMD",
        "host" : [ "*" ]
    }