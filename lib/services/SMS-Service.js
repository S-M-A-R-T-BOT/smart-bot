// const fetch = require('cross-fetch');
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

  // static async updateIntervals(userInfo){
  //   // console.log('|| userInfo >', userInfo);
  //   const userObj = {
  //     userId: userInfo[0].id,
  //     interval: userInfo[2].interval,
  //     valuePlus: userInfo[2].valuePlus,
  //     valueMinus: userInfo[2].valueMinus
  //   };
  //   console.log('|| userObj >', userObj);

  //   const getCurrentIntervals = await SMS.getCurrentIntervals(userInfo[0].id);


    // const updateInterval = await SMS.updateInterval()
  // }
};
