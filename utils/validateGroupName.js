const validateGroupName = (groupname) => {
  errors = [];
  if (groupname.length < 4) {
    errors.push('Group Name must be longer than 4 characters');
  }
  
  if (groupname.length > 20) {
    errors.push('Group Name must be shorter than 20 characters');
  }

  const spaceRegex = /\s/;
  if (spaceRegex.test(groupname)) {
    errors.push('Group Name must not contain any space');
  }

  const symboleRegex = /[^\w\s]/;
  if (symboleRegex.test(groupname)) {
    errors.push('Group Name not contain any symbols except underscore ');
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

module.exports = validateGroupName;