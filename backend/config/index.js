require("dotenv").config();

const config = {
  dbURL: process.env.DB_URL,
  dbName: process.env.DB_NAME,
};

config.isGuestMode = true;

module.exports = config;
