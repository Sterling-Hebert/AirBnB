// backend/routes/api/users.js
const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { response } = require("express");
const { Op } = require("sequelize");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid Email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("First name is required."),
  check("lastName")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Last name is required."),
  handleValidationErrors,
];

router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const validUserEmail = await User.findOne({
    where: { [Op.or]: [{ email }] },
  });
  if (validUserEmail) {
    res.status(403);
    return res.json({
      message: "User already exists",
      statusCode: 403,
      errors: ["User with email already exists"],
    });
  }
  const validUserUsername = await User.findOne({
    where: { [Op.or]: [{ username }] },
  });
  if (validUserUsername) {
    res.status(403);
    return res.json({
      message: "User already exists",
      statusCode: 403,
      errors: ["User with username already exists"],
    });
  }

  const user = await User.signup({
    firstName,
    lastName,
    email,
    username,
    password,
  });

  await setTokenCookie(res, user);

  return res.json({
    user: user,
  });
});

module.exports = router;
