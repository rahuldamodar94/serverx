const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var stateSchema = mongoose.Schema({
  stateId: {
    type: String,
    required: true,
    unique: true,
  },
  stateName: {
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
