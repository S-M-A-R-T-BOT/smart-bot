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

    // look into an include and filter statement
    const found = allUsers.find((el) => el.username === req.body.username);

    if (!found) {
      try {
        const user = await LoginService.create(req.body);
        const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
          expiresIn: '1 day',
        });
        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/stocks');

      } catch (error) {
        next(error);
      }
    } else {
      try {
        const passwordHash = bcrypt.hashSync(
          req.body.password,
          Number(process.env.SALT_ROUNDS)
        );
        // console.log('!newpasswordhash', passwordHash, req.body.password, Number(process.env.SALT_ROUNDS));
        const bcryptPasswordCompare = bcrypt.compareSync(
          found.getPasswordHash(),
          passwordHash
        );
        // console.log('!bcrypt', bcryptPasswordCompare);

        if (!bcryptPasswordCompare) {
          throw new Error('Invalid email or password');
        }

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

      } catch (error) {
        next(error);
      }
    }
  })

  .post('/:username/:password', async (req, res, next) => {
    const userObj = {
      username: req.params.username,
      password: req.params.password,
      phoneNumber: 9000000000,
      email: '',
    };

    const user = await LoginService.create(userObj);

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
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const user = await Login.getById(req.params.id);

      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  .delete('/logout', authenticate, async (req, res, next) => {
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

      const unfollow = await Login.unfollowAll(req.params.user_id);

      res.send(unfollow);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:user_id/:stock_id', authenticate, async (req, res, next) => {
    try {
      const unfollow = await Login.unfollowById(
        req.params.user_id,
        req.params.stock_id
      );

      res.json(unfollow);
    } catch (error) {
      next(error);
    }
  });
