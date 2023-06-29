import { storageService } from './async-storage.service';
import { utilService } from './util.service';

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

export const userService = {
  getLoggedinUser,
  signup,
  login
};

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

async function signup(userCred) {
  userCred.avatar = utilService.makeAnAvatar(userCred.fullName);

  const user = await storageService.post('user', userCred);
  // const user = await httpService.post('auth/signup', userCred)
  // socketService.login(user._id)

  return saveLocalUser(user);
}

async function login(userCred) {
  const users = await storageService.query('user');
  const user = users.find((user) => user.email === userCred.email);
  // const user = await httpService.post('auth/login', userCred)
  if (user) {
    // socketService.login(user._id)
    if (userCred.password === user.password) {
      return saveLocalUser(user);
    } else {
      return 'Wrong password';
    }
  }
}

function saveLocalUser(user) {
  user = { _id: user._id, fullName: user.fullName, avatar: user.avatar, email: user.email };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));

  return user;
}
