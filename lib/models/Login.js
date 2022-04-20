const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class Login {
  user_id;
  username;
  phoneNumber;
  email;
  #passwordHash;

  constructor(row) {

    this.id = row.user_id;

    this.username = row.username;
    this.phoneNumber = Number(row.ph_num);
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ username, phoneNumber, email, passwordHash }) {
    const { rows } = await pool.query(
      `
          INSERT INTO
            users (username, ph_num, email, password_hash)
          VALUES
            ($1, $2, $3, $4)
          RETURNING
            *
          `,
      [username, phoneNumber, email, passwordHash]
    );

    return new Login(rows[0]);
  }


  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        stocks.stock_id,
        stocks.name,
        stocks.ticker,
        users.user_id,
        users.username,
        users.ph_num
      FROM
        users
      LEFT JOIN
        user_stocks
      ON
        user_stocks.user_id = users.user_id
      LEFT JOIN
        stocks
      ON
        user_stocks.stock_id = stocks.stock_id
      WHERE
        users.user_id=$1
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Login(rows[0]);

  }

  async getStocks() {
    const { rows } = await pool.query(
      `
      SELECT
        stocks.stock_id,
        stocks.name,
        stocks.ticker
      FROM
        stocks
      LEFT JOIN
        user_stocks
      ON
        stocks.stock_id = user_stocks.stock_id
      WHERE
        user_stocks.user_id=$1
      `,
      [this.id]
    );

    this.stocks = rows;
    return this;
  }

  static async unfollowAll(user_id) {
    const { rows } = await pool.query(
      `
      DELETE FROM 
        user_stocks
      WHERE
        user_id=$1
      RETURNING
        *
      `,
      [user_id]
    );
    console.log('||rows', rows);
    return rows;
  }




};
