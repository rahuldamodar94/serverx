const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var transactionSchema = mongoose.Schema({
  sender_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender_validation_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ValidationAddress',
    required: true,
  },
  sender_ip_address: {
    type: String,
    required: true,
  },
  receiver_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver_validation_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ValidationAddress',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  amount_usd: {
    type: Number,
    required: true,
  },
  suspicious_rate: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
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

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
