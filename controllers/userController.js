// userController.js

const User = require("../models/Users");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const validatePassword = require('../utils/validatePassword');
const validateUsername = require('../utils/validateUsername');
const checkgroup = require('../utils/checkGroup');

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const username = req.verifyToken.tokenUsername;
      const checkGroupResponse = await checkgroup(username, 'admin');
      if (!checkGroupResponse.inGroup) {
        return res.status(400).json({ success: false, message: 'Unauthorized, User logged in is not an admin' })
      }
      const users = await User.getAllUsers();
      console.log('users');
      console.log(users);
      return res.status(200).json({ success: true, users: users })
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error })
  }
})

exports.getByUsername = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const username = req.verifyToken.tokenUsername;
      console.log(username);
      const currentUser = new User({ username: username });
      const user = await currentUser.getByUsername();
      return res.status(200).json({ success: true, user: user })
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error })
  }
})


exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const tokenUsername = req.verifyToken.tokenUsername;
      const checkGroupResponse = await checkgroup(tokenUsername, 'admin');
      if (!checkGroupResponse.inGroup) {
        return res.status(400).json({ success: false, message: 'Unauthorized, User logged in is not an admin' })
      }
      const { username, password, email, disabled } = req.body
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email cannot be empty' });
      }

      const validateUsernameResult = validateUsername(username);
      if (validateUsernameResult.status == 400) {
        return res.status(400).json({ message: validateUsernameResult.message });
      }

      const validatePasswordResult = validatePassword(password);
      if (validatePasswordResult.status == 400) {
        return res.status(400).json({ message: validatePasswordResult.message });
      }

      const newUser = new User({ username, password, email, disabled })
      const result = await newUser.save()
      console.log(result)

      return res.status(200).json({ message: "User created successfully" })
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    console.error("Error in user controller:", error)
    return res.status(400).json({ message: error })
  }
})

exports.adminUpdateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const tokenUsername = req.verifyToken.tokenUsername;
      const checkGroupResponse = await checkgroup(tokenUsername, 'admin');
      if (!checkGroupResponse.inGroup) {
        return res.status(400).json({ success: false, message: 'Unauthorized, User logged in is not an admin' })
      }
      const { username, password, email, disabled } = req.body
      if (username == 'admin') {
        return res.status(200).json({ message: "Cannot edit admin details" });
      }
      
      if (password) {
        const validatePasswordResult = validatePassword(password);
        if (validatePasswordResult.status == 400) {
          res.status(400).json({ message: validatePasswordResult.message });
        }
      }

      const updateUser = new User({ username, password, email, disabled })
      const result = await updateUser.adminUpdateUser();

      res.status(200).json({ message: "User updated successfully" })
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
    } catch (error) {
      console.error("Error in user controller:", error)
      res.status(400).json({ message: "Internal Server Error" })
    }
})

exports.updateEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const tokenUsername = req.verifyToken.tokenUsername;
      const { username } = req.body;
      if (tokenUsername != username.toLowerCase()) {
        return res.status(400).json({ message: "Unauthorized to edit email" });
      }
      if (username == 'admin') {
        return res.status(400).json({ message: "Cannot edit admin" });
      }
      const updateUser = new User(req.body);
      await updateUser.updateEmail().then(response => {
          return res.status(200).json({ success: true, message: 'Email updated successfully' });
      })   
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(400).json({ message: error });
  }
});


exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.verifyToken.tokenVerified) {
      const tokenUsername = req.verifyToken.tokenUsername;
      const { username, password } = req.body;
      if (tokenUsername != username.toLowerCase()) {
        return res.status(400).json({ message: "Unauthorized to edit password" });
      }
      if (username == 'admin') {
        return res.status(400).json({ message: "Cannot edit admin" });
      }
      if (password) {
        const validatePasswordResult = validatePassword(password);
        if (validatePasswordResult.status == 400) {
          res.status(400).json({ message: validatePasswordResult.message });
        }
      }
      const updateUser = new User(req.body);
      const result = await updateUser.updatePassword;
      return res.status(200).json({ success: true, message: 'Password updated successfully' });  
    } else {
      return res.status(400).json({ success: false, message: req.verifyToken.tokenMessage })
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(400).json({ message: error });
  }
});

// exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
//   try {
//     if (req.verifyToken.tokenVerified) {
//       const tokenUsername = req.verifyToken.tokenUsername;
//       const { username, password } = req.body;
//       if (tokenUsername != username.toLowerCase()) {
//         return res.status(404).json({ message: "Unauthorized to edit password" });
//       }
//       const validatePasswordResult = validatePassword(password);
//       if (validatePasswordResult.status == 400) {
//         return res.status(404).json({ message: validatePasswordResult.message });
//       }
//       const updateUser = new User(req.body);
//       const numRowsAffected = await updateUser.updatePassword();
//       console.log(numRowsAffected)
//       return res.status(200).json({
//         success: true,
//         message: 'Password updated successfully',
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: req.verifyToken.tokenMessage
//       })
//     }
//   } catch (error) {
//     console.error("Error updating password:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
