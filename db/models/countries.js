const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var countrySchema = mongoose.Schema({
  countryId: {
    type: String,
    required: true,
    unique: true,
  },
  countryName: {
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
