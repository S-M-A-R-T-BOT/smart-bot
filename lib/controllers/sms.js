const { Router } = require('express');
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
  .post('/update-interval', authenticate, async(req, res, next) => {
    try {
      const updateInterval = await smsService.updateInterval(req.body);

      res.send(updateInterval);
    } catch (error) {
      next(error);
    }
  })
  
  .post('/', authenticate, async (req, res, next) => {
    try {
      const updateInterval = await smsService.updateIntervals(req.body);
    } catch (error) {
      next(error);
    }
  });
