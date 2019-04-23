const express = require('express');
const router = express.Router();
const Accounts = require('../../db/models/accounts');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');


router.post('/login', [
  body('username', 'Invalid credentials').exists().isLength({ min: 1 }),
  body('password', 'Invalid credentials').exists().isLength({ min: 6, max: 18 }).isAlphanumeric(),

], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { username, password } = req.body;

  let user = await Accounts.findOne({ username: username }).exec();

  if (!user) {
    return res.json({ status: 400, success: false, error: 'Account does not exist' });
  }

  bcrypt.compare(password, user.password).then(result => {
    if (!result) {
      return res.json({ status: 400, success: false, error: 'Invalid crdentials' });
    }

    var token = jwt.sign({ username: user.username }, process.env.jwt_secret, { expiresIn: 86400 });

    return res.json({ status: 200, success: true, error: false, access_token: token });

  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});

module.exports = router;
