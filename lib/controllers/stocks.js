const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Stock = require('../models/Stock');
const StockService = require('../services/StockService');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      console.log('|| req.user >', req.user);
      console.log('you are here');
      const stocks = await StockService.getRandomStock();
      console.log('|||||||STOCKS', stocks);
      res.send([req.user, stocks]); 
    } catch (error) {
      next(error);
    }
  })

  .post('/:ticker', async (req, res, next) => {
    try {
      const stock = await Stock.insert(req.body);
      res.send(stock);
    } catch (error) {
      next(error);
    }
  });
