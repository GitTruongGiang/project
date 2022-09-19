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
//create plane
planeController.createPlane = catchAsync(async (req, res, next) => {
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

  const code = plane.generateCodePlane(6);
  code.then(async (value) => {
    plane.codePlane = value;
    await plane.save();
  });

  await calculatePlaneCount(airlines._id);

  sendResponse(res, 200, true, { plane }, null, "create plane success");
});
//get plane
planeController.getPlane = catchAsync(async (req, res, next) => {
  const airlinesId = req.params.airlinesId;
  const airlines = await Airlines.findById(airlinesId);
  if (!airlines)
    throw new AppError(400, "airlines not found", "get plane error");

  let { page, limit, ...filterQuery } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filtercounditions = [{ authorAirlines: airlinesId }];
  if (filterQuery.name) {
    filtercounditions.push({
      name: { $regex: filterQuery.name, $options: "i" },
    });
  }

  const filterCriterial = filtercounditions.length
    ? { $and: filtercounditions }
    : {};

  const offset = (page - 1) * limit;
  const count = await Plane.countDocuments(filterCriterial);
  const totalPage = Math.ceil(count / limit);
  const plane = await Plane.find(filterCriterial)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  sendResponse(res, 200, true, { data: plane, count, totalPage });
});
module.exports = planeController;
