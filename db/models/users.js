const mongoose = require('mongoose');
const validator = require('validator');

mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  name: {
    first: String,
    middle: String,
    last: String,
  },
  address: {
    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },
    state_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: true,
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    street_one: {
      type: String,
      required: true,
    },
    street_two: {
      type: String,
      required: true,
    },
  },
  group: {
    type: String,
    required: true,
  },
  verification_status: {
    type: String,
    default: 'pending',
  },
  verification_notes: {
    type: String,
    default: '',
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
