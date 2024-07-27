const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getByUsername, updateEmail, updatePassword, adminUpdateUser } = require('../controllers/userController');
const verifyToken = require('../utils/verifyToken');

// if you want to use middle ware on all routes
// Consider using router.use(verifyToken) on this line.

// route api/user
router.route('/getAllUsers').get(verifyToken, getAllUsers);
router.route('/createUser').post(verifyToken, createUser);
router.route('/getByUsername').get(verifyToken, getByUsername);
router.route('/updateUserEmail').put(verifyToken, updateEmail);
router.route('/updateUserPassword').put(verifyToken, updatePassword);
router.route('/adminUpdateUser').put(verifyToken, adminUpdateUser);

module.exports = router
