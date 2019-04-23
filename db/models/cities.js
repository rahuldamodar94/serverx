const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var citySchema = mongoose.Schema({
  city_id: {
    type: String,
    required: true,
    unique: true,
  },
  city_name: {
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
