var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("hello words");
});
const userApi = require("./user.api");
const authApi = require("./auth.api");
const airlinesApi = require("./airlines.api");
const planeApi = require("./plane.api");
const flightApi = require("./flight.api");
//auth
router.use("/auth", authApi);
//users
router.use("/users", userApi);
//flight
router.use("/flights", flightApi);
//airlines
router.use("/airlines", airlinesApi);
//plane
router.use("/planes", planeApi);
module.exports = router;
