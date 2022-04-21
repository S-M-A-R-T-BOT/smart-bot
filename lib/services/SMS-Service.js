// const fetch = require('cross-fetch');
const res = require('express/lib/response');
const SMS = require('../models/SMS');

module.exports = class SmsService{
  static async getAllSms(){
    const fetchSMS = await SMS.getAllSms();

    return fetchSMS;
  }

  static async insertNewUserDefaultSMS(id){
    const insertRow = await SMS.insertNewRow(id);

    return insertRow;
  }

  static async updateInterval(userUpdate){
    const updateInterval = await SMS.updateInterval(userUpdate);

    return updateInterval;
  }

  static async updatePhNum(userObj){
    console.log('|| userObj25 >', userObj);
    const updatePhone = await SMS.updatePhNum(userObj);
    console.log('||updatephone27 NEW', updatePhone);

    return updatePhone;
  }
};
