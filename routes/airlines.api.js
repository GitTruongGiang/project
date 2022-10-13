const express = require("express");
const { body } = require("express-validator");
const {
  createAirlines,
  getAirlines,
  getListCreateAirlines,
} = require("../controller/airlines.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();
//create airlines
router.post(
  "/",
  authentication.loginRequired,
  validations.validate([body("name").exists().isString().notEmpty()]),
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
module.exports = router;
