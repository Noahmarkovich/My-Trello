import { httpService } from './http.service';
import { utilService } from './util.service';

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

export const userService = {
  getLoggedinUser,
  signup,
  login,
  logout,
  getNewCredentials: getInitialUserData
};

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

async function signup(userCred) {
  userCred.avatar = utilService.makeAnAvatar(userCred.fullName);
  const user = await httpService.post('auth/signup', userCred);

  return saveLocalUser(user);
}

async function login(userCred) {
  const user = await httpService.post('auth/login', userCred);
  if (user) {
    return saveLocalUser(user);
  }
}
async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);

  return await httpService.post('auth/logout');
}

function saveLocalUser(user) {
  user = { _id: user._id, fullName: user.fullName, avatar: user.avatar, email: user.email };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));

  return user;
}

function getInitialUserData() {
  return {
    email: '',
    password: '',
    fullName: '',
    avatar: {}
  };
}
