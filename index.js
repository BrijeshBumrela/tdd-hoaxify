const express = require("express");
const User = require("./src/user/User");

const app = express();
app.use(express.json());

app.post("/api/1.0/users", async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.create({ username, email, password });
  return res.send({ message: "user created" });
});

module.exports = app;
