const express = require("express");
const { body, param } = require("express-validator");
const {
  createUser,
  updateUser,
  deletedUser,
  getUser,
} = require("../controller/user.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();

// get user me
router.get(
  "/me",
  authentication.loginRequired,
  validations.validate([]),
  getUser
);
//create user
router.post(
  "/",
  validations.validate([
    body("name", "invalid name").exists().notEmpty(),
    body("email", "invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("phone", "invalid phone").exists().isString(),
    body("city", "invalid city").exists().isString(),
    body("password", "invalid password").exists().notEmpty(),
  ]),
  createUser
);
//update user
router.put(
  "/:userId",
  authentication.loginRequired,
  validations.validate([
    param("userId").exists().isString().custom(validations.checkObjectId),
  ]),
  updateUser
);
// deleted user
router.delete(
  "/:userId",
  authentication.loginRequired,
  validations.validate([
    param("userId").exists().isString().custom(validations.checkObjectId),
  ]),
  deletedUser
);
module.exports = router;
