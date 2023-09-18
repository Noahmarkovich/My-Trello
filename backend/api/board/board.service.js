const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const asyncLocalStorage = require("../../services/als.service.js");

const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");

async function query() {
  try {
    const loggedinUser = asyncLocalStorage.getStore().loggedinUser;
    const collection = await dbService.getCollection("board");
    let boards;
    console.log(loggedinUser._id);
    if (loggedinUser._id === "65030aa092fc590fa4547a47") {
      boards = await collection.find().toArray();
    } else if (loggedinUser._id.length < 5) {
      boards = await collection
        .find({
          $or: [
            { "createdBy._id": loggedinUser._id },
            { "members._id": loggedinUser._id },
          ],
        })
        .toArray();
    } else {
      boards = await collection.find({
        $or: [
          { "createdBy._id": ObjectId(loggedinUser._id) },
          { "members._id": ObjectId(loggedinUser._id) },
        ],
      });
    }

    return boards;
  } catch (err) {
    logger.error("cannot find boards", err);
    throw err;
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    const board = collection.findOne({ _id: ObjectId(boardId) });
    return board;
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err);
    throw err;
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    await collection.deleteOne({ _id: ObjectId(boardId) });
    return boardId;
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err);
    throw err;
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection("board");
    await collection.insertOne(board);
    return board;
  } catch (err) {
    logger.error("cannot insert board", err);
    throw err;
  }
}

async function update(board) {
  try {
    const boardToSave = {
      title: board.title,
      isStarred: board.isStarred,
      archivedAt: board.archivedAt,
      createdBy: board.createdBy,
      style: board.style,
      labels: board.labels,
      members: board.members,
      groups: board.groups,
      activities: board.activities,
      lastVisited: board.lastVisited,
    };
    const collection = await dbService.getCollection("board");
    await collection.updateOne(
      { _id: ObjectId(board._id) },
      { $set: boardToSave }
    );
    return board;
  } catch (err) {
    logger.error(`cannot update board ${board._id}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
