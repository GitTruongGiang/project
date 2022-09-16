const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const Airlines = require("../models/airlines");
const Flight = require("../models/flight");
const Plane = require("../models/plane");
const User = require("../models/user");

const flightController = {};
//create flight
flightController.createFlight = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const {
    nameAirlines,
    namePlane,
    codePlane,
    from,
    to,
    timeFrom,
    timeTo,
    price,
  } = req.body;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "user not found", "create flight error");

  const airlines = await Airlines.findOne({ name: nameAirlines });
  if (!airlines)
    throw new AppError(400, "airline not found", "create flight error");

  const plane = await Plane.findOne({ name: namePlane, codePlane });
  if (!plane) throw new AppError(400, "plane not found", "create flight error");

  let flight = await Flight.findOne({
    airlines: airlines._id,
    plane: plane._id,
    timeFrom,
    timeTo,
    codePlane: plane.codePlane,
  });
  if (flight) throw new AppError(400, "flight already", "create filght error");

  flight = await Flight.create({
    airlines,
    plane,
    codePlane,
    from,
    to,
    timeFrom,
    timeTo,
    price,
  });

  sendResponse(res, 200, true, {}, null, "create flight success");
});
module.exports = flightController;
