const express = require('express');
const router = express.Router();
const Accounts = require('../../db/models/accounts');
const Countries = require('../../db/models/countries');
const States = require('../../db/models/states');
const User = require('../../db/models/users');
const Cities = require('../../db/models/cities');
const mongoose = require('mongoose');
const { query, body, validationResult } = require('express-validator/check');

router.post('/createaccount', [
  body('username', 'A valid Username is required').exists().isLength({ min: 1 }),
  body('password', 'A valid alphanumeric password is required').exists().isLength({ min: 6, max: 18 }).isAlphanumeric(),
  body('salt', 'A valid salt is required').exists().isLength({ min: 1, max: 10 }),
  body('ips', 'A valid IP is required').optional().isIP(),
  body('type', 'A valid type is required').exists().isIn(['gateway', 'wallet']),
  body('callback_url', 'A valid callback URL is required').exists().isLength({ min: 1 }),

], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { username, password, salt, ips, type, callback_url } = req.body;

  let duplicateUsername = await Accounts.findOne({ username: username }).exec();

  if (duplicateUsername) {
    return res.json({ status: 400, success: false, error: 'Username already exists' });
  }

  let account = new Accounts({
    username: username,
    password: password,
    salt: parseInt(salt, 10),
    type: type,
    callback_url: callback_url,
  });

  account.save().then(doc => {
    return res.json({ status: 200, success: true, error: false, account_id: doc._id });
  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});

router.post('/addcountry', [
  body('country_id', 'A valid country is required').exists().isLength({ min: 1 }),
  body('country_name', 'A valid country name is required').exists().isLength({ min: 1 }),
], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { country_id, country_name } = req.body;

  let duplicateCountry = await Countries.findOne({ $or: [{ country_name: country_name }, { country_id: country_id }] }).exec();

  if (duplicateCountry) {
    return res.json({ status: 400, success: false, error: 'Country already exists' });
  }

  let country = new Countries({
    country_name: country_name,
    country_id: country_id,
  });

  country.save().then(doc => {
    return res.json({ status: 200, success: true, error: false });
  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});

router.post('/addstate', [
  body('state_id', 'A valid state is required').exists().isLength({ min: 1 }),
  body('state_name', 'A valid state name is required').exists().isLength({ min: 1 }),
], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { state_id, state_name } = req.body;

  let duplicateState = await States.findOne({ $or: [{ state_name: state_name }, { state_id: state_id }] }).exec();

  if (duplicateState) {
    return res.json({ status: 400, success: false, error: 'State already exists' });
  }

  let state = new States({
    state_name: state_name,
    state_id: state_id,
  });

  state.save().then(doc => {
    return res.json({ status: 200, success: true, error: false });
  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});

router.post('/addcity', [
  body('city_id', 'A valid state is required').exists().isLength({ min: 1 }),
  body('city_name', 'A valid state name is required').exists().isLength({ min: 1 }),
], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { city_id, city_name } = req.body;

  let duplicateCity = await Cities.findOne({ $or: [{ city_name: city_name }, { city_id: city_id }] }).exec();

  if (duplicateCity) {
    return res.json({ status: 400, success: false, error: 'State already exists' });
  }

  let city = new Cities({
    city_name: city_name,
    city_id: city_id,
  });

  city.save().then(doc => {
    return res.json({ status: 200, success: true, error: false });
  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});

router.get('/getallusers', [], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  try {
    var user = await User.find().populate('address.country_id', 'address.state_id', 'address.city_id').exec();

    return res.json({ status: 200, success: true, result: user });

  } catch (err) {
    console.log(err.message);
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});

router.get('/getuser', [
  query('user_id', 'A valid User id is required').exists().isLength({ min: 24, max: 24 }),

], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { user_id } = req.query;

  try {
    var user = await User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).populate('address.country_id', 'address.state_id', 'address.city_id').exec();

    if (!user) {
      return res.json({ status: 400, success: false, error: 'User does not exist' });
    }

    return res.json({ status: 200, success: true, result: user });

  } catch (err) {
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});

router.get('/getallcountries', [], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  try {
    var user = await Countries.find().exec();

    return res.json({ status: 200, success: true, result: user });

  } catch (err) {
    console.log(err.message);
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});

router.get('/getallstates', [], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  try {
    var user = await States.find().exec();

    return res.json({ status: 200, success: true, result: user });

  } catch (err) {
    console.log(err.message);
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});

router.get('/getallcities', [], async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  try {
    var user = await States.find().exec();

    return res.json({ status: 200, success: true, result: user });

  } catch (err) {
    console.log(err.message);
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});


module.exports = router;
