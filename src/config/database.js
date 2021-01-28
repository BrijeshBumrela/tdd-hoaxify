const Sequalize = require("sequelize");

const sequelize = new Sequalize("hoaxify", "my-db-user", "db-pass", {
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

module.exports = sequelize;
