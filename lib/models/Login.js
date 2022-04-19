const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class Login {
  id;
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

  static async delete(){

  }



};
