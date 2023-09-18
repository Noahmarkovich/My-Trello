const boardService = require("./board.service.js");
const socketService = require("../../services/socket.service");

const logger = require("../../services/logger.service");
const asyncLocalStorage = require("../../services/als.service.js");

async function getBoards(req, res) {
  try {
    logger.debug("Getting boards");
    const boards = await boardService.query();
    res.json(boards);
  } catch (err) {
    logger.error("Failed to get boards", err);
    res.status(500).send({ err: "Failed to get boards" });
  }
}

async function getBoardById(req, res) {
  try {
    const boardId = req.params.id;
    const board = await boardService.getById(boardId);
    board["lastVisited"] = Date.now();
    const currBoard = await boardService.update(board);
    res.json(currBoard);
  } catch (err) {
    logger.error("Failed to get board", err);
    res.status(500).send({ err: "Failed to get board" });
  }
}

async function addBoard(req, res) {
  try {
    const board = req.body;
    const loggedinUser = asyncLocalStorage.getStore().loggedinUser;
    board["createdBy"] = loggedinUser;
    const addedBoard = await boardService.add(board);
    res.json(addedBoard);
  } catch (err) {
    logger.error("Failed to add board", err);
    res.status(500).send({ err: "Failed to add board" });
  }
}

async function updateBoard(req, res) {
  try {
    const board = req.body;
    const updateBoard = await boardService.update(board);
    const loggedinUser = asyncLocalStorage.getStore().loggedinUser || {
      _id: utilService.makeId(),
    };
    socketService.broadcast({
      type: "changed-board",
      data: updateBoard,
      room: updateBoard._id,
      userId: loggedinUser?._id,
    });

    res.json(updateBoard);
  } catch (err) {
    logger.error("Failed to update board", err);
    res.status(500).send({ err: "Failed to update board" });
  }
}

async function removeBoard(req, res) {
  try {
    const boardId = req.params.id;
    console.log(boardId);
    const removedId = await boardService.remove(boardId);
    res.send(removedId);
  } catch (err) {
    logger.error("Failed to remove board", err);
    res.status(500).send({ err: "Failed to remove board" });
  }
}

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
};
