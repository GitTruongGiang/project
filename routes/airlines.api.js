const express = require("express");
const { body, param } = require("express-validator");
const {
  createAirlines,
  getAirlines,
  getListCreateAirlines,
  deleteAirlines,
} = require("../controller/airlines.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();
//create airlines
router.post(
  "/",
  authentication.loginRequired,
  validations.validate([
    body("name", "invalid name").exists().isString().notEmpty(),
  ]),
  createAirlines
);
//get airlines
router.get(
  "/",
  authentication.loginRequired,
  validations.validate([]),
  getAirlines
);

router.get(
  "/acount",
  authentication.loginRequired,
  validations.validate([]),
  getListCreateAirlines
);
router.delete(
  "/:airlineId",
  authentication.loginRequired,
  validations.validate([
    param("airlineId", "inavalid arilineId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  deleteAirlines
);
module.exports = router;
