const fetch = require('cross-fetch');
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
    
    async function randomStock() {
      const stockIdNumber = Math.floor(Math.random() * stockArray.length);


      const data = stockArray[stockIdNumber];


      const fetchQuote = await fetch(`https://finnhub.io/api/v1/quote?symbol=${data}&token=${process.env.FINNHUB_TOKEN}`);
      const quote = await fetchQuote.json();
    
      const fetchProfile = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${data}&token=${process.env.FINNHUB_TOKEN}`);
      const profile = await fetchProfile.json();


      const timestamp = quote.t;
      const date = new Date(timestamp * 1000);
      const dateValues = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ];
      // alert(dateValues);

      const realDate = `${dateValues[1]}/${dateValues[2]}/${dateValues[0]}`;

      const stockModel = {
        ticker: profile.ticker,
        exchange: profile.exchange,
        name: profile.name,
        current: quote.c,
        change: quote.d,
        percentChange: quote.dp,
        date: realDate 
      };

      return stockModel;
    }

  }

};

