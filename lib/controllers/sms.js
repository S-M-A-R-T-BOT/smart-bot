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
  
  .post('/newUser/', authenticate, async(req, res, next) => {
    // const { id } = req.params;
    console.log('|| req.body >', req.user);

    try {
      const sms = await smsService.getAllSms();

      console.log('|| sms >', sms);

      // create new users sms settings
      let checkState = false;
      for (const s of sms){
        if(s.id === req.user.user_id){
          // eslint-disable-next-line
            console.log('user ID has already been entered');
          checkState = true;
          break;
        }
      }

      let newUser;
      if (checkState === false){
        newUser = await smsService.insertNewUserDefaultSMS(req.user.user_id);
      }

      res.send(newUser);
    } catch (error) {
      next(error);
    }
  })
  
  .patch('/', authenticate, async (req, res, next) => {
    try {
      let currentIntervals = await smsService.getAllSms();
      let checkState = false;
      console.log('|| currentIntervals >', currentIntervals);

      for(const current of currentIntervals){
        if(current.id === req.body[0].user_id){
          // eslint-disable-next-line
          console.log('User ID has already been entered');
          checkState = true;
          res.send('User ID has already been entered');
          break;
        }
      }

      if (checkState === false){
        await smsService.insertNewUserDefaultSMS(req.body[0].user_id);
      }

      currentIntervals = await smsService.getAllSms();
      for(const current of currentIntervals){
        if(current.id === req.body[2].user_id){
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
      
      if(req.body[2].user_id === req.body[0].user_id){
        updateRes = await smsService.updateInterval(req.body[2]);
      }
      

      res.json(updateRes);
    } catch (error) {
      next(error);
    }
  })
  
  .patch('/update-phone', authenticate, async (req, res, next) => {
    try {
      const newNumber = await smsService.updatePhNum(req.body);

      console.log('|| newNumber >', newNumber);
      // res.json(newNumber);

      // res.send({ ...newNumber });
      res.send(newNumber);
    } catch (error) {
      next(error);
    }
  })
  
  .get('/send', authenticate, async (req, res, next) => {
    const sid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const twilio = require('twilio')(sid, authToken);

    try {
      const resp = await twilio.messages.create({
        from: process.env.TWILIO_NUMBER,
        to: process.env.CLIFFS_NUMBER,
        mediaUrl: ['https://finnhub.io/api/v1/quote?q=AAPL&token=sandbox_c9bimniad3i8r0u41s6g'],
        body: 'From cliff.'
      });

      res.json(resp);
    } catch (error) {
      next(error);
    }
  });
