const express = require('express');
const router = express.Router();
const { getAllGroups, createGroup, updateUserGroup, getGroupByUsername } = require('../controllers/groupController'); 
const verifyToken = require('../utils/verifyToken');

// route api/group
router.route('/getAllGroups').get(verifyToken, getAllGroups);
router.route('/createGroup').post(verifyToken, createGroup);
router.route('/updateUserGroup').post(verifyToken, updateUserGroup);
router.route('/getGroupByUsername/:username').get(getGroupByUsername);

module.exports = router
