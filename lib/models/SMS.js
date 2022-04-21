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
    console.log('|| id >', id);
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

  static async updateInterval({ userId, interval, valuePlus, valueMinus }){
    const { rows } = await pool.query(
      `
        UPDATE sms_intervals
        SET
          sms_interval=$2,
          value_plus=$3,
          value_minus=$4
        WHERE users=$1
        RETURNING *
      `,
      [userId, interval, valuePlus, valueMinus]
    );

    return new SMS(rows[0]);
  }

  // static async getExistingRow(){
  //   const { rows } = await pool.query(
  //     `
  //       SELECT *
  //       FROM sms_intervals
  //       WHERE id=$1
  //       RETURNING *
  //     `,
  //     [this.users]
  //   );
  //   return rows[0];
  // }

  static async updatePhNum(object){

    console.log(`|| object >`, object);
    const { rows } = await pool.query(
      `
        UPDATE users
        SET ph_num=$1
        WHERE user_id=$2
        RETURNING *
      `,
      [object.phoneNumber, object.user_id]
    );
    console.log('rows!!!85', rows);
    return rows[0];
    // return new SMS(rows[0]);
  }
};
