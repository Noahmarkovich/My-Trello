const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  query,
  getById,
  getByEmail,
  remove,
  update,
  add,
};

async function query() {
  try {
    const collection = await dbService.getCollection("user");
    const users = await collection.find().toArray();
    users = users.map((user) => {
      delete user.password;
      return user;
    });
    return users;
  } catch (err) {
    logger.error("cannot find users", err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ _id: userId });
    delete user.password;

    return user;
  } catch (err) {
    logger.error(`while finding user by id: ${userId}`, err);
    throw err;
  }
}
async function getByEmail(email) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ email });
    return user;
  } catch (err) {
    logger.error(`while finding user by email: ${email}`, err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection("user");
    await collection.deleteOne({ _id: ObjectId(userId) });
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}

async function update(user) {
  try {
    const userToSave = {
      _id: ObjectId(user._id),
      fullName: user.fullName,
    };
    const collection = await dbService.getCollection("user");
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
    return userToSave;
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err);
    throw err;
  }
}

async function add(user) {
  try {
    const userToAdd = {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      avatar: user.avatar,
    };
    const collection = await dbService.getCollection("user");
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (err) {
    logger.error("cannot add user", err);
    throw err;
  }
}
