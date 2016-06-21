var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = require('../controllers/connectFactory').getConnection('tuxedoDb');

var practicalSchema = new Schema({
  _id: { type: String },
  CLERK: { type: String },
  PTIME: { type: Number },
  BUSINESS_HALL: { type: String },
  STIME: { type: String },
  AVG_BUSINESS: { type: Number }
});

db.model('practicalMonitor', practicalSchema);
