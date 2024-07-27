const validateUsername = (username) => {
  errors = [];
  if (username.length < 4) {
    errors.push('Username must be longer than 4 characters');
  }
  
  if (username.length > 20) {
    errors.push('Username must be shorter than 20 characters');
  }

  const spaceRegex = /\s/;
  if (spaceRegex.test(username)) {
    errors.push('Username must not contain any space');
  }

  const symboleRegex = /[^\w\s]/;
  if (symboleRegex.test(username)) {
    errors.push('Username not contain any symbols except underscore ');
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

module.exports = validateUsername