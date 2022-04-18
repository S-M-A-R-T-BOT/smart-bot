const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
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
  });
