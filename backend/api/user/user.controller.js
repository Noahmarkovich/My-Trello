const userService = require("./user.service");
const logger = require("../../services/logger.service");

async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id);
    res.send(user);
  } catch (err) {
    logger.error("Failed to get user", err);
    res.status(500).send({ err: "Failed to get user" });
  }
}

module.exports = {
  getUser,
};
