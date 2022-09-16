const express = require("express");
const { body } = require("express-validator");
const { createPlane } = require("../controller/plane.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();

//create plane
router.post(
  "/",
  authentication.loginRequired,
  validations.validate([
    body("name", "invalid name").exists().isString().notEmpty(),
    body("codePlane", "invalid codePlane").exists().isString().notEmpty(),
    body("nameAirlines", "invalid nameAirlines")
      .exists()
      .isString()
      .isIn([
        "Vietnam Airlines",
        "Vietjet Air",
        "Jetstar Pacific Airlines",
        "Bamboo Airways",
      ]),
  ]),
  createPlane
);
module.exports = router;
