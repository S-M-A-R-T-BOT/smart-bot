const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const Login = require('../models/Login');


module.exports = class LoginService {
  static async create({ username, password, phoneNumber, email }) {
    const passwordHash = bcrypt.hashSync(
      password, 
      Number(process.env.SALT_ROUNDS)
    );
    
    console.log('!passwordHash', passwordHash, password, Number(process.env.SALT_ROUNDS));
    const thing = await Login.insert({
      username,
      passwordHash,
      phoneNumber,
      email
    });

    return thing;
  }



};
