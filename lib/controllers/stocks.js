const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const StockService = require('../services/StockService');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const stocks = await StockService.getRandomStock();

      res.send([req.user, stocks]); 
    } catch (error) {
      next(error);
    }
  });
