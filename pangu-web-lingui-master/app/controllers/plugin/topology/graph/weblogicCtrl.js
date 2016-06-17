var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var mutil = require('../../../util');
var db = require('../../../connectFactory').getConnection('tuxedoDb')
    , logger = require('../../../log').logger
    , extend = require('extend')
    , query = require('../../../dbQuery')
    , async = require('async')
    , aConfig = require('../../../plugin_config/'+sysConfig.province+'/topology/graph/netTopologyGraph/config_net_topology').config
    , alConfig = require('../../../plugin_config/'+sysConfig.province+'/topology/graph/netTopologyGraph/config_net_topology')
    , aList = require('../../../plugin_config/'+sysConfig.province+'/topology/graph/netTopologyGraph/config_net_topology').list;
var auth = require('../../../auth');

module.exports = function (app) {
    app.get('/topology/graph/webLogic.html', auth.requiresLogin, function(req, res){
        var date = req.query['date'] || mutil.formatDate(null, 'yyyy-MM-dd'),
            chartList = req.query["chartList"],
            chart_list = aList[chartList][0],
            cConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype];
       
                res.renderPjax('plugin/topology/graph/weblogic',{
                    value: date,
                    chartList: chartList,
                    title: cConfig["title"]
                });
              
   }); 
   

    app.get('/getNTGNodes', function(req, res){
        var chartList = req.query["chartList"],
            chart_list = aList[chartList][0],
            cConfig = aConfig[chart_list.mode+chart_list.type+chart_list.subtype],
            result = {};
        if(typeof cConfig["nodesName"] === "string"){
            res.send(alConfig[cConfig["nodesName"]]);
        }else {
            for (var key in cConfig["nodesName"]) {
                result[key] = alConfig[cConfig["nodesName"][key]];
            }
            //logger.debug(result)
            res.send(result);
        }
    });
		};
 
