var env = process.env.NODE_ENV || 'development';
var sysConfig = require('../../../../../config/config')[env];
var db = require('../../../connectFactory').getConnection('tuxedoDb')
    , logger = require('../../../log').logger
    , extend = require('extend')
    , query = require('../../../dbQuery')
    , async = require('async')
    , aConfig = require('../../../plugin_config/'+sysConfig.province+'/topology/netTreeGraph/config_nettreegraph');
var auth = require('../../../auth');

module.exports = function (app) {

    app.get('/topology/graph/tree.html', auth.requiresLogin, function(req, res){
        var date = req.query.date || "2015-05-19";
        res.renderPjax('plugin/topology/graph/tree',{
            value: date
        });
    });

    app.get('/getNetTreeNodes', function(req, res){
        res.send({nodes: aConfig.nodes, commonNode: aConfig.commonNode});
    });

};