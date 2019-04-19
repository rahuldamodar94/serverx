const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var validationAddressSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  public_key: {
    type: String,
    required: true,
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

var ValidationAddress = mongoose.model('ValidationAddress', validationAddressSchema);

module.exports = ValidationAddress;
