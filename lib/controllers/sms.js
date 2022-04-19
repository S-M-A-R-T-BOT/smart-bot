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
  

//update user intervals
// .post('/update-interval', authenticate, async(req, res, next) => {
//   try {
//     const updateInterval = await smsService.updateInterval(req.body);

//     res.send(updateInterval);
//   } catch (error) {
//     next(error);
//   }
// })
  
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

      let resp;
      if (checkState === false){
        resp = await smsService.insertNewUserDefaultSMS(req.body[0].id);
      }

      const updateUser = {
        userId: req.body[0].id,
        interval: '5 Minutes',
        valuePlus: 0,
        valueMinus: 0
      };

      let updateRes;

      // console.log('|| req.body >', req.body[0].id);
      // console.log('|| updateUser.userId >', updateUser.userId);

      if(updateUser.userId === req.body[0].id){
        updateRes = await smsService.updateInterval(updateUser);
      }

      console.log('|| updateRes >', updateRes);

      res.json(updateRes);
    } catch (error) {
      next(error);
    }
  });
