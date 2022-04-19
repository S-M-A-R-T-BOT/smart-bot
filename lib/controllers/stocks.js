const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Stock = require('../models/Stock');
const { getStockBySymbol } = require('../services/StockService');
const StockService = require('../services/StockService');

module.exports = Router()
// get random stocks:
  .get('/', authenticate, async (req, res, next) => {
    try {

      console.log('|| req.user >', req.user);
      console.log('you are here');

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
      console.log('||stock', stock); 
      const users = await stock.getUsers();
      console.log('|||users', users); 
      // delete users.id;
      
      res.send(users);
    } catch (error) {
      next(error);
    }
  })
  
  .get('/symbol/:symbol', async (req, res, next) => {
    try {
      const stock = await StockService.getStockBySymbol(req.params.symbol);
      console.log('STOCKSSSSSSS', stock);
      res.send(stock);
    } catch (error) {
      next(error);
    }
  });
