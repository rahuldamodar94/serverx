const bodyParser = require('body-parser');
const expressip = require('express-ip');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const rateLimiterRedisMiddleware = require('./middlewares/rateLimiterRedis');
const UserController = require('./controllers/userController');

const app = express();
app.use(rateLimiterRedisMiddleware);

app.get('/api/home', (req, res) => {
  res.json({message: 'success'});
});

// For parsing the incoming json.
app.use(bodyParser.json({ limit: '10mb' }));
// To limit the data being parsed from incoming json.
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// for cross platform api call.
app.use(cors());
// for getting IP information of users.
app.use(expressip().getIpInfoMiddleware);
// For securing headers
app.use(helmet());

// User api
app.use('/api/user', UserController);

module.exports = app;
