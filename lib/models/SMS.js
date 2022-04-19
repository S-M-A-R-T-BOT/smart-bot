const pool = require('../utils/pool');

module.exports = class SMS {
  id;
  smsInterval;
  valuePlus;
  valueMinus;
  userId;

  constructor(row){
    this.id = row.id;
    this.smsInterval = row.sms_interval;
    this.valuePlus = row.value_plus;
    this.valueMinus = row.value_minus;
    this.userId = row.users;
  }

  static async getAllSms(){
    const { rows } = await pool.query(
      `
        SELECT *
        FROM sms_intervals
      `
    );

    return rows.map(row => new SMS(row));
  }

  static async insertNewRow(id){
    const { rows } = await pool.query(
      `
        INSERT INTO sms_intervals (users)
        VALUES($1)
        RETURNING *
      `,
      [id]
    );

    return new SMS(rows[0]);
  }
};
