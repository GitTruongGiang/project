const express = require("express");
const { body, param } = require("express-validator");
const {
  createPlane,
  getPlane,
  getListCreatePlane,
  deletePlane,
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
    body("nameAirlines", "invalid nameAirlines").exists().isString(),
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
module.exports = router;
