const { Router } = require('express');
const LoginService = require('../services/LoginService');
const authenticate = require('../middleware/authenticate');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router();
