const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  salt: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  ips: {
    type: [String],
    default: undefined,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  callaback_url: {
    type: String,
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

var User = mongoose.model('User', userSchema);

module.exports = User;
