const fetch = require('cross-fetch');

module.exports = class SearchService {
    static async getStockBySymbol(symbol) {
        const searchStock = await fetch(`https://finnhub.io/api/v1/search?q=${symbol}&token=${process.env.FINNHUB_TOKEN}`);
        const stock = await searchStock.json();
        
        const stockModel = {
            description: stock.description,
            exchange: stock.exchange,
            symbol: stock.symbol,
            type: stock.type
        };

        // return stockModel;
        searchStock.map((stock) => {
            return (stock.stock.type)
        });
        
    }
};
