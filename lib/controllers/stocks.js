const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      console.log(`|| req.user >`, req.user);
      console.log('you are here');
      const stocks = await stocks.getRandomStock();
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });
