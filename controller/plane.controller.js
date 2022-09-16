const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const Airlines = require("../models/airlines");
const Plane = require("../models/plane");
const User = require("../models/user");

const planeController = {};

const calculatePlaneCount = async (airlinesId) => {
  const countPlane = await Plane.countDocuments({
    authorAirlines: airlinesId,
  });
  await Airlines.findByIdAndUpdate(airlinesId, { countPlane });
};

planeController.createPlane = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "user not found", "create airline error");
  const { name, codePlane, nameAirlines } = req.body;
  const airlines = await Airlines.findOne({ name: nameAirlines });
  if (!airlines)
    throw new AppError(
      400,
      "airlines not found or name airlines not true",
      "create plane error"
    );
  let plane = await Plane.findOne({ codePlane });
  if (plane)
    throw new AppError(400, "code plane already", "create plane error");

  plane = await Plane.create({
    name,
    codePlane,
    authorAirlines: airlines,
  });

  await calculatePlaneCount(airlines._id);

  sendResponse(res, 200, true, { plane }, null, "create plane success");
});
module.exports = planeController;
