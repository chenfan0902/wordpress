
var auth = require('../app/controllers/auth');
var main = require('../app/controllers/main');
var laTop = require('../app/controllers/top');
var laSum = require('../app/controllers/sum');
var userAuth = require('../app/controllers/user_auth');

module.exports = function expfunc(app) {
	// 显示登录页面
  app.get('/login.html', auth.login);

	// 对用户名密码进行鉴权
  app.post('/auth.html/:checkrmUser', auth.auth, auth.session);

  // 首页
  app.get('/', auth.requiresLogin, main.index);
  app.get('/index.html', auth.requiresLogin, main.index);
  app.get('/getStatData.html', auth.requiresLogin, main.getStatData);
  app.get('/getUserSubscribeType.html', auth.requiresLogin, main.getUserSubscribeType);
  app.get('/getInbox.html', auth.requiresLogin, main.getInbox);
  app.get('/getMailDetail.html', auth.requiresLogin, main.getMailDetail);


  // 排名清单
  app.get('/lcuTopList.html', auth.requiresLogin, laTop.lcuList);
  app.get('/svcTopList.html', auth.requiresLogin, laTop.svcList);
  // app.get('/lcuErrorAnalysis.html', auth.requiresLogin, laTop.lcuAnalysis);

  // 排名明细
  app.get('/detail.html', auth.requiresLogin, laTop.initDetail);
  app.get('/topDetail.html', auth.requiresLogin, laTop.detail);
  app.get('/visitCntDetail.html', auth.requiresLogin, main.visitCntDetail);


  // 总数统计列表
  app.get('/sumList.html', auth.requiresLogin, laSum.list);

  // 注册用户
  app.get('/register', auth.registerUser);
  app.post('/registerAction', userAuth.registeUser);


  // 注册用户审核
  app.get('/auditUser', auth.auditUser);
  app.post('/auditAction/:checkValue', auth.audit);

   // 用户资料修改
  app.get('/editUser', auth.requiresLogin, userAuth.editUser);
  app.post('/editUserAction', auth.requiresLogin, userAuth.editUser);


  // 调用头像
  app.get('/getHeadPicture', auth.getHeadPicture);

  // 分页查询
  app.get('/getPageDataAction', auth.getHeadPicture);

  //
  app.get('/getVisitCount.html', auth.getVisitCount, auth.session);


  app.get('/modifyPassword.html', auth.modifyPassword);
  app.post('/modifyPassword', userAuth.modifyPassword);

  app.get('/resetPassword.html', auth.resetPassword);
  app.post('/resetPassword', userAuth.resetPassword);


  // 用户菜单分配
  app.get('/assignMenus', auth.requiresLogin, userAuth.assignMenus);
  app.post('/assignMenusQuery', auth.requiresLogin, userAuth.assignMenus);
  app.get('/assignUserMenu.html', auth.requiresLogin, userAuth.assignUserMenu);


  // 退出
  app.get('/logout', auth.logout);
};
