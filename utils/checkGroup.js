const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Group = require('../models/Groups');

const checkgroup = catchAsyncErrors(async (username, groupname) => {
  try {
    const userGroup = new Group({ username: username, groupname: groupname });
    const checkUserGroupResult = await userGroup.checkGroup();
    console.log('checkUserGroupResult');
    console.log(checkUserGroupResult)
    if (checkUserGroupResult.length > 0) {
      return { inGroup: true }
    }
    return { inGroup: false, message: 'User is not in group' }
  } catch (error) {
    console.log(error)
    return { inGroup: false, message: error }
  }
})

module.exports = checkgroup;