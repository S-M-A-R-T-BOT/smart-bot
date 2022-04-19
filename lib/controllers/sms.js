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
      const currentIntervals = await smsService.getAllSms();
      let checkState = false;
      for(const current of currentIntervals){
        if(current.id === req.body[0].id){
          // eslint-disable-next-line
          console.log('User ID has already been entered');
          checkState = true;
        }
      }

      if (checkState === false){
        await smsService.insertNewUserDefaultSMS(req.body[0].id);
      }

      const updateUser = {
        userId: req.body[0].id,
        interval: '5 Minutes',
        valuePlus: 0,
        valueMinus: 0
      } || {};

      let updateRes;

      if(updateUser.userId === req.body[0].id){
        updateRes = await smsService.updateInterval(updateUser);
      }

      console.log('|| updateRes >', updateRes);

      res.json(updateRes);
    } catch (error) {
      next(error);
    }
  });
