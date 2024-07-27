import axios from 'axios';

export async function createUserApi(user) {
  try {
    const url = `http://localhost:5000/api/user/createUser`;
    const response = await axios.post(url, user, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserApi(user) {
  try {
    const url = `http://localhost:5000/api/user/adminUpdateUser`;

    // Remember to add correct api methods
    const response = await axios.put(url, user, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response; 
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function updateUserGroupApi(usergroup) {
   try {
    const url = `http://localhost:5000/api/group/updateUserGroup`;
    const response = await axios.post(url, usergroup, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response; 
  } catch (error) {
    console.error('Error updating user group:', error);
    throw error;
  }
}

export async function updateUserEmailApi(user) {
  try {
    console.log('updateUserEmailApi')
    const url = `http://localhost:5000/api/user/updateUserEmail`;
    console.log(user);
    const response = await axios.put(url, user, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response; 
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
  }
}

export async function updateUserPasswordApi(user) {
  try {
    const url = `http://localhost:5000/api/user/updateUserPassword`;
    const response = await axios.put(url, user, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response; 
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

export async function getUserApi() {
  try {
    const url = `http://localhost:5000/api/user/getByUsername`;
    const response = await axios.get(url, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.log('Error getting user:', error);
    throw error;
  }
}

export async function createGroupApi(groupName) {
  try {
    const url = "http://localhost:5000/api/group/createGroup";
    const response = await axios.post(url, {groupname: groupName}, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.log('Error creating group:', error);
    throw error;
  }
}

export async function getAllGroupsApi() {
  try {
    const url = `http://localhost:5000/api/group/getAllGroups`;
    const response = await axios.get(url, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch(error) {
    console.log('Error getting all groups:', error);
    throw error;
  }
}

export async function getAllUsersApi() {
  try {
    const url = `http://localhost:5000/api/user/getAllUsers`;
    const response = await axios.get(url, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.log('Error getting all users:', error);
    throw error;
  }
}

export async function loginApi(loginCred) {
  try {
    const url = 'http://localhost:5000/api/auth/login';
    const response = await axios.post(url, loginCred, {
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json'
        }
    });
    return response;
  } catch (error) {
    console.log('error logging in:', error)
    throw error;
  }
}