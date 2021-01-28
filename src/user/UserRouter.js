const express = require("express");
const bcrypt = require("bcrypt");

const User = require("./User");
const UserService = require("./UserService");

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const response = await UserService.save({ username, email, password });
  return res.send({ message: "user created" });
});

module.exports = router;
