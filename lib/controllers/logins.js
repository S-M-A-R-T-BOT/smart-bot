const { Router } = require('express');
const LoginService = require('../services/LoginService');
const authenticate = require('../middleware/authenticate');
const Login = require('../models/Login');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await LoginService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  });
