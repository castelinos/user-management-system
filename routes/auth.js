const express = require('express');
const router = express.Router();

const { loginUser, logout } = require('../controllers/authController');
const verifyToken = require('../utils/verifyToken');

// route api/auth
router.route('/login').post(loginUser);
router.route('/logout').post(verifyToken, logout);

module.exports = router;