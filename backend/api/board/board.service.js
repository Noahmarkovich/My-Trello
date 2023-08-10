const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const utilService = require("../../services/util.service");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");

async function query() {
  try {
    const collection = await dbService.getCollection("board");
    var boards = await collection.find().toArray();
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
    logger.error(`while finding car ${boardId}`, err);
    throw err;
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    await collection.deleteOne({ _id: boardId });
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
