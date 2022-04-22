const pool = require('../utils/pool');

module.exports = class Stock {
  stock_id;
  name;
  ticker;

  constructor(row) {
    this.stock_id = row.stock_id;
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

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        stocks.stock_id,
        stocks.name,
        stocks.ticker,
        users.user_id,
        users.username
      FROM
        stocks
      LEFT JOIN
        user_stocks
      ON
        user_stocks.stock_id = stocks.stock_id
      LEFT JOIN
        users
      ON
        users.user_id = user_stocks.user_id
      WHERE
        stocks.stock_id=$1
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Stock(rows[0]);
  }

  async aggUsers(){
    const { rows } = await pool.query(
      `
        SELECT SUM(user_stocks.user_id)
        FROM user_stocks
        WHERE user_stocks.stock_id=$1
      `,
      [this.stock_id]
    );

    this.users = rows[0];

    return this;
  }

  async getUsers() {
    const { rows } = await pool.query(
      `
      SELECT
        users.user_id,
        users.username
      FROM
        users
      LEFT JOIN
        user_stocks
      ON
        users.user_id = user_stocks.user_id
      WHERE
        user_stocks.stock_id=$1
      `,
      [this.stock_id]
    );

    this.users = rows;

    return this;
  }


};
