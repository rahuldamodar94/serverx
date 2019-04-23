const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../../db/models/users');
const verifyAccount = require('../middlewares/verifyAccount');
const ValidationAddress = require('../../db/models/validationAddress');
const { query, body, validationResult } = require('express-validator/check');


router.post('/create', [
  body('username', 'A valid Username is required').exists().isLength({min: 1}),
  body('email', 'A valid Email address is required').exists().isEmail(),
  body('first_name', 'A valid First name is required').exists().isLength({min: 1}),
  body('last_name', 'A valid Last name is required').exists().isLength({min: 1}),
  body('midlle_name', 'A valid Middle name is required').optional().isLength({min: 1}),
  body('group', 'A valid Group name is required').exists().isIn(['individual', 'merchant', 'exchange', 'authority']),
  body('country', 'A valid Country id is required').exists().isLength({min: 24, max: 24}),
  body('state', 'A valid State id is required').exists().isLength({min: 24, max: 24}),
  body('city', 'A valid City id is required').exists().isLength({min: 24, max: 24}),
  body('street_one', 'A valid Street address is required').exists().isLength({min: 1}),
  body('street_two', 'A valid Street address is required').exists().isLength({min: 1}),
  body('ip', 'A valid IP address is required').exists().isIP(),
  body('address').optional(),
  body('public_key').optional(),

], verifyAccount, async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { username, email, first_name, last_name, middle_name, group, country} = req.body;
  let { state, city, street_one, street_two, ip, address, public_key } = req.body;

  let duplicateUser = await User.findOne({ $or: [ { username: username }, { email: email } ] }).exec();

  if (duplicateUser){
    return res.json({ status: 400, success: false, error: 'User already exists' });
  }

  let user = new User({
    username: username,
    email: email,
    name: {
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
    },
    address: {
      country_id: mongoose.Types.ObjectId(country),
      state_id: mongoose.Types.ObjectId(state),
      city_id: mongoose.Types.ObjectId(city),
      street_one: street_one,
      street_two: street_two,
    },
    group: group,
    ip: ip,
  });

  let userId;

  user.save().then(doc => {

    userId = doc._id;

    let validationAddress = ValidationAddress({
      user_id: userId,
      address: address,
      public_key: public_key,
    });

    return validationAddress.save();

  }).then(doc => {
    return res.json({ status: 200, success: true, error: false, user_id: userId});
  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});


router.get('/getuser', [
  query('user_id', 'A valid User id is required').exists().isLength({min: 24, max: 24}),

], verifyAccount, async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { user_id } = req.query;

  try {
    var user = await User.findOne({_id: mongoose.Types.ObjectId(user_id)}).exec();

    if (!user) {
      return res.json({ status: 400, success: false, error: 'User does not exist' });
    }

    return res.json({ status: 200, success: true, first_name: user.name.first_name, last_name: user.name.last_name,
      middle_name: user.name.middle_name, email: user.email, group: user.group, country: user.address.country_id,
      state: user.address.state_id, city: user.address.city_id });

  } catch (err) {
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});


router.post('/update', [
  body('user_id', 'A valid User id is required').exists().isLength({min: 24, max: 24}),
  body('email', 'A valid Email address is required').optional().isEmail(),
  body('country', 'A valid Country id is required').optional().isLength({min: 24, max: 24}),
  body('state', 'A valid State id is required').optional().isLength({min: 24, max: 24}),
  body('city', 'A valid City id is required').optional().isLength({min: 24, max: 24}),
  body('street_one', 'A valid Street address is required').optional().isLength({min: 1}),
  body('street_two', 'A valid Street address is required').optional().isLength({min: 1}),
  body('ip', 'A valid IP address is required').optional().isIP(),
  body('address').optional(),
  body('public_key').optional(),

], verifyAccount, async(req, res) => {

  let { user_id, email, country, state, city, street_one, street_two, ip, address, public_key } = req.body;

  let validUser = await User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).exec();

  if (!validUser) {
    return res.json({ status: 400, success: false, error: 'User does not exist' });
  }

  let duplicateEmail = await User.findOne({ email: email }).exec();

  if (duplicateEmail){
    return res.json({ status: 400, success: false, error: 'Email already exists' });
  }

  User.findOne({ _id: user_id }).then((user) => {

    user.email = email != null ? email : user.email;
    user.address.country_id = country != null ? country : user.address.country_id;
    user.address.state_id = state != null ? state : user.address.state_id;
    user.address.city_id = city != null ? city : user.address.city_id;
    user.address.street_one = street_one != null ? street_one : user.address.street_one;
    user.address.street_two = street_two != null ? street_two : user.address.street_two;
    user.ip = ip != null ? ip : user.ip;
    user.updated_at = new Date();

    return user.save();
  }).then(doc => {

    return ValidationAddress.findOne({ user_id: mongoose.Types.ObjectId(user_id) });

  }).then(validation => {

    validation.user_id = user_id;
    validation.address = address != null ? address : validation.address;
    validation.public_key = public_key != null ? public_key : validation.public_key;
    validation.updated_at = new Date();

    return validation.save();

  }).then(result => {
    return res.json({ status: 200, success: true, error: false});
  }).catch((err) => {
    return res.json({ status: 400, success: false, error: err.message });
  });
});


module.exports = router;


