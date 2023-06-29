import { store } from './store';

import { userService } from '../services/user.service';
import { SET_USER } from './user.reducer.js';

export async function signup(credentials) {
  try {
    const user = await userService.signup(credentials);
    store.dispatch({
      type: SET_USER,
      user
    });

    return user;
  } catch (err) {
    console.log('Cannot signup', err);
    throw err;
  }
}

export async function login(credentials) {
  try {
    const user = await userService.login(credentials);
    store.dispatch({
      type: SET_USER,
      user
    });

    return user;
  } catch (err) {
    console.log('Cannot login', err);
    throw err;
  }
}
