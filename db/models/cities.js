const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var citySchema = mongoose.Schema({
  cityId: {
    type: String,
    required: true,
    unique: true,
  },
  cityName: {
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

var City = mongoose.model('City', citySchema);

module.exports = City;
