const jwt = require('jsonwebtoken');

const createToken = async (username, req, res) => {
  try {
      const options = {
      username: username,
      startTime: Date.now(),
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };

    const token = jwt.sign(options, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: 'Strict'
    });
    console.log(token)
    return { success: true, message: 'Token created and cookie set successfully.', token };
  } catch (error) {
    console.error('Error creating token or setting cookie:', error);
    throw new Error('Failed to create token and set cookie');
  }
}

module.exports = createToken;