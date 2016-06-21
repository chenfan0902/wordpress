var models = require('../models/user');
var User = models.User;
var crypto = require('crypto');
var check = require('validator').check,sanitize = require('validator').sanitize;
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var async = require('async');
var util = require('../libs/utils');
var gridfs = require('./gridfs');
var menu = require('./menu');
//var prov = require('./config_multi').province;
//var provCode = require('./config_multi').provinceCode;

var db = require('./connectFactory').getConnection('cmdDb');


exports.registeUser = function(req, res, next){
	var user_name = sanitize(req.body.user_name).trim();
	user_name = sanitize(user_name).xss();
	var password = sanitize(req.body.password).trim();
	password = sanitize(password).xss();
	var email = sanitize(req.body.email).trim();
	email = sanitize(email).xss();
	var phone = sanitize(req.body.phone).trim();
	phone = sanitize(phone).xss();

	var nick_name = sanitize(req.body.nick_name).trim();
	nick_name = sanitize(nick_name).xss();

	//var provinceCode = sanitize(req.body.provinceCode).trim();
	//provinceCode = sanitize(provinceCode).xss();

	//验证用户名
	try{
		check(user_name, '用户名只能使用字母和数字').isAlphanumeric();
	}catch(e){
		req.flash('error', '用户名只能使用字母和数字！')
		res.redirect('/register');
		return;
	}

	//验证电子邮箱
	try{
		check(email, '不正确的电子邮箱').isEmail();
	}catch(e){
		req.flash('error', '不正确的电子邮箱！')
		res.redirect('/register');
		return;
	}

	User.findOne({'user_name': user_name}, function(err, userRow){
		if(err) return next(err);
		if(userRow){
			req.flash('error', '用户名已被使用,请重新输入！')
			res.redirect('/register');
			return;
		}

		password = md5(password);
		user = new User();
		user.user_name = user_name;
		user.nick_name = nick_name;
		user.password = password;
		user.phone = phone;
		user.email = email;
		//user.provinceCode = provinceCode;
		user.create_time = Date.now();
		user.update_time = Date.now();
		if(config.admins[user_name]){
			user.audit_tag = 1;
			user.is_admin = true;
		}

		user.save(function(err){
			if(err) return next(err);
			gen_session(user, req, res,1);
            var file =  req.files && req.files.uploadfile;
            if (file.name != '') {
                gridfs.putFile(req, user_name, function () {
                    if (user.is_admin)
                        return res.redirect('/login.html');
                    else {
                        req.flash('error', '注册用户管理员审核通过后可以登录！');
                        return res.redirect('/login.html');
                    }
                });
            }else{
                if (user.is_admin)
                    return res.redirect('/login.html');
                else {
                    req.flash('error', '注册用户管理员审核通过后可以登录！');
                    return res.redirect('/login.html');
                }
            }
		});
	});
}


function md5(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}

//设置缓存函数
function gen_session(user, req, res,ck_rmbUser){
	if(ck_rmbUser == 1){
		var auth_token = encrypt(user.user_name + '\t' + user.password + '\t' + user.email+
		'\t' +user.phone, config.session_secret);/* + '\t' + user.provinceCode*/
		res.cookie(config.auth_cookie_name, auth_token, {path: '/',maxAge: 1000 * 60 * 60*24*7}); //cookie
	}else{
		res.cookie(config.auth_cookie_name, auth_token, {path: '/',maxAge: 0}); //cookie
	}

	if(config.admins[user.user_name]){
		user.is_admin = true;
	}else{
		user.is_admin = false;
	}
	req.session.user = user;
	req.session.hasAuth = true;
	//req.session.cookie.maxAge = 1000 * 60 * 60;
}


function encrypt(str, secret){
	var cipher = crypto.createCipher('aes192', secret);
	var enc = cipher.update(str, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
}

function decrypt(str, secret){
	var decipher = crypto.createDecipher('aes192', secret);
	var dec = decipher.update(str, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

exports.authUser = function(req, res, next){
	var userName = req.body.regular;
	var pass =  md5(req.body.pass);
	var ck_rmbUser = req.params.checkrmUser;

	User.findOne({'user_name': userName}, function(err, userRow){
		if(err) return next(err);
		if(userRow){
			if(userRow.password != pass && userRow.password != req.body.pass){
				req.flash('error', '用户密码不正确！')
				res.redirect('/login.html');
				return;
			}
			else if(userRow.audit_tag == 0 && !config.admins[userRow.user_name]){
				req.flash('error', '注册用户未经过管理员审核无法登录！');
				res.redirect('/login.html');
				return;
			}
			if(ck_rmbUser == "1")
				gen_session(userRow, req, res,1);
			else
				gen_session(userRow, req, res,0);

			next();
		}else{
			req.flash('error', '用户不存在！')
			res.redirect('/login.html');
		}

	});
}


exports.auditUser = function(req, res){

	if (!req.session || req.session.hasAuth != true) {
		req.flash('error', '管理员需先登录后才能审核！')
		return	res.redirect('/login.html');
	}else{
		if(!req.session.user.is_admin){
			req.flash('error', '只有管理员有审核权限！')
			return res.redirect('/');
		}
	}

	var render = function(users){


		res.render('user/AuditUser',{
			layout: false,
			users: users,
			//province: prov,
			//provinceCode: provCode,
			errors: req.flash('error')
		});
	}
	async.parallel({
		users: function(callback){
			var Ruser = [];
			User.find({'audit_tag':0}, {},function(err, userRow){
				if(err) return next(err);
				if(userRow){
					for (var property in userRow){
						var destination = {};
						for (var key in userRow[property]) {
							destination[key] = (userRow[property])[key];
						}
						destination.create_time = util.format_date(destination.create_time);
						Ruser.push(destination);
					}
					callback(err, Ruser);
				}
			});
		}
	}, function(err, results){
		if(err){
			logger.error(err)
		}
		render(results.users)
	})
}




exports.audit = function(req, res){

	var checkValue = req.params.checkValue.split(",");
	for (var i=0;i<checkValue.length ;i++ )
	{
		if('' != checkValue[i]) {
			//var arr = checkValue[i].split('`');
			var up = {
				audit_tag: 1/*,
				provinceCode: arr[1]*/
			}
			User.update({user_name:checkValue[i]},{$set:up},function(err){
				if(err) return next(err);
			});
		}
	}
	res.redirect('/auditUser');
}


exports.editUser = function(req, res, next){

	var method = req.method.toLowerCase();
	if(method == 'get'){
		res.render('user/edituser',{
			layout: false,
			current_user:req.session.user,
			errors: req.flash('error'),
			//provinceCode: provCode,
			Prompts: req.flash('Prompt')
		})

	}
	else if(method == 'post'){

		var user_name = sanitize(req.body.user_name).trim();
		user_name = sanitize(user_name).xss();

		var email = sanitize(req.body.email).trim();
		email = sanitize(email).xss();

		var phone = sanitize(req.body.phone).trim();
		phone = sanitize(phone).xss();

		var nick_name = sanitize(req.body.nick_name).trim();
		nick_name = sanitize(nick_name).xss();

		//var provinceCode = sanitize(req.body.provinceCode).trim();
		//provinceCode = sanitize(provinceCode).xss();


		var user = req.session.user;
		var file =  req.files && req.files.uploadfile;
		if(email==user.email && phone==user.phone && nick_name==user.nick_name && file.name ==''){/* && provinceCode == user.provinceCode */
			req.flash('error', '您没有修改任何资料！');
			return res.redirect('/editUser');
		}
		var updateSet = {
			email: email,
			nick_name: nick_name,
			phone: phone/*,
			provinceCode: provinceCode*/
		}
		//provinceCode != user.provinceCode && (updateSet.audit_tag = 0)
		User.update({user_name:user_name},{$set:updateSet},function(err){
			if(err) return next(err);
			User.findOne({'user_name': user_name}, function(err, userRow){
				if(err) return next(err);
				if(userRow){
					if(userRow.audit_tag == 0){
						delete req.session.user;
						req.session.hasAuth = false;
						res.redirect('/login.html');
					}else{
						gen_session(userRow, req, res, 1);
						if (file.name != ''){
                            gridfs.putFile(req,user_name,function(){
                                req.flash('Prompt', '用户资料修改成功！');
                                return res.redirect('/editUser');
                            });
                        }else{
                            req.flash('Prompt', '用户资料修改成功！');
                            return res.redirect('/editUser');
                        }

					}
				}
			});
		});
	}
}


exports.login = function(req, res){
	var cookie = req.cookies[config.auth_cookie_name];
	var password ="";
	var user_name ="";
	if(cookie){
		var auth_token = decrypt(cookie, config.session_secret);
		var auth = auth_token.split('\t');
		user_name = auth[0];
		password = auth[1];
	}

	res.render('auth/login',{
		layout: false,
		user_name:user_name,
		password:password,
		errors: req.flash('error')
	})
}



exports.resetPassword = function(req, res, next){
	var user_name = sanitize(req.body.user_name).trim();
	user_name = sanitize(user_name).xss();
	var password = sanitize(req.body.password).trim();
	password = sanitize(password).xss();

	//验证用户名
	try{
		check(user_name, '用户名只能使用字母和数字').isAlphanumeric();
	}catch(e){
		req.flash('error', '用户名只能使用字母和数字！')
		res.redirect('/register');
		return;
	}


	User.findOne({'user_name': user_name}, function(err, userRow){
		if(err) return next(err);
		if(userRow){
			password = md5(password);
			userRow.set({password:password});
			userRow.save();
			req.flash('Prompt', '密码重置成功！');
			return res.redirect('/resetPassword.html');
		}else{
			req.flash('error', '用户名不存在！')
			return res.redirect('/resetPassword.html');
		}
	});
}


exports.modifyPassword = function(req, res, next){
	var userName = req.session.user.user_name;
	var pass0 =  md5(req.body.password0);
	var pass1 =  md5(req.body.password1);

	User.findOne({'user_name': userName}, function(err, userRow){
		if(err) return next(err);
		if(userRow){
			if(userRow.password != pass0 && userRow.password != req.body.password0){
				req.flash('error', '用户密码不正确！')
				res.redirect('/modifyPassword.html');
				return;
			}
			userRow.set({password:pass1});
			userRow.save();
			req.flash('Prompt', '密码修改成功！');
			return res.redirect('/modifyPassword.html');
		}else{
			req.flash('error', '用户不存在！')
			return res.redirect('/login.html');
		}
	});
}

exports.assignMenus = function(req, res, next){

	var method = req.method.toLowerCase();
	if(method == 'get'){

		res.render('user/assignMenus',{
			layout: false,
			current_user:req.session.user,
			user_menus:'[]',
			user_names:"",
			assign_user_names:"",
			errors: req.flash('error'),
			Prompts: req.flash('Prompt')
		})

	}
	else if(method == 'post'){

		var user_name = sanitize(req.body.user_names).trim();
		user_name = sanitize(user_name).xss();

		if(user_name == ""){
			req.flash('error', '请输入用户名！');
			return res.redirect('/assignMenus');
		}

		User.findOne({'user_name': user_name}, function(err, userRow){
			if(err) return next(err);
			if(userRow){
				if(userRow.is_admin){
					req.flash('error', '管理员具有全部权限，无需分配菜单！')
					return res.redirect('/assignMenus');
				}
				menu.getAssignMenu(config.root+'/app/controllers/menu',user_name,function(m){
					res.render('user/assignMenus',{
						layout: false,
						user_menus:JSON.stringify(m),
						user_names:user_name,
						assign_user_names:user_name,
						errors: req.flash('error'),
						Prompts: req.flash('Prompt')
					});
				});

			}else{
				req.flash('error', '用户不存在！')
				return res.redirect('/assignMenus');
			}
		});
	}
}

exports.assignUserMenu = function(req, res) {
	var userName = req.query.userName;
	var selectNodes = req.query.selectNodes;
	var menuTable = db.model('userMenu','user_menu');
	menuTable.remove({'user_name': userName}, function(error){
		if(error) {
			console.log(error);
		} else {
			var nodes = selectNodes.split(",");
			for (var i=0;i<nodes.length ;i++ )
			{
				if('' != nodes[i]){
					menuu = new menuTable();
					menuu.user_name = userName;
					menuu.menu_id = nodes[i];
					menuu.create_time = Date.now();
					menuu.update_time = Date.now();
					menuu.end_time = new Date('2099-12-31');
					menuu.save(function(err){
						if(err) console.log(error);
					});
				}
			}
			res.send("ok");
		}
	});
}
