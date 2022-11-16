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
  const currentUserId = req.userId;
  const { name, codePlane, id } = req.body;
  const user = await User.findById(currentUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "create plane error");
  console.log(id);
  const airlines = await Airlines.findById(id);
  if (!airlines)
    throw new AppError(
      400,
      "airlines not found or name airlines not true",
      "create plane error"
    );
  console.log(airlines);
  let plane = await Plane.findOne({ codePlane });
  if (plane)
    throw new AppError(400, "code plane already", "create plane error");

  plane = await Plane.create({
    name,
    codePlane,
    authorAirlines: airlines,
    userCreate: currentUserId,
  });

  const code = plane.generateCodePlane(6);

  code.then(async (value) => {
    plane.codePlane = value;
    await plane.save();
  });

  await calculatePlaneCount(airlines._id);

  sendResponse(
    res,
    200,
    true,
    { planeId: plane._id },
    null,
    "create plane success"
  );
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
//
planeController.getListCreatePlane = catchAsync(async (req, res, next) => {
  const curenUserId = req.userId;
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(page) || 10;
  const user = await User.findById(curenUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "get list create flight error");
  const offset = limit * (page - 1);
  const count = await Plane.countDocuments({ userCreate: curenUserId });
  const totalPage = Math.ceil(count / limit);
  const planes = await Plane.find({ userCreate: curenUserId })
    .populate("authorAirlines")
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  if (!planes)
    throw new AppError(400, "planes not found", "get list flight error");

  sendResponse(
    res,
    200,
    true,
    { planes, count, totalPage },
    null,
    "get list airlines success"
  );
});
planeController.deletePlane = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const planeId = req.params.planeId;
  const user = await User.findById(currentUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "deleted plane error");
  const plane = await Plane.findByIdAndDelete(planeId);
  const planes = await Plane.find({ userCreate: currentUserId });
  sendResponse(res, 200, true, { planes }, null, "deleted plane success");
});
planeController.updatePlane = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const planeId = req.params.planeId;
  const user = await User.findById(currentUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "update plane error");
  let plane = await Plane.findById(planeId);
  if (!plane) throw new AppError(400, "plane not found", "update plane error");
  const allows = ["name", "chairCount"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      plane[field] = req.body[field];
    }
  });
  await plane.save();
  const planes = await Plane.find({ userCreate: currentUserId });
  sendResponse(res, 200, true, { planes }, null, "Update User Success");
});
planeController.listPlaneOfAirline = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const airlineId = req.params.airlineId;
  let { page, limit } = req.query;
  console.log(req.query);
  page = parseInt(page) || 1;
  limit = parseInt(page) || 10;
  const user = await User.findById(currentUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "update plane error");
  const offset = limit * (page - 1);
  const airline = await Airlines.findById(airlineId);
  if (!airline)
    throw new AppError(
      400,
      "airline not found",
      "get list plane of airline error"
    );
  const count = await Plane.countDocuments({
    userCreate: currentUserId,
    authorAirlines: airline._id,
  });
  const totalPage = Math.ceil(count / limit);
  console.log(totalPage);
  const planes = await Plane.find({
    userCreate: currentUserId,
    authorAirlines: airline._id,
  })
    .populate("authorAirlines")
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);
  if (!planes) sendResponse(res, 200, true, {}, null, "not plane");
  sendResponse(
    res,
    200,
    true,
    { planes, count, totalPage },
    null,
    "get list plane of airline success"
  );
});
module.exports = planeController;
