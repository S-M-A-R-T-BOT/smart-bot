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

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        stocks.id,
        stocks.name,
        stocks.ticker
      FROM
        stocks
      WHERE
        stocks.id=$1
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Stock(rows[0]);
  }

  async getUsers() {
    const { rows } = await pool.query(
      `
      SELECT
        users.id,
        users.username
      FROM
        users
      LEFT JOIN
        user_stocks
      ON
        users.id = user_stocks.user_id
      WHERE
        user_stocks.stock_id=$1
      `,
      [this.stock_id]
    );

    this.users = rows;
    return this;
  }


};
