const { Router } = require('express');
const LoginService = require('../services/LoginService');
const bcrypt = require('bcryptjs');
const Login = require('../models/Login');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()

  .post('/', async (req, res, next) => {
    // pull list of users to see if matching
    const allUsers = await Login.getAllUsers();
    console.log('allUsers :>> ', allUsers);
    console.log('req.body :>> ', req.body.username);
    // look into an include and filter statement
    const found = allUsers.find((el) => el.username === req.body.username);
    console.log('🚀 ~ file: logins.js ~ line 26 ~ .post ~ found', found);

    allUsers.map((user) => {
      let users = user.username.includes('Yon Yonson');
      console.log('users :>> ', users);
    });

    if (!found) {
      const user = await LoginService.create(req.body);
      const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      try {
        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/stocks');

        // res.send(user);
      } catch (error) {
        next(error);
      }
    } else {
      try {
        const passwordHash = await bcrypt.hash(
         req.body.password,
          Number(process.env.SALT_ROUNDS)
        );
        console.log('passwordHash :>> ', passwordHash);
        console.log('req.body.password :>> ', req.body.password);
        const bcryptPasswordCompare = bcrypt.compareSync(
          found.getPasswordHash(),
          passwordHash
        );
        // console.log(
        //   '🚀 ~ file: logins.js ~ line 62 ~ .post ~ bcryptPasswordCompare',
        //   bcryptPasswordCompare
        // );

        if (!bcryptPasswordCompare) {
          // console.log('We hit the error');
          throw new Error('Invalid email or passowrd');
        }

        // const loginUser = await LoginService.create({
        //   username: found.username,
        //   password: req.body.password,
        //   phoneNumber: found.phoneNumber,
        //   email: found.email,
        // });
        // res.json(loginUser);

        const payload = jwt.sign(
          { ...found, password: passwordHash },
          process.env.JWT_SECRET,
          {
            expiresIn: '1 day',
          }
        );
        res
          .json(payload)
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/stocks');

      // if it does not create a new user
      // if (req.body) {

      // }

      // if it does then search the user table and find information about the useer

      // const user = await LoginService.create(req.body);

      // const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      //   expiresIn: '1 day',
      // });

      // try {
      //   res
      //     .cookie(process.env.COOKIE_NAME, payload, {
      //       httpOnly: true,
      //       maxAge: ONE_DAY_IN_MS,
      //     })
      //     .redirect('/api/v1/stocks');

      //   // res.send(user);
      // } catch (error) {
      //   next(error);
      // }

    } catch (error) {
      next(error);
    }
  }})

  .get('/:id', async (req, res, next) => {
    try {
      const user = await Login.getById(req.params.id);
      const stocks = await user.getStocks();

      res.send(stocks);
    } catch (error) {
      next(error);
    }
  })


  .delete('/logout', async (req, res, next) => {
    try {
      res.clearCookie(process.env.COOKIE_NAME).json({ success: true });
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
