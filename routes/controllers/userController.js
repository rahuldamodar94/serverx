const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../../db/models/users');
const { param, body, validationResult } = require('express-validator/check');


router.post('/createuser', [
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

], async(req, res) => {

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
  });

  user.save().then(doc => {
    return res.json({ status: 200, success: true, error: false, user_id: doc._id});
  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});

router.get('/getuser', [
  param('user_id', 'A valid User id is required').exists().isLength({min: 24, max: 24}),

], async(req, res) => {

  let { user_id } = req.param;

  try {
    var user = await User.findOne({_id: user_id}).exec();
    return res.json({ status: 200, success: true, first_name: user.first_name, last_name: user.last_name,
      middle_name: user.middle_name, email: user.email, group: user.group, country: user.country_id,
      state: user.state_id, city: user.city_id });
  } catch (err) {
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});

router.post('/updateuser', [
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

], async(req, res) => {

  let { user_id, email, country, state, city, street_one, street_two, ip, address, public_key } = req.body;

  User.findOne({ _id: user_id }).then((user) => {

    user.email = email != null ? email : user.email;
    user.address.country_id = country != null ? country : user.address.country_id;
    user.address.state_id = state != null ? state : user.address.state_id;
    user.address.city_id = city != null ? city : user.address.city_id;
    user.address.street_one = street_one != null ? street_one : user.address.street_one;
    user.address.street_two = street_two != null ? street_two : user.address.street_two;
    user.ip = ip != null ? ip : user.ip;

    return user.save();
  }).then(doc => {
    return res.json({ status: 200, success: true, error: false});
  }).catch((err) => {
    return res.json({ status: 400, success: false, error: err.message });
  });
});


module.exports = router;


