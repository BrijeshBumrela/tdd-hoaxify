const express = require("express");
const { check, validationResult } = require("express-validator");

const UserService = require("./UserService");

const router = express.Router();

router.post(
  "/",
  check("username")
    .notEmpty()
    .withMessage("username can not be null")
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage("username must be atleast 4 and atmost 32 characters long"),
  check("email")
    .notEmpty()
    .withMessage("email can not be null")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail()
    .custom(async (email) => {
      const user = await UserService.getOne({ email });
      if (user) {
        throw new Error("email already in use");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password can not be null")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters long")
    .bail()
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/)
    .withMessage("password must have atleast 1 lowercase, 1 uppercase and 1 number"),
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
