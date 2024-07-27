const validatePassword = (password) => {
  errors = [];

  if (password.length < 8) {
    errors.push('Password must be longer than 8 characters');
  }
  if (password.length > 10) {
    errors.push('Password must be shorter than 10 characters');
  } 

  alphanumericRegex = /[a-zA-Z0-9]/;
  if (!alphanumericRegex.test(password)) {
    errors.push("Password is not alphanumeric");
  }

  symbolRegex = /[^a-zA-Z0-9\s]/;
  if (!symbolRegex.test(password)) {
    errors.push("Password does not contain symbols");
  }
  
  if (errors.length > 0) {
    return {
      status: 400,
      message: errors.join('\n')
    }
  } else {
    return { status: 200 }
  }
}

module.exports = validatePassword;