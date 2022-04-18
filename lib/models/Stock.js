const pool = require('../utils/pool');

module.exports = class Stock {
  id;
  name;
  ticker;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.ticker = row.ticker;
  }

  static async insert({ name, ticker }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        stocks (name, ticker)
      VALUES
        ($1, $2)
      RETURNING
        *
      `,
      [name, ticker]
    );

    return new Stock(rows[0]);
  }


  
};
