// groupController.js

const Group = require('../models/Groups');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors'); 
const validateGroupName = require('../utils/validateGroupName');
const checkgroup = require('../utils/checkGroup');

exports.getAllGroups = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log(req.verifyToken);
    if (req.verifyToken.tokenVerified) {
      const username = req.verifyToken.tokenUsername;
      const checkGroupResponse = await checkgroup(username, 'admin');
      if (!checkGroupResponse.inGroup) {
        return res.status(400).json({ success: false, message: 'Unauthorized, User logged in is not an admin' })
      }
      const groups = await Group.getAllGroups();
      console.log(groups);
      return res.status(200).json({ success : true, groups : groups })
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: error })
  }
})

exports.createGroup = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log('create group')
    console.log(req.verifyToken.tokenVerified)
    if (req.verifyToken.tokenVerified) {
      const tokenUsername = req.verifyToken.tokenUsername;
      const checkGroupResponse = await checkgroup(tokenUsername, 'admin');
      console.log(checkGroupResponse);
      if (!checkGroupResponse.inGroup) {
        return res.status(400).json({ success: false, message: 'Unauthorized, User logged in is not an admin' })
      }
      const { groupname } = req.body;
      const validateGroupNameResult = validateGroupName(groupname);
      if (validateGroupNameResult.status == 400) {
        return res.status(404).json({ success: false, message: validateGroupNameResult.message });
      }

      const getAllGroupsResults = await Group.getAllGroups();
      const exists = getAllGroupsResults.some(item => item.groupname === groupname);
      if (exists) {
        return res.status(404).json({ success: false, message: 'Group name already exists' });
      }

      const newGroup = new Group({ groupname });
      const result = await newGroup.save();

      return res.status(200).json({ success: true, message: 'Group created successfully' });
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error});
  }
});

exports.getGroupByUsername = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const tokenUsername = req.verifyToken.tokenUsername;
      const checkGroupResponse = await checkgroup(tokenUsername, 'admin');
      console.log(checkGroupResponse);
      if (!checkGroupResponse.inGroup) {
        return res.status(400).json({ success: false, message: 'Unauthorized, User logged in is not an admin' })
      }
      const { username } = req.params;
      const currentUser = new Group({ username });
      const user = await currentUser.getGroupByUsername()
      console.log(user)
      res.status(200).json({ success: true, user: user })
    } else {

    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error});
  }
})

exports.updateUserGroup = catchAsyncErrors(async (req, res) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const tokenUsername = req.verifyToken.tokenUsername;
      const checkGroupResponse = await checkgroup(tokenUsername, 'admin');
      if (!checkGroupResponse.inGroup) {
        return res.status(400).json({ success: false, message: 'Unauthorized, User logged in is not an admin' })
      }
      const { groups, username } = req.body;
      console.log('update user group')
      console.log(req.body);
      console.log(groups)
      const userGroup = new Group({ username });
      const getGroupByUsernameResult = await userGroup.getGroupByUsername();
      console.log('get group by username')
      console.log(getGroupByUsernameResult)

      // delete from db if user remove it in frontend, but was in db previously 
      for (let i = 0; i < getGroupByUsernameResult.length; i++) {
        const groupname = getGroupByUsernameResult[i].groupname;
        console.log('groupname group')
        console.log(groupname)
        if (!groups.includes(groupname)) {
          console.log('remove')
          grouptoRemove = new Group({ groupname, username })
          removeGroup = await grouptoRemove.removeUserGroup();
          console.log('remove group')
          console.log(removeGroup)
        }
      }

      for (let i = 0; i < groups.length; i++) {
        const userGroup = new Group({ groupname: groups[i], username });
        const result = await userGroup.updateUserGroup();
        console.log('update user group')
        console.log(result)
      }
    
      if (username == 'admin') {
        console.log('return admin')
        return res.status(202).json({ message: 'User Group added successfully' });
      }
      console.log('returnnot admin')
      res.status(200).json({ message: 'User Group added successfully' });
    } else {
      console.log('return verify token message')
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    console.log('error')
    console.log(error)
    res.status(400).json({ message: error});
  }
})


