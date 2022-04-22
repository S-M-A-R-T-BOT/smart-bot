const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Stock = require('../models/Stock');
const StockService = require('../services/StockService');

module.exports = Router()
// get random stocks:
  .post('/', authenticate, async (req, res, next) => {
    try {
      const stocks = await StockService.getRandomStock();

      res.send([req.user, stocks]); 
    } catch (error) {
      next(error);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {

      const stocks = await StockService.getRandomStock();
      // console.log(`|| req.user, stocks >`, req.user, stocks);
      res.send([req.user, stocks]); 
    } catch (error) {
      next(error);
    }
  })

  // add a stock to the "watched stocks" table
  .post('/add', authenticate, async (req, res, next) => {
    try {
      const stock = await Stock.insert(req.body);      
      res.send(stock);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const stock = await Stock.getById(req.params.id);

      const users = await stock.getUsers();

      res.json(users);
    } catch (error) {
      next(error);
    }
  })
  
  .get('/symbol/:symbol', async (req, res, next) => {
    try {
      const stock = await StockService.getStockBySymbol(req.params.symbol);
      // console.log('STOCKSSSSSSS', stock);
      // console.log(stockPrice);
      res.send(stock);
    } catch (error) {
      next(error);
    }
  })
  
  .get('/trackers/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
    
      const stock = await Stock.getById(id);
      const users = await stock.aggUsers();

      res.send(users);
    } catch (error) {
      next(error);
    }
  });

