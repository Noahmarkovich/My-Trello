const express = require("express");
const {
  requireAuth,
  requireAdmin,
} = require("../../middlewares/requireAuth.middleware");
const { log } = require("../../middlewares/logger.middleware");
const {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
} = require("./board.controller");
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get("/", requireAuth, getBoards);
router.get("/:id", requireAuth, getBoardById);
router.post("/", addBoard);
router.put("/:id", updateBoard);
router.delete("/:id", removeBoard);

module.exports = router;
