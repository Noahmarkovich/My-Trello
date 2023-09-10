export const utilService = {
  makeId,
  saveToStorage,
  loadFromStorage,
  randomColor,
  makeAnAvatar,
  isLastVisited
};

function makeId(length = 6) {
  let txt = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key);

  return data ? JSON.parse(data) : undefined;
}

function randomColor() {
  const x = Math.floor(Math.random() * 256);
  const y = 100 + Math.floor(Math.random() * 256);
  const z = 50 + Math.floor(Math.random() * 256);

  return 'rgb(' + x + ',' + y + ',' + z + ')';
}

function makeAnAvatar(fullName) {
  const initials = fullName.split(' ')[0][0] + fullName.split(' ')[1][0];
  const color = randomColor();

  return { initials, color };
}

function isLastVisited(lastVisited) {
  return Date.now() - lastVisited <= 3 * 1000 * 60 * 60 * 24;
}
