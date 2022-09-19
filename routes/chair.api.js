const express = require("express");
const { param } = require("express-validator");
const { createChair } = require("../controller/chair.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();

//create chair
router.post(
  "/:flightId",
  authentication.loginRequired,
  validations.validate([
    param("flightId").exists().custom(validations.checkObjectId),
  ]),
  createChair
);
module.exports = router;
