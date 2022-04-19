const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const Login = require('../models/Login');


module.exports = class LoginService {
  static async create({ username, password, phoneNumber, email }) {
    const passwordHash = bcrypt.hashSync(
      password, 
      Number(process.env.SALT_ROUNDS)
    );
    return Login.insert({
      username,
      passwordHash,
      phoneNumber,
      email
    });
  }



};
