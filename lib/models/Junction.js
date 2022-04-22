const pool = require('../utils/pool');

module.exports = class Junction {
  user_id;
  stock_id;

  constructor(row) {
    this.user_id = row.user_id;
    this.stock_id = row.stock_id;
  }

  static async insert({ user_id, stock_id }) {
    const { rows } = await pool.query(
      `
            INSERT INTO
                user_stocks (user_id, stock_id)
            VALUES
                ($1, $2)
            RETURNING
                *
            `,
      [user_id, stock_id]
    );

    return new Junction(rows[0]);
  }
};
