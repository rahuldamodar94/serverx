const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var Promise = global.Promise;

var accountSchema = mongoose.Schema({
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
    type: Number,
    required: true,
  },
  token: {
    type: String,
    default: '',
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
    default: 'active',
  },
  callaback_url: {
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

accountSchema.pre('save', function() {
  const account = this;
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(account.salt, (err, salt) => {
      if (err) {
        reject(new Error(err));
      }
      bcrypt.hash(account.password, salt, (err, hash) => {
        if (err) {
          reject(new Error(err));
        }
        account.password = hash;
        resolve(account);
      });
    });
  });
});

var Accounts = mongoose.model('Accounts', accountSchema);

module.exports = Accounts;
