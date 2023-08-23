const Cryptr = require("cryptr");
const bcrypt = require("bcrypt");
const userService = require("../user/user.service");
const logger = require("../../services/logger.service");
const cryptr = new Cryptr(process.env.SECRET1 || "Secret-Puk-1234");

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
};

async function login(email, password) {
  logger.debug(`auth.service - login with email: ${email}`);

  const user = await userService.getByEmail(email);
  // console.log(match, 'from service');

  if (!user) return Promise.reject("Invalid username or password");

  // TODO: un-comment for real login
  const match = await bcrypt.compare(password, user.password);

  if (!match) return Promise.reject("Invalid username or password");

  delete user.password;
  user._id = user._id.toString();

  return user;
}

async function signup({ email, password, fullName, avatar }) {
  const saltRounds = 10;
  console.log({ email, password, fullName, avatar });
  logger.debug(
    `auth.service - signup with username: ${email}, fullname: ${fullName}`
  );
  if (!email || !password || !fullName)
    return Promise.reject("Missing required signup information");

  const userExist = await userService.getByEmail(email);
  if (userExist) return Promise.reject("email already taken");

  const hash = await bcrypt.hash(password, saltRounds);
  return userService.add({ email, password: hash, fullName, avatar });
}

function getLoginToken(user) {
  const userInfo = { _id: user._id, fullName: user.fullName };
  return cryptr.encrypt(JSON.stringify(userInfo));
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken);
    const loggedinUser = JSON.parse(json);
    return loggedinUser;
  } catch (err) {
    console.log("Invalid login token");
  }
  return null;
}
