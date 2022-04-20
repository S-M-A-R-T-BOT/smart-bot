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

  // static async signIn({ email, password = '' }) {
  //   try {
  //     const user = email;
  //     const passwordHash =  await bcrypt.hash(
  //       password,
  //       Number(process.env.SALT_ROUNDS)
  //     );
  //     if (!bcrypt.compareSync(password, passwordHash)) {
  //       throw new Error('Invalid email or passowrd');
        
  //     }
  //   } catch (error) {
      
  //   }
  // }



};
