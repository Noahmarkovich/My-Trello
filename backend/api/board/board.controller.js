const boardService = require("./board.service.js");

const logger = require("../../services/logger.service");

async function getBoards(req, res) {
  try {
    logger.debug("Getting Cars");
    // const filterBy = {
    //   txt: req.query.txt || ''
    // }
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
    // console.log(board);
    res.json(currBoard);
  } catch (err) {
    logger.error("Failed to get board", err);
    res.status(500).send({ err: "Failed to get board" });
  }
}

async function addBoard(req, res) {
  // const {loggedinUser} = req

  try {
    const board = req.body;
    const addedBoard = await boardService.add(board);
    res.json(addedBoard);
  } catch (err) {
    logger.error("Failed to add car", err);
    res.status(500).send({ err: "Failed to add car" });
  }
}

async function updateBoard(req, res) {
  try {
    const board = req.body;
    const updateBoard = await boardService.update(board);
    console.log(updateBoard, "frombackend");
    res.json(updateBoard);
  } catch (err) {
    logger.error("Failed to update board", err);
    res.status(500).send({ err: "Failed to update board" });
  }
}

async function removeBoard(req, res) {
  try {
    const boardId = req.params.id;
    const removedId = await boardService.remove(boardId);
    res.send(removedId);
  } catch (err) {
    logger.error("Failed to remove board", err);
    res.status(500).send({ err: "Failed to remove board" });
  }
}

async function addCarMsg(req, res) {
  const { loggedinUser } = req;
  try {
    const carId = req.params.id;
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    };
    const savedMsg = await boardService.addCarMsg(carId, msg);
    res.json(savedMsg);
  } catch (err) {
    logger.error("Failed to update car", err);
    res.status(500).send({ err: "Failed to update car" });
  }
}

async function removeCarMsg(req, res) {
  const { loggedinUser } = req;
  try {
    const carId = req.params.id;
    const { msgId } = req.params;

    const removedId = await boardService.removeCarMsg(carId, msgId);
    res.send(removedId);
  } catch (err) {
    logger.error("Failed to remove car msg", err);
    res.status(500).send({ err: "Failed to remove car msg" });
  }
}

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addCarMsg,
  removeCarMsg,
};
