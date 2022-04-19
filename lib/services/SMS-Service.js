// const fetch = require('cross-fetch');
const SMS = require('../models/SMS');

module.exports = class SmsService{
  static async getAllSms(){
    const fetchSMS = await SMS.getAllSms();

    return fetchSMS;
  }

  static async insertNewUserDefaultSMS(id){
    const insertRow = await SMS.insertNewRow(id);
    console.log(`|| insertRow >`, insertRow);
    return insertRow;
  }
};