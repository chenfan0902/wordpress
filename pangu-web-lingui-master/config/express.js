var express = require('express');
var flash = require('connect-flash');
var mongoStore = require('connect-mongo')(express);
var pjax = require('express-pjax');
var partials = require('express-partials');
// var plugin = require('plugin');
// var auth = require('../app/controllers/auth');
var log = require('../app/controllers/log');
// var solr = require('solr');
module.exports = function expfunc(app, config) {
  var db = app.get('db');

  app.set('showStackError', true);

  // should be placed before express.static
  app.use(express.compress({
    filter: function filterfunc(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  app.use(express.favicon('public/favicon.ico'));
  app.use(express.static(config.root + '/public'));

  // don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  // set views path, template engine and default layout
  app.engine('html', require('ejs').__express);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');

  app.use(partials());
  app.use(pjax());


  // cookieParser should be above session
  app.use(express.cookieParser());


  // bodyParser should be above methodOverride
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // log4js
  log.use(app);


  // express/mongo session storage
  app.use(express.session({
    secret: 'logAnalyse-pangu',
    cookie: { maxAge: 900000 }, // 15 minutes
    rolling: true,
    saveUninitialized: false,
    resave: false,
    store: new mongoStore({ // eslint-disable-line
      url: db.cmdDb,
      collection: 'sessions'
    })
  }));

// connect flash for flash messages - should be declared after sessions
  app.use(flash());

  // adds CSRF support
  if (process.env.NODE_ENV !== 'test') {
      app.use(express.csrf()); // eslint-disable-line
  }

  app.use(function usefunc(req, res, next) {
    res.locals.csrf_token = req.csrfToken(); // eslint-disable-line
    next();
  });

  // Public Response Information
  app.use(function usefunc(req, res, next) {
    if (req.url === '/logout') {
      next();
    } else {
      res.locals.faye = config.faye; // eslint-disable-line
      if (req.session.user) {
        res.locals.current_user = req.session.user; // eslint-disable-line
        if (req.header('X-Requested-With') === undefined
            || req.header('X-Requested-With') !== 'XMLHttpRequest') {
          require('../app/controllers/menu').loadMenu(config.root +
                  '/app/controllers/menu', req, function tmpfunc(m) {
            res.locals.menus = m; // eslint-disable-line
            req.session.user.menus = m; // eslint-disable-line
                    next();
                  });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  });


  // routes should be at the last
  app.use(app.router);


  // assume "not found" in the error msgs
  // is a 404. this is somewhat silly, but
  // valid, you can do whatever you like, set
  // properties, use instanceof etc.
  app.use(function usefunc(err, req, res, next) {
      // treat as 404
    if (err.message && (~err.message.indexOf('not found') ||
      (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    // log it
    // send emails if you want
    console.error(err.stack);// eslint-disable-line
    if (~err.stack.indexOf('invalid csrf token')) {
      return res.redirect('/login.html');
    }
    // error page
    res.status(500).renderPjax('500', { error: '系统内部异常，请联系管理员！' });
  });

  // assume 404 since no middleware responded
  app.use(function usefunc(req, res, next) { // eslint-disable-line
    res.status(404).renderPjax('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });

  // development env config
  app.configure('development', function tmpfunc() {
    app.locals.pretty = true; // eslint-disable-line
  });
};
