const { Router } = require('express');
const { agent } = require('supertest');
const request = require('supertest');
const app = require('../app');
const authenticate = require('../middleware/authenticate');
const smsService = require('../services/SMS-Service');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const smsArr = await smsService.getAllSms();

      res.json(smsArr);
    } catch (error) {
      next(error);
    }
  })
  
  .post('/newUser', authenticate, async(req, res, next) => {
    const { id } = req.user;
    try {
      const newUser = await smsService.insertNewUserDefaultSMS(id);
      res.send(newUser);
    } catch (error) {
      next(error);
    }
  })
  
  .post('/', authenticate, async (req, res, next) => {
    try {
      let currentIntervals = await smsService.getAllSms();
      let checkState = false;
      for(const current of currentIntervals){
        if(current.id === req.body[0].id){
          // eslint-disable-next-line
          console.log('User ID has already been entered');
          checkState = true;
          res.send('User ID has already been entered');
        }
      }

      if (checkState === false){
        await smsService.insertNewUserDefaultSMS(req.body[0].id);
      }

      currentIntervals = await smsService.getAllSms();

      for(const current of currentIntervals){
        if(current.id === req.body[2].id){
          if(req.body[2].interval === 0){
            req.body[2].interval = current.interval;
          }

          if(req.body[2].valuePlus === 0){
            req.body[2].valuePlus = current.valuePlus;
          }

          if(req.body[2].valueMinus === 0){
            req.body[2].valueMinus = current.valueMinus;
          }
        }
      }

      let updateRes;

      if(req.body[2].userId === req.body[0].id){
        updateRes = await smsService.updateInterval(req.body[2]);
      }

      res.json(updateRes);
    } catch (error) {
      next(error);
    }
  });
