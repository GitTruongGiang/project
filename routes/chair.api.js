const express = require("express");
const { param } = require("express-validator");
const {
  getChair,
  updateChair,
  getsingleChair,
  getListBooking,
  cancelChair,
  getListChair,
  cancelFLight,
  updateUserChair,
} = require("../controller/chair.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();

//get chair
router.post(
  "/:flightId",
  authentication.loginRequired,
  validations.validate([
    param("flightId", "invalid FlightId")
      .exists()
      .isString()
      .custom(validations.checkObjectId),
  ]),
  getChair
);
// update chair
router.put(
  "/:chairId",
  authentication.loginRequired,
  validations.validate([
    param("chairId", "invalid chairId")
      .exists()
      .isString()
      .custom(validations.checkObjectId),
  ]),
  updateChair
);
//get single chair
router.get(
  "/",
  authentication.loginRequired,
  validations.validate([]),
  getsingleChair
);
router.get(
  "/listBooking",
  authentication.loginRequired,
  validations.validate([]),
  getListBooking
);
router.post(
  "/cancel/:chairId",
  authentication.loginRequired,
  validations.validate([
    param("chairId", "invalid chairId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  cancelChair
);
// cancel flight
router.post(
  "/cancel/flight/:chairId",
  authentication.loginRequired,
  validations.validate([
    param("chairId", "invalid chairId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  cancelFLight
);
// user acount
router.post(
  "/acount/:flightId",
  authentication.loginRequired,
  validations.validate([
    param("flightId", "invalid flightId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  getListChair
);
//deleted Chair
router.put(
  "/acount/:chairId",
  authentication.loginRequired,
  validations.validate([
    param("chairId", "invalid chairId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  updateUserChair
);
module.exports = router;
