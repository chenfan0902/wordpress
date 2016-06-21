var mongoose = require('mongoose');// db = mongoose.connection.db;
var db = require('./connectFactory').getConnection('tuxedoDb');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
var Grid = require('gridfs-stream');
var gfs = Grid(db.db, mongoose.mongo); //eslint-disable-line
// var fs = require('fs');

exports.putFile = function putFile(req, fileName, callback) {
  var opts;
  var options;
  var writestream;
  var file = req.files && req.files.uploadfile;
  if (!file) {
    return;
  }
  opts = { content_type: req.files.type };
  options = parse(opts); //eslint-disable-line
    // options.metadata.filename = fileName;
  options.filename = 'userPic_' + fileName;
  writestream = gfs.createWriteStream(options);
  gfs.exist(options, function cbfunc(err, found) {
    if (found) {
      gfs.remove(options, function cbfunc1() { // param err
        imageMagick(file.path).crop(req.body.w, req.body.h, req.body.x, req.body.y)
                  .stream('png')
                  .pipe(writestream);
      });
    } else {
      imageMagick(file.path)
                .crop(req.body.w, req.body.h, req.body.x, req.body.y)
                .stream('png')
                .pipe(writestream);
    }
  });

  writestream.on('close', function cbfunc() { // param file
    callback();
  });
};


function parse(options) {
  var opts = {};
  if (options.length > 0) {
    opts = options[0];
  }
  if (!opts.metadata) {
    opts.metadata = {};
  }
  return opts;
}

exports.getFile = function getFile(fileName, callback) {
  var options = {};
  options.metadata = {};
    // options.metadata.filename = fileName;
  options.filename = 'userPic_' + fileName;
  gfs.exist(options, function cbfunc(err, found) {
    var readstream = '';
    if (found) {
      readstream = gfs.createReadStream(options);
      callback(readstream);
    } else {
      callback(readstream);
    }
  });
};
