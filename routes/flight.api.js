const express = require("express");
const { body, param } = require("express-validator");
const {
  createFlight,
  getFlight,
  getFlightSingle,
  getListCreateFlight,
  updateFlight,
} = require("../controller/flight.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const { exists } = require("../models/airlines");
const router = express.Router();

// create flight
router.post(
  "/",
  authentication.loginRequired,
  validations.validate([
    body("nameAirlines", "invalid nameAirlines").exists().isString(),
    body("namePlane", "invalid namePlane").exists().notEmpty(),
    body("codePlane", "invalid codePlane").exists().isString().notEmpty(),
    body("from", "invalid from").exists().isString().notEmpty(),
    body("to", "invalid to").exists().isString().notEmpty(),
    body("fromDay").exists().notEmpty(),
    body("timeFrom", "invalid timeFrom").exists().notEmpty(),
    body("timeTo", "invalid timeTo").exists().notEmpty(),
    body("price", "invalid price").exists().notEmpty(),
  ]),
  createFlight
);
// get flight
router.post(
  "/flight",
  authentication.loginRequired,
  validations.validate([
    body("fromDay", "invalid fromDay").exists().notEmpty(),
  ]),
  getFlight
);
// get single flight
router.get(
  "/single",
  authentication.loginRequired,
  validations.validate([]),
  getFlightSingle
);
//-------------------
// acount user
router.get(
  "/acount",
  authentication.loginRequired,
  validations.validate([]),
  getListCreateFlight
);
// update flight
router.put(
  "/acount/:flightId",
  authentication.loginRequired,
  validations.validate([
    param("flightId", "invalid flightId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  updateFlight
);
module.exports = router;
