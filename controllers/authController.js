const User = require("../models/Users")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const bcrypt = require('bcryptjs');
const createToken = require('../utils/createToken');
const validateUsername = require('../utils/validateUsername');
const verifyToken = require('../utils/verifyToken');

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please enter email & Password" })
  }

  const validateUsernameResult = validateUsername(username);
  if (validateUsernameResult.status == 400) {
    return res.status(404).json({ message: "Username in wrong format" });
  } 

  const user = new User({ username, password });
  try {
    const getUser = await user.getByUsername();
    console.log('get user')
    console.log(getUser)
    if (!getUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (getUser.disabled) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const result = await bcrypt.compare(password, getUser.password);
    if (result) {
      const tokenResponse = await createToken(username, req, res);
      if (tokenResponse.success) {
        return res.status(200).json({ success: true, message: 'Logged in Successfully' });
      }
    } else {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error});
  }
})

exports.logout = catchAsyncErrors(async (req, res, next) => {
  try {
    // set cookie to empty value
    console.log(req.verifyToken);
    res.clearCookie('token');
    // res.cookie('token', '', { 
    //   expires: new Date(0),
    //   httpOnly: true, 
    //   secure: true, 
    //   sameSite: 'Strict'
    // });
    res.status(200).json({
        success : true,
        message : 'Logged out successfully.'
    });
  } catch(error) {
    console.log(error)
  }
});
