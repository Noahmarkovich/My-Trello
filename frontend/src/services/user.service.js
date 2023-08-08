// import { storageService } from './async-storage.service';
import { httpService } from './http.service';
import { utilService } from './util.service';

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';
const STORAGE_KEY = 'user';

_createUsers();

export const userService = {
  getLoggedinUser,
  signup,
  login,
  logout
};

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

async function signup(userCred) {
  userCred.avatar = utilService.makeAnAvatar(userCred.fullName);

  // const user = await storageService.post('user', userCred);
  const user = await httpService.post('auth/signup', userCred);
  // socketService.login(user._id)

  return saveLocalUser(user);
}

async function login(userCred) {
  const user = await httpService.post('auth/login', userCred);
  console.log(user);
  if (user) {
    return saveLocalUser(user);
  }
}
async function logout() {
  // sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  // socketService.logout()
  return await httpService.post('auth/logout');
}

function saveLocalUser(user) {
  user = { _id: user._id, fullName: user.fullName, avatar: user.avatar, email: user.email };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));

  return user;
}

function _createUsers() {
  let users = utilService.loadFromStorage(STORAGE_KEY);
  if (!users || users.length === 0) {
    users = [
      {
        _id: 'u101',
        email: 'noahmarko93@gmail.com',
        password: '1234',
        fullName: 'Noah Markovich',
        avatar: { initials: 'NM', color: 'rgb(140, 88, 188)' }
      },
      {
        _id: 'u102',
        email: 'dorkopelevich@gmail.com',
        password: '12345',
        fullName: 'Dor Kopelevich',
        avatar: { initials: 'DK', color: 'rgb(101, 146, 223)' }
      }
    ];
    utilService.saveToStorage(STORAGE_KEY, users);
  }
}
