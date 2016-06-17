/* eslint no-param-reassign: [2, { "props": false }] */
/* global require */
var fs = require('fs');
var async = require('async');
var mongoose = require('./connectFactory').getConnection('cmdDb');
var extend = require('extend');
var logger = require('./log').logger;


function pushlistItem(menu, userMenuObj) {
  var tempList = [];
  if (menu.list !== undefined) {
    menu.list.forEach(function loopfunc(item) {
      if (item.menuId !== undefined && userMenuObj[item.menuId] !== undefined) {
        tempList.push(item);
        menu.list = tempList; //eslint-disable-line
        pushlistItem(item, userMenuObj);
      }
    });
  }
}

function pushAssignMenu(menu, userMenuObj, menus) {
  if (menu.list !== undefined) {
    menu.list.forEach(function loopfunc(item) {
      var node = {};
      node.id = item.menuId;
      node.parent = menu.menuId;
      node.text = item.title;
      if (userMenuObj[item.menuId] !== undefined) {
        node.state = {};
        node.state.opened = true;
        if (item.list) {
          node.state.selected = false;
        } else {
          node.state.selected = true;
        }
      }
      menus.push(node);
      if (item.list) {
        pushAssignMenu(item, userMenuObj, menus);
      }
    });
  }
}

exports.loadMenu = function loadMenu(dir, req, cb) {
  async.parallel({
    menu: function menu(callback) {
      fs.readdir(dir, function cbfunc(err, files) {
        var filepath;
        var tmp;
        var menusTemp = [];
        var m;
        var n;
        if (err) {
          throw new Error(err);
        }

        files.forEach(function loopfunc(filename) {
          if (filename.substring(filename.length - 3) === '.js') {
            filepath = [dir, filename].join('/');
            tmp = require(filepath);

            for (m in tmp) {
              if (!tmp[m].parentMenuId) {
                menusTemp.push(tmp[m]);
              }
            }

            for (n in tmp) {
              if (tmp[n].parentMenuId && tmp[n].parentMenuId !== '') {
                for(p in menusTemp) {
                  if (menusTemp[p].menuId && tmp[n].parentMenuId === menusTemp[p].menuId) {
                    var pushTag = true;
                    menusTemp[p].list.forEach(function (item){
                      if (item.menuId === tmp[n].menuId) {
                        pushTag = false;
                      }
                    });
                    if (pushTag) {
                      menusTemp[p].list.push(tmp[n]);
                      break;
                    }
                  }
                }
              }
            }
          }
        });

        callback(null, menusTemp);
      });
    },
    userMenu: function userMenu(callback) {
      var userMenu = [];
      var table;
      if (req.session.user && !req.session.user.is_admin) {
        table = mongoose.model('userMenu', 'user_menu');
        table.find({ user_name: req.session.user.user_name }, {}, function cbfunc(err, rows) {
          if (err) {
            logger.error(err);
          }
          if (rows) {
            callback(null, rows);
          }
        });
      } else {
        callback(null, userMenu);
      }
    }
  }, function rstfunc(err, results) {
    var resultMenu = [];
    var userMenus = results.userMenu;
    var menus = [];
    var userMenuObj = {};
    if (err) {
      logger.error(err);
    }
    if (req.session.user.is_admin) {
      async.apply(cb, results.menu)();
    } else {
      extend(true, menus, results.menu);
      userMenus.forEach(function loopfunc(userMenu) {
        if (userMenu.state === 0 && userMenu.menu_id !== '') {
          userMenuObj[userMenu.menu_id] = 0;
        }
      });

      menus.forEach(function loopfunc(menu) {
        if (menu.menuId !== undefined && userMenuObj[menu.menuId] !== undefined) {
          resultMenu.push(menu);
          pushlistItem(menu, userMenuObj);
        }
      });
      async.apply(cb, resultMenu)();
    }
  });
};


exports.getAssignMenu = function getAssignMenu(dir, user_name, cb) {
  async.parallel({
    menu: function menu(callback) {
      var userMenu = [];
      var table = mongoose.model('userMenu', 'user_menu');
      table.find({ user_name: user_name }, {}, function cbfunc(err, rows) {
        if (err) logger.error(err);
        if (rows) {
          var userMenuObj = {};
          rows.forEach(function (userMenu) {
            if (userMenu.state === 0 && userMenu.menu_id !== '') {
              userMenuObj[userMenu.menu_id] = '';
            }
          });
          fs.readdir(dir, function (err, files) {
            var menusTemp = [];
            var root = {};
            root.id = 'root';
            root.parent = '#';
            root.text = '根节点';
            menusTemp.push(root);
            if (err) {
              throw new Error(err);
            }

            files.forEach(function (filename) {
              if (filename.substring(filename.length - 3) === '.js') {
                var filepath = [dir, filename].join('/');
                var tmp = require(filepath);

                for (m in tmp) {
                  if(!tmp[m].parentMenuId && tmp[m].menuId) {
                    var node1 = {};
                    node1.id = tmp[m].menuId;
                    node1.parent = 'root';
                    node1.text = tmp[m].title;
                    if(userMenuObj[tmp[m].menuId] != undefined) {
                      if(!tmp[m].list || tmp[m].list.length == 0) {
                                      node1.state = {};
                                      node1.state.opened = true;
                                      if(tmp[m].list) {
                                          node1.state.selected = false;
                                        }else {
                                          node1.state.selected = true;
                                        }
                                    }
                    }
                    menusTemp.push(node1);
                    pushAssignMenu(tmp[m], userMenuObj, menusTemp);
                  }
                }

                for (n in tmp) {
                  if (tmp[n].parentMenuId && tmp[n].parentMenuId !== '') {
                    var node = {};
                    node.id = tmp[n].menuId;
                    node.parent = tmp[n].parentMenuId;
                    node.text = tmp[n].title;
                    if (userMenuObj[tmp[n].menuId] !== undefined) {
                      node.state = {};
                      node.state.opened = true;
                      node.state.selected = true;
                    }
                    menusTemp.push(node);
                  }
                }
              }
            });
            callback(null, menusTemp);
          });
        }
      });
    }
  }, function (err, results) {
    if (err) {
      logger.error(err);
    }
    async.apply(cb, results.menu)();
  });
};
