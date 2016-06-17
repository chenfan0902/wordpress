var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var db = require('../controllers/connectFactory').getConnection('tuxedoDb');

var memorySchema = new Schema({
  _id: { type: String },
  TOTAL_SIEZ: { type: Number },
  TOTAL_USED: { type: Number },
  TOTAL_RATE: { type: Number },
  MEM_SIZE: { type: Number },
  MEM_USED: { type: Number },
  MEM_RATE: { type: Number },
  SWAP_SIZE: { type: Number },
  SWAP_USED: { type: Number },
  SWAP_RATE: { type: Number },
  STATUS: { type: Number },
  TOPS: { type: Array },
  TIME: { type: Number }
});

db.model('HostMem', memorySchema);