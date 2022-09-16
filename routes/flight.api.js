const express = require("express");
const { body } = require("express-validator");
const { createFlight } = require("../controller/flight.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();

// create flight
router.post(
  "/",
  authentication.loginRequired,
  validations.validate([
    body("nameAirlines", "invalid nameAirlines")
      .exists()
      .isString()
      .isIn([
        "Vietnam Airlines",
        "Vietjet Air",
        "Jetstar Pacific Airlines",
        "Bamboo Airways",
      ]),
    body("namePlane", "invalid namePlane").exists().notEmpty(),
    body("codePlane", "invalid codePlane").exists().isString().notEmpty(),
    body("from", "invalid from").exists().isString().notEmpty(),
    body("to", "invalid to").exists().isString().notEmpty(),
    body("timeFrom", "invalid timeFrom").exists().notEmpty(),
    body("timeTo", "invalid timeTo").exists().notEmpty(),
    body("price", "invalid price").exists().notEmpty(),
  ]),
  createFlight
);
module.exports = router;
