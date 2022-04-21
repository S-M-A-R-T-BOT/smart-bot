const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
  // const { session } = req.cookies;
    const cookie = req.cookies[process.env.COOKIE_NAME];
    
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (error) {
    error.message = 'You must be logged in to continue';
    error.status = 401;
    next(error);
  }
};
