var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = require('../controllers/connectFactory').getConnection('tuxedoDb');

var hostSchema = new Schema({
  _id: { type: String },
  CPU_STATUS: { type: Number },
  MEM_STATUS: { type: Number },
  DISK_STATUS: { type: Number },
  DIR_STATUS: { type: Number },
  STAMP: { type: Number },
  MINCPU: { type: Number },
  MAXCPU: { type: Number },
  COUNT: { type: Number },
  SUMCPU: { type: Number },
  SWAP_MIN: { type: Number },
  RSZ_MIN: { type: Number },
  SWAP_MAX: { type: Number },
  RSZ_MAX: { type: Number },
  SWAP_TOTAL: { type: Number },
  RSZ_TOTAL: { type: Number },
  RSZ_SIZE: { type: Number },
  RSZ_USED: { type: Number },
  SWAP_SIZE: { type: Number },
  SWAP_USED: { type: Number },
  MOUNT: { type: String },
  BLOCK: { type: Number },
  USED: { type: Number },
  FREE: { type: Number },
  DIR: { type: String },
  DIR_SIZE: { type: Number },
  VG: { type: String },
  VG_SIZE: { type: Number },
  RATE: { type: Number },
  TOPS: { type: Array },
  STATUS: { type: Number },
  TIME: { type: Number }
});

db.model('HostMonitor', hostSchema);