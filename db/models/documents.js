const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var documentSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  verification_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verfication',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
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

var Document = mongoose.model('Document', documentSchema);

module.exports = Document;
