const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  console.log('verify token called');
  console.log(token);
  if (!token) {
    console.log('Access denied. No token provided.')
    req.verifyToken = {
      tokenVerified: false,
      tokenMessage: 'Access denied. No token provided'
    }
    return next();
    // return { success: false, message: 'Access denied. No token provided.' };
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('decoded');
    console.log(decoded.username);
    req.verifyToken = {
      tokenVerified: true,
      tokenUsername: decoded.username
    }
    // return { success: true, tokenUsername: decoded.username };
  } catch (error) {
    req.verifyToken = {
      tokenVerified: false,
      tokenMessage: 'Access denied. No token provided.'
    }
    // console.log('Access denied. No token provided.')
  }
  next();
}

module.exports = verifyToken;