const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var stateSchema = mongoose.Schema({
  state_id: {
    type: String,
    required: true,
    unique: true,
  },
  state_name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

var State = mongoose.model('State', stateSchema);

module.exports = State;
