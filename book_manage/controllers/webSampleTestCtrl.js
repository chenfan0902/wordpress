var mysql = require('mysql');
var list = function (req, res) {
var conn = mysql.createConnection({                                                                   
    host:'localhost',                                                                                 
    user:'root',                                                                                      
    password:'901213chen',
    database:'bookmanage',
    port:3306
});                                                                                                 
conn.beginTransaction(function(err) {                                                                 
        if(err) {
        }
        conn.query('select * from book',function(err,results,field){
                if(err) {
                        conn.rollback(function() {                                                    
                                console.log('查询book表失败！');                                
                                throw err;                                                            
                        });
                }
                if(results){
            res.render('list.html', {data:results});
             }
                var now = new Date();
                conn.query('insert into log VALUES(?,?,?,?,?)',[now,'1','0','0','0'], function(err, result) {
                        if(err) {
                                console.log('插入日志失败！');                               
                                conn.rollback(function() {                                            
                                        throw err;                                                    
                                });                                                                   
                        }
                        conn.commit(function(err) {                                                   
                                console.log('enter the commit');                                      
                                if(err) {
                                        conn.rollback(function() {                                    
                                                throw err;                                            
                                        });                                                           
                                }
                                console.log('success');
                                
                        });
                });
            });
});
}

var index = function (req, res) {
var conn = mysql.createConnection({                                                                   
    host:'localhost',                                                                                 
    user:'root',                                                                                      
    password:'901213chen',
    database:'bookmanage',
    port:3306
});                                                                                                 
conn.beginTransaction(function(err) {                                                                 
        if(err) {
        }
        conn.query('select * from book',function(err,results,field){
                if(err) {
                        conn.rollback(function() {                                                    
                                console.log('查询book表失败！');                                
                                throw err;                                                            
                        });
                }
                if(results){
            res.render('index.html', {data:results});
             }
                var now = new Date();
                conn.query('insert into log VALUES(?,?,?,?,?)',[now,'1','0','0','0'], function(err, result) {
                        if(err) {
                                console.log('插入日志失败！');                               
                                conn.rollback(function() {                                            
                                        throw err;                                                    
                                });                                                                   
                        }
                        conn.commit(function(err) {                                                   
                                console.log('enter the commit');                                      
                                if(err) {
                                        conn.rollback(function() {                                    
                                                throw err;                                            
                                        });                                                           
                                }
                                console.log('success');
                                
                        });
                });
            });
});
}
/*
var index = function (req, res) {
var db= mysql.createConnection({
    host  : 'localhost',
    user  : 'root',
    password:'901213chen',
    database:'bookmanage'
});
db.connect();
db.query("use bookmanage");
//var insert_values = '[req.query.ISBN,req.query.bookName,req.query.press,req.query.author,req.query.publishDate]'
db.query('select * from book',function(err,results,field){
    if(err){
        console.log(err.message);
    }
    if(results){
            res.render('index.html', {data:results
        }); 
  db.end();
}
});
}*/
var insert = function (req, res) {
var conn = mysql.createConnection({                                                                   
    host:'localhost',                                                                                 
    user:'root',                                                                                      
    password:'901213chen',
    database:'bookmanage',
    port:3306
});                                                                                                 
conn.beginTransaction(function(err) {                                                                 
        if(err) {
        }
        conn.query('INSERT INTO book VALUES(?,?,?,?,?,?)',[req.query.ISBN,req.query.bookName,req.query.press,req.query.author,req.query.publishDate,'1'],function(err,results,field){
                if(err) {
                        conn.rollback(function() {                                                    
                                console.log('first insert into user');                                
                                throw err;                                                            
                        });
                }
                var now = new Date();
                conn.query('insert into log VALUES(?,?,?,?,?)',[now,'0','1','0','0'], function(err, result) {
                        if(err) {
                                console.log('插入日志失败！');                               
                                conn.rollback(function() {                                            
                                        throw err;                                                    
                                });                                                                   
                        }
                        conn.commit(function(err) {                                                   
                                console.log('enter the commit');                                      
                                if(err) {
                                        conn.rollback(function() {                                    
                                                throw err;                                            
                                        });                                                           
                                }
                                console.log('success');
                                
                        });
                });
                res.send({});
                    });
});
}
/*var insert = function (req, res) {
var db= mysql.createConnection({
    host  : 'localhost',
    user  : 'root',
    password:'901213chen',
    database:'bookmanage'
});
db.connect();
db.query("use bookmanage");

//var insert_values = '[req.query.ISBN,req.query.bookName,req.query.press,req.query.author,req.query.publishDate]'
db.query('INSERT INTO book VALUES(?,?,?,?,?,?)',[req.query.ISBN,req.query.bookName,req.query.press,req.query.author,req.query.publishDate,'1'],function(err,results,field){
    if(err){
        console.log(err.message);
    }
     console.log(results);
  res.send({});
  db.end();
});
}*/
var update = function (req, res) {
var conn = mysql.createConnection({                                                                   
    host:'localhost',                                                                                 
    user:'root',                                                                                      
    password:'901213chen',
    database:'bookmanage',
    port:3306
});                                                                                                 
conn.beginTransaction(function(err) {                                                                 
        if(err) {
        }
        conn.query('UPDATE book SET bookName = ?,press = ?,author = ?,publishDate = ? WHERE ISBN= ?',[req.query.bookName,req.query.press,req.query.author,req.query.publishDate,req.query.ISBN],function(err,results,field){
                if(err) {
                        conn.rollback(function() {                                                    
                                console.log('first insert into user');                                
                                throw err;                                                            
                        });
                }
                var now = new Date();
                conn.query('insert into log VALUES(?,?,?,?,?)',[now,'0','0','1','0'], function(err, result) {
                        if(err) {
                                console.log('插入日志失败！');                               
                                conn.rollback(function() {                                            
                                        throw err;                                                    
                                });                                                                   
                        }
                        conn.commit(function(err) {                                                   
                                console.log('enter the commit');                                      
                                if(err) {
                                        conn.rollback(function() {                                    
                                                throw err;                                            
                                        });                                                           
                                }
                                console.log('success');
                                
                        });
                });
                res.send({});
                    });
});
}
/*var update = function (req, res) {
var db= mysql.createConnection({
    host  : 'localhost',
    user  : 'root',
    password:'901213chen',
    database:'bookmanage'
});
db.connect();
db.query("use bookmanage");
             
//var insert_values = '[req.query.ISBN,req.query.bookName,req.query.press,req.query.author,req.query.publishDate]'
db.query('UPDATE book SET bookName = ?,press = ?,author = ?,publishDate = ? WHERE ISBN= ?',[req.query.bookName,req.query.press,req.query.author,req.query.publishDate,req.query.ISBN],function(err,results,field){
    if(err){
        console.log(err.message);
    }
     console.log(results);
  res.send({});
  db.end();
});
}*/
var remove = function (req, res) {
var conn = mysql.createConnection({                                                                   
    host:'localhost',                                                                                 
    user:'root',                                                                                      
    password:'901213chen',
    database:'bookmanage',
    port:3306
});                                                                                                 
conn.beginTransaction(function(err) {                                                                 
        if(err) {
        }
        conn.query('DELETE FROM book WHERE ISBN = ?',[req.query.ISBN],function(err,results,field){
                if(err) {
                        conn.rollback(function() {                                                    
                                console.log('first insert into user');                                
                                throw err;                                                            
                        });
                }
                var now = new Date();
                conn.query('insert into log VALUES(?,?,?,?,?)',[now,'0','0','0','1'], function(err, result) {
                        if(err) {
                                console.log('插入日志失败！');                               
                                conn.rollback(function() {                                            
                                        throw err;                                                    
                                });                                                                   
                        }
                        conn.commit(function(err) {                                                   
                                console.log('enter the commit');                                      
                                if(err) {
                                        conn.rollback(function() {                                    
                                                throw err;                                            
                                        });                                                           
                                }
                                console.log('success');
                                
                        });
                });
                res.send({});
                    });
});
}
/*var remove = function (req, res) {
var db= mysql.createConnection({
    host  : 'localhost',
    user  : 'root',
    password:'901213chen',
    database:'bookmanage'
});
db.connect();
db.query("use bookmanage");

//var insert_values = '[req.query.ISBN,req.query.bookName,req.query.press,req.query.author,req.query.publishDate]'
db.query('DELETE FROM book WHERE ISBN = ?',[req.query.ISBN],function(err,results,field){
    if(err){
        console.log(err.message);
    }
     console.log(results);
  res.send("{chenfan}");
  db.end();
});
}*/
/*var login = function (req, res) {
    db.collection('user').find({username:req.query.username}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
         rst && rst.toArray(function (err, rows) {
          if(rows!=null){
            if(rows.password==req.query.password){
                res.render('#msgName','登录成功');
            }else{
                 res.render('#msgName','密码错误');
            }
        }else{
             res.render('#msgName','用户不存在');
        }
            });
    });
}


var index = function (req, res) {
    db.collection('booksManage').find({}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        rst && rst.toArray(function (err, rows) {
            res.render('index.html', {
                data: rows
            });
        });
    });
};

var list = function (req, res) {
    db.collection('booksManage').find({}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        rst && rst.toArray(function (err, rows) {
            res.render('list.html', {
                data: rows
            });
        });
    });
};

var borrowlist = function (req, res) {
    db.collection('booksManage').find({}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        rst && rst.toArray(function (err, rows) {
            res.render('borrow.html', {
                data: rows
            });
        });
    });
};
var borrow = function (req, res) {
    var _id = mongoose.Types.ObjectId(req.query._id);
    var ISBN = req.query.ISBN;//isbn
    var bookName = req.query.bookName;
    var press = req.query.press;
    var author = req.query.author;
    var publishDate = req.query.publishDate;
    var borrowStatus = req.query.borrowStatus;//modify //wrong!!!why

    var obj = {
        _id: _id,//其实没用吧 yes
        ISBN:ISBN,
        bookName: bookName,
        press: press,
        author: author,
        publishDate: publishDate,
        borrowStatus: borrowStatus
    };

    db.collection('booksManage').update({_id: _id}, {$set: obj}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        console.log(JSON.stringify(obj))
        res.send({});
    });
};

var returning = function (req, res) {
    var _id = mongoose.Types.ObjectId(req.query._id);
    var ISBN = req.query.ISBN;//isbn
    var bookName = req.query.bookName;
    var press = req.query.press;
    var author = req.query.author;
    var publishDate = req.query.publishDate;
    var borrowStatus = req.query.borrowStatus;//modify //wrong!!!why

    var obj = {
        _id: _id,//其实没用吧 yes
        ISBN:ISBN,
        bookName: bookName,
        press: press,
        author: author,
        publishDate: publishDate,
        borrowStatus: borrowStatus
    };

    db.collection('booksManage').update({_id: _id}, {$set: obj}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        console.log(JSON.stringify(obj))
        res.send({});
    });
};

var update = function (req, res) {
    var _id = mongoose.Types.ObjectId(req.query._id);
    var ISBN = req.query.ISBN;//isbn
    var bookName = req.query.bookName;
    var press = req.query.press;
    var author = req.query.author;
    var publishDate = req.query.publishDate;//modify //wrong!!!why

    var obj = {
        _id: _id,//其实没用吧 yes
        ISBN:ISBN,
        bookName: bookName,
        press: press,
        author: author,
        publishDate: publishDate
    };

    db.collection('booksManage').update({_id: _id}, {$set: obj}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        console.log(JSON.stringify(obj))
        res.send({});
    });
};

var remove = function (req, res) {
    var _id = mongoose.Types.ObjectId(req.query._id);

    db.collection('booksManage').remove({_id: _id}, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        console.log(JSON.stringify(_id));
        res.send({});
    });
};
var register = function (req, res) {
    var username=req.query.username;
    var password = req.query.password;
    var obj = {
        username:username,
        password: password
    };

    db.collection('user').insert(obj, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        console.log(JSON.stringify(obj))
        res.send({});
    });
};


var insert = function (req, res) {
    var ISBN=req.query.ISBN;
    var bookName = req.query.bookName;
    var press = req.query.press;
    var author = req.query.author;
    var publishDate = req.query.publishDate;

    var obj = {
        ISBN:ISBN,
        bookName: bookName,
        press: press,
        author: author,
        publishDate: publishDate,
        borrowStatus:"1"
    };

    db.collection('booksManage').insert(obj, function (err, rst) {
        if (err) {
            console.log(err.message);
        }
        console.log(JSON.stringify(obj))
        res.send({});
    });
};
//事务处理
connection.beginTransaction(function(err) {  
      if (err) { throw err; }  
      connection.query('INSERT INTO posts SET title=?', title, function(err, result) {  
        if (err) {   
          connection.rollback(function() {  
            throw err;  
          });  
        }  
  
        var log = 'Post ' + result.insertId + ' added';  
  
        connection.query('INSERT INTO log SET data=?', log, function(err, result) {  
          if (err) {   
            connection.rollback(function() {  
              throw err;  
            });  
          }    
          connection.commit(function(err) {  
            if (err) {   
              connection.rollback(function() {  
                throw err;  
              });  
            }  
            console.log('success!');  
          });  
        });  
      });  
    });  
*/

exports.list = list;
exports.index = index;
//exports.borrowlist = borrowlist;
//exports.borrow = borrow;
//exports.returning = returning;
exports.update = update;
exports.remove = remove;
exports.insert = insert;
//exports.register=register;
//exports.login=login;*/
