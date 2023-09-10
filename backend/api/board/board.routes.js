const express = require("express");
const { requireAuth } = require("../../middlewares/requireAuth.middleware");

const {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
} = require("./board.controller");
const router = express.Router();

router.get("/", requireAuth, getBoards);
router.get("/:id", requireAuth, getBoardById);
router.post("/", addBoard);
router.put("/:id", updateBoard);
router.delete("/:id", removeBoard);

module.exports = router;
