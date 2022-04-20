const { Router } = require('express');
const LoginService = require('../services/LoginService');
const Login = require('../models/Login');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    const user = await LoginService.create(req.body);

    const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day'
    });

    try {
      res.cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      })
        .redirect('/api/v1/stocks');

    } catch (error) {
      next(error);
    }
  })
  
  .post('/:username/:password', async (req, res, next) => {
    // const user = await LoginService.create(req.body);

    // const username = req.params.username;
    // const password = req.params.password;

    console.log('|| username, password >', req.params.username, req.params.password);

    const userObj = {
      username: req.params.username,
      password: req.params.password,
      phoneNumber: 9000000000,
      email: ''
    };

    const user = await LoginService.create(userObj);

    console.log('|| user >', user);

    const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day'
    });

    try {
      res.cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      })
        .redirect('/api/v1/stocks');

    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    console.log('|| req.params.id >', req.params.id);
    try {
      const user = await Login.getById(req.params.id);

      console.log(`|| user >`, user);
      const stocks = await user.getStocks();
      console.log(`|| stocks >`, stocks);
      res.send(stocks);
    } catch (error) {
      next(error);
    }
  })

// delete stocks from user_stocks by id
// DOES NOT delete user
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      // const user = await Login.getById(req.params.id);
      // const stocks = await user.getStocks();
      // console.log('||stocks', stocks);
      const unfollow = await Login.unfollowAll(req.params.id);

      res.json(unfollow);
    } catch (error) {
      next(error);
    }

  })
  
  .delete('/:user_id/:stock_id', authenticate, async (req, res, next) => {
    try {
      // const user = await Login.getById(req.params.user_id);
      // const stocks = await user.getStocks();
      const unfollow = await Login.unfollowById(req.params.user_id, req.params.stock_id);

      res.json(unfollow);
    } catch (error) {
      next(error);
    }

  });
