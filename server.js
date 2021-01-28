const app = require("./index");
const sequelize = require("./src/config/database");

sequelize.sync();

app.listen(3000, () => {
  console.log("app is running");
});
