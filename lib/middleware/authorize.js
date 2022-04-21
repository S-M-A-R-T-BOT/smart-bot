const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const { session } = req.cookies;
    const payload = jwt.verify(session, process.env.JWT_SECRET);

    if (payload.username !== `${req.param.username}`){
      // ^try something like payload.id != `${req.param.id}`
      const error = new Error('You do not have access to view this page');
      error.status = 403;
      throw error;
    } 
    next();
  } catch (error) {
    next(error);
  }
};
