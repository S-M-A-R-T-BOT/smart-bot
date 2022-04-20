const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Stock = require('../models/Stock');
const { getStockBySymbol } = require('../services/StockService');
const StockService = require('../services/StockService');

module.exports = Router()
// get random stocks:
  .post('/', authenticate, async (req, res, next) => {
    console.log(`|| req.user >`, req.user);
    try {

      const stocks = await StockService.getRandomStock();
      console.log(`|| req.user, stocks >`, req.user, stocks);
      res.send([req.user, stocks]); 
    } catch (error) {
      next(error);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    console.log(`|| req.user >`, req.user);
    try {

      const stocks = await StockService.getRandomStock();
      console.log(`|| req.user, stocks >`, req.user, stocks);
      res.send([req.user, stocks]); 
    } catch (error) {
      next(error);
    }
  })

  // add a stock to the "watched stocks" table
  .post('/add', async (req, res, next) => {
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
      
      res.json(users);
    } catch (error) {
      next(error);
    }
  })
  
  .get('/symbol/:symbol', async (req, res, next) => {
    try {
      const stock = await StockService.getStockBySymbol(req.params.symbol);
      console.log('STOCKSSSSSSS', stock);
      const stockPrice = stock.c;
      console.log(stockPrice);
      res.send(stockPrice);
    } catch (error) {
      next(error);
    }
  });
