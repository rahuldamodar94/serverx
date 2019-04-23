const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Documents = require('../../db/models/documents');
const verifyAccount = require('../middlewares/verifyAccount');
const Verifications = require('../../db/models/verifications');
const User = require('../../db/models/users');
const { query, body, validationResult } = require('express-validator/check');
var AWS = require('aws-sdk');

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-south-1',
});


router.post('/verify', [
  body('user_id', 'A valid User id is required').exists().isLength({ min: 24, max: 24 }),
  body('type', 'A valid document is required').exists().isIn(['passport', 'id', 'driving_license', 'utility_bill']),

], verifyAccount, async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { user_id, type } = req.body;

  var fileData = Buffer.from(req.body.data, 'binary');

  var params = {
    Bucket: 'sxv',
    Key: Date.now().toString(),
    Body: fileData,
  };

  let validUser = await User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).exec();

  if (!validUser) {
    return res.json({ status: 400, success: false, error: 'User does not exist' });
  }

  s3.putObject(params, function(err, resp) {

    if (err) {
      return res.json({ status: 400, success: false, error: err.message });
    }

    let verification = Verifications({
      user_id: user_id,
      type: type,
    });

    let v_id;

    verification.save().then((doc) => {
      v_id = doc._id;
      return Documents.findOne({ user_id: user_id });

    }).then(documents => {

      if (!documents) {
        documents = Documents({
          user_id: user_id,
          verification_id: v_id,
          type: type,
          location: params.Key,
        });
      } else {
        documents.user_id = user_id;
        documents.verification_id = v_id;
        documents.type = type;
        documents.location = params.Key;
      }

      return documents.save();

    }).then(result => {
      return res.json({ status: 200, success: true, error: false });
    }).catch(err => {
      return res.json({ status: 400, success: false, error: err.message });
    });

  });


});


router.get('/getdoc', [
  query('user_id', 'A valid User id is required').exists().isLength({ min: 24, max: 24 }),

], verifyAccount, async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  try {

    let { user_id } = req.query;

    let documents = await Documents.findOne({ user_id: mongoose.Types.ObjectId(user_id) }).exec();

    if (!documents) {
      return res.json({ status: 400, success: false, error: 'User does not exist' });
    }

    let params = {
      Bucket: 'sxv',
      Key: documents.location,
    };

    s3.getObject(params, function(err, data) {
      if (err) {
        return res.json({ status: 400, success: false, error: 'Document does not exist' });
      }

      return res.json({ status: 200, success: true, result: Buffer.from(data.Body, 'binary').toString() });
    });


  } catch (err) {
    return res.json({ status: 400, success: false, error: 'Something went wrong, Try again later !' });
  }
});


module.exports = router;
