const { request } = require("express");
const Sequalize = require("sequelize");
const config = require("config");

const dbConfig = config.get("database");

const { database, username, password, ...rest } = dbConfig;

const sequelize = new Sequalize(database, username, password, {
  ...rest,
});

module.exports = sequelize;
