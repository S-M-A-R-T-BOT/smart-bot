const pool = require('../utils/pool');

module.exports = class Login {
  user_id;
  username;
  phoneNumber;
  email;
  #passwordHash;

  constructor(row) {

    this.user_id = row.user_id;

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

    if (!rows[0]) return null;
    return new Login(rows[0]);
  }

  static async getAllUsers() {
    const { rows } = await pool.query(
      `
      SELECT
      *
      FROM
        users
      `
    );
    return rows.map((row) => new Login(row));
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
    return rows;
    // return new Login(rows[0]);

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
console.log('rows :>> ', rows);
    return rows;
  }

  static async unfollowById(user_id, stock_id) {
    const { rows } = await pool.query(
      `
      DELETE FROM
        user_stocks
      WHERE
        user_id=$1 AND stock_id=$2
      RETURNING
        *
      `,
      [user_id, stock_id]
    );

    return rows;
  }

  getPasswordHash() {
    return this.#passwordHash;
  }
};
