const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Stock = require('../models/Stock');
const StockService = require('../services/StockService');

module.exports = Router()
// get random stocks:
  .get('/', authenticate, async (req, res, next) => {
    try {

      const stocks = await StockService.getRandomStock();

      res.send([req.user, stocks]); 
    } catch (error) {
      next(error);
    }
  })

  // add a stock to the "watched stocks" table
  .post('/', async (req, res, next) => {
    try {
      const stock = await Stock.insert(req.body);      
      res.send(stock);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      // const userStocks = await Stock.getStocksByUser(req.params.id);
      const stock = await Stock.getById(req.params.id);

      const users = await stock.getUsers();

      // delete users.id;
      
      res.send(users);
    } catch (error) {
      next(error);
    }
  });
