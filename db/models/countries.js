const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var countrySchema = mongoose.Schema({
  country_id: {
    type: String,
    required: true,
    unique: true,
  },
  country_name: {
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

var Country = mongoose.model('Country', countrySchema);

module.exports = Country;
