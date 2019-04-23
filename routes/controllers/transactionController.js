const express = require('express');
const router = express.Router();
const Transactions = require('../../db/models/validationAddress');
const ValidationAddress = require('../../db/models/validationAddress');
const Accounts = require('../../db/models/accounts');
const verifyAccount = require('../middlewares/verifyAccount');
const { body, validationResult } = require('express-validator/check');

router.post('/transact', [
  body('sender_address', 'A valid country is required').exists().isLength({ min: 1 }),
  body('receiver_address', 'A valid country name is required').exists().isLength({ min: 1 }),
  body('amount', 'A valid country name is required').exists().isLength({ min: 1 }),
  body('ip', 'A valid ip is required').exists().isIP(),
], verifyAccount, async(req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ status: 400, success: false, error: errors.array() });
  }

  let { sender_address, receiver_address, amount, ip} = req.body;

  let account = await Accounts.findOne({username: req.username}).exec();

  if (!account){
    return res.json({ status: 400, success: false, error: 'Account does not exist' });
  }

  let account_id = account._id;

  let sender = await ValidationAddress.findOne({address: sender_address}).exec();

  if (!sender){
    return res.json({ status: 400, success: false, error: 'Sender does not exist' });
  }

  let sender_user_id = sender.user_id;
  let sender_validation_address_id = sender._id;

  let receiver = await ValidationAddress.findOne({address: receiver_address}).exec();

  if (!receiver){
    return res.json({ status: 400, success: false, error: 'Receiver does not exist' });
  }

  let receiver_user_id = receiver.user_id;
  let receiver_validation_address_id = receiver._id;

  let transaction = new Transactions({
    sender_user_id: sender_user_id,
    sender_validation_address_id: sender_validation_address_id,
    sender_ip_address: ip,
    receiver_user_id: receiver_user_id,
    receiver_validation_address_id: receiver_validation_address_id,
    amount: amount,
    amount_usd: 5,
    suspicious_rate: 0,
    account_id: account_id,
  });

  transaction.save().then(doc => {
    return res.json({ status: 200, success: true, error: false});
  }).catch(err => {
    return res.json({ status: 400, success: false, error: err.message });
  });

});

module.exports = router;
