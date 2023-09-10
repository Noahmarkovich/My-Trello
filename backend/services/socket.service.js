const logger = require("./logger.service");

let gIo = null;

function setupSocketAPI(http) {
  gIo = require("socket.io")(http, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    logger.info(`New connected socket [id: ${socket.id}]`);
    socket.on("disconnect", (socket) => {
      logger.info(`Socket disconnected [id: ${socket.id}]`);
    });
    socket.on("board-set-topic", (topic) => {
      if (socket.myTopic === topic) return;
      if (socket.myTopic) {
        socket.leave(socket.myTopic);
        logger.info(
          `Socket is leaving topic ${socket.myTopic} [id: ${socket.id}]`
        );
      }
      socket.join(topic);
      socket.myTopic = topic;
    });
  });
}

function emitTo({ type, data, label }) {
  if (label) gIo.to("watching:" + label.toString()).emit(type, data);
  else gIo.emit(type, data);
}

async function emitToUser({ type, data, userId }) {
  userId = userId.toString();
  const socket = await _getUserSocket(userId);

  if (socket) {
    logger.info(
      `Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`
    );
    socket.emit(type, data);
  } else {
    logger.info(`No active socket for user: ${userId}`);
  }
}

async function broadcast({ type, data, room = null, userId }) {
  userId = userId.toString();

  logger.info(`Broadcasting event: ${type}`);
  const excludedSocket = await _getUserSocket(userId);
  if (room && excludedSocket) {
    logger.info(`Broadcast to room ${room} excluding user: ${userId}`);
    excludedSocket.broadcast.to(room).emit(type, data);
  } else if (excludedSocket) {
    logger.info(`Broadcast to all excluding user: ${userId}`);
    excludedSocket.broadcast.emit(type, data);
  } else if (room) {
    gIo.to(room).emit(type, data);
  } else {
    logger.info(`Emit to all`);
    gIo.emit(type, data);
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets();
  const socket = sockets.find((s) => s.userId === userId);
  return socket;
}
async function _getAllSockets() {
  const sockets = await gIo.fetchSockets();
  return sockets;
}

module.exports = {
  setupSocketAPI,
  emitTo,
  emitToUser,

  broadcast,
};
