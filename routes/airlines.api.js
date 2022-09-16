const express = require("express");
const { body } = require("express-validator");
const { createAirlines } = require("../controller/airlines.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();
//create airlines
router.post(
  "/",
  authentication.loginRequired,
  validations.validate([
    body("name")
      .exists()
      .isString()
      .notEmpty()
      .isIn([
        "Vietnam Airlines",
        "Vietjet Air",
        "Jetstar Pacific Airlines",
        "Bamboo Airways",
      ]),
  ]),
  createAirlines
);
module.exports = router;
