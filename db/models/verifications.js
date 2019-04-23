const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var verificationSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
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

var Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
