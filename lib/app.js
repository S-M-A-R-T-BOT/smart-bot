const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Built in middleware
app.use(express.json());
// app.use(require('cookie-parser'));
app.use(cookieParser());

// App routes
app.use('/api/v1/users', require('./controllers/logins'));
app.use('/api/v1/stocks', require('./controllers/stocks'));
app.use('/api/v1/sms', require('./controllers/sms'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
