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
  
  .post('/', authenticate, async (req, res, next) => {
    try {
      let currentIntervals = await smsService.getAllSms();
      let checkState = false;
      console.log('|| req.body sms >', req.body);
      for(const current of currentIntervals){
        if(current.id === req.body[0].user_id){
          // eslint-disable-next-line
          console.log('User ID has already been entered');
          checkState = true;
          res.send('User ID has already been entered');
        }
      }

      const previousIntervals = await smsService.getAllSms();

      if (checkState === false){
        await smsService.insertNewUserDefaultSMS(req.body[0].user_id);
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

      if(req.body[2].userId === req.body[0].user_id){
        updateRes = await smsService.updateInterval(req.body[2]);
      }

      console.log(`|| updateRes >`, updateRes);

      res.json(updateRes);
    } catch (error) {
      next(error);
    }
  })
  
  .patch('/update-phone', authenticate, async (req, res, next) => {
    console.log('|| req.body >', req.body);
    try {
      const newNumber = await smsService.updatePhNum(req.body);
      console.log('|| newNumber >', newNumber);
      // res.json(newNumber);
      res.send(newNumber);
    } catch (error) {
      next(error);
    }
  })
  
  .get('/send-sms', authenticate, async (req, res, next) => {
    const sid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const twilio = require('twilio')(sid, authToken);

    try {
      const resp = await twilio.messages.create({
        from: '+19705163541',
        to: '+15033177593',
        // to: `+1${req.body.ph_num}`,
        body: 'Let me know if you got this text.'
      });

      res.json(resp);
    } catch (error) {
      next(error);
    }
  });
