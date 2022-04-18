// const fetch = require('cross-fetch');
// const stockData = require('./stock-list.js');
// const Stock = require('../models/Stock');
const stockArray =
[
  'AAPL',
  'MSFT',
  'GOOG',
  'AMZN',
  'TSLA',
  'FB',
  'NVDA',
  'WMT',
  'JPM',
  'XOM',
  'BAC',
  'PFE',
  'KO',
  'DIS',
  'CSCO',
  'INTC',
  'MCD',
  'AMD',
  'NFLX',
  'T',
  'BA',
  'GE',
  'F'
];


module.exports = class StockService {
  static async getRandomStock() {
    // const resp = await fetch('./stock-list.js');
   
    console.log('|stockArray', stockArray);
    console.log('here', Math.floor(Math.random() * stockArray.length));
    const stockIdNumber = Math.floor(Math.random() * stockArray.length);

    const data = stockArray[stockIdNumber];
    console.log('|data!', data);
    return data;
  }
};

