const express = require("express");
const { check, validationResult } = require("express-validator");

const UserService = require("./UserService");

const router = express.Router();

router.post(
  "/",
  check("username").notEmpty(),
  check("email").isEmail().notEmpty(),
  check("password").notEmpty(),
  async (req, res) => {
    const { username, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors.array().forEach((arr) => {
        validationErrors[arr.param] = arr.msg;
      });
      return res.status(400).send({ validationErrors });
    }

    const response = await UserService.save({ username, email, password });
    return res.send({ message: "user created" });
  },
);

module.exports = router;
