const express = require("express");
const { body, param } = require("express-validator");
const {
  createPlane,
  getPlane,
  getListCreatePlane,
  deletePlane,
  updatePlane,
  listPlaneOfAirline,
} = require("../controller/plane.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();

//create plane
router.post(
  "/",
  authentication.loginRequired,
  validations.validate([
    body("name", "invalid name").exists().isString().notEmpty(),
    body("id", "invalid id").exists().isString(),
  ]),
  createPlane
);
//get plane
router.get(
  "/:airlinesId",
  authentication.loginRequired,
  validations.validate([
    param("airlinesId").exists().custom(validations.checkObjectId),
  ]),
  getPlane
);

router.post(
  "/acount",
  authentication.loginRequired,
  validations.validate([]),
  getListCreatePlane
);
router.delete(
  "/:planeId",
  authentication.loginRequired,
  validations.validate([
    param("planeId", "Invalid planeID")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  deletePlane
);
router.put(
  "/acount/update/:planeId",
  authentication.loginRequired,
  validations.validate([
    param("planeId", "invalid planeId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  updatePlane
);
router.post(
  "/acount/listPlaneOfAirline/:airlineId",
  authentication.loginRequired,
  validations.validate([
    param("airlineId", "airlineId invalid")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  listPlaneOfAirline
);
module.exports = router;
