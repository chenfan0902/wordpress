var express = require('express');
//var mongoose = require('mongoose');
var ejs = require('ejs');
var app = express();
var webCtrl = require('./controllers/webSampleTestCtrl');



app.use(express.static(__dirname + '/public'));

// set views path, template engine and default layout
app.engine('html', ejs.__express);
app.set('view engine', 'html');


// route
app.get('/', webCtrl.index);
//app.get('/index.html', webCtrl.index);
app.get('/list', webCtrl.list);
//app.get('/borrow.html', webCtrl.borrowlist);
//app.get('/borrow', webCtrl.borrow);
//app.get('/returning.html', webCtrl.returning);
//app.get('/returning', webCtrl.returning); //add by chenyq
app.get('/bookdateUpdate', webCtrl.update);
app.get('/bookdateRemove', webCtrl.remove);
app.get('/bookdateInsert', webCtrl.insert);
//app.get('/register', webCtrl.register);
//app.get('/register1', function(req,res){
	//res.sendfile( __dirname + "/views/" + "register.html" )
//});
//app.get('/login', webCtrl.login);
//app.get('/login1', function(req,res){
	//res.sendfile( __dirname + "/views/" + "login1.html" )
//});
app.listen(3000);
