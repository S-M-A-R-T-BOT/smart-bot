const { Router } = require('express');
const LoginService = require('../services/LoginService');
const authenticate = require('../middleware/authenticate');
const Login = require('../models/Login');
const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
// .post('/', async (req, res, next) => {
//   try {
//     const user = await LoginService.create(req.body);
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// })

  
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

      // res.send(user);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const user = await Login.getById(req.params.id);
      const stocks = await user.getStocks();

      res.send(stocks);
    } catch (error) {
      next(error);
    }
  })

// delete stocks from user_stocks by id
// DOES NOT delete user
  .delete('/:id', async (req, res, next) => {
    try {
      // const user = await Login.getById(req.params.id);
      // const stocks = await user.getStocks();
      // console.log('||stocks', stocks);
      const unfollow = await Login.unfollowAll(req.params.id);

      res.json(unfollow);
    } catch (error) {
      next(error);
    }
  });
  
  // .delete('/logout', async ());

