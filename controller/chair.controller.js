const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const mongoose = require("mongoose");
const Chair = require("../models/chair");
const Flight = require("../models/flight");
const User = require("../models/user");
const {
  createSendEmail,
  sendTo,
  renderEmail,
} = require("../heplers/templaneEmail");
const Airlines = require("../models/airlines");

const chairController = {};
const calculateUSerBookingCount = async (chair) => {
  const countUsers = await Chair.countDocuments({ status: chair.status });
  await Flight.findByIdAndUpdate(chair.flight, {
    userBookingCount: countUsers,
  });
  await sendTo({ template_key: "booking" });
};

//create chair
chairController.createChair = catchAsync(async (req, res, next) => {});
//get chair
chairController.getChair = catchAsync(async (req, res, next) => {
  const flightId = req.params.flightId;
  const flights = await Flight.findById(flightId).populate("plane");
  if (!flights)
    throw new AppError(400, "flights not found", "get chair flight error");

  const chairs = await Chair.find({ flight: flights._id }).sort({
    codeNumber: 1,
  });
  if (!chairs)
    throw new AppError(400, "chair not found", "get chair flight error");

  sendResponse(
    res,
    200,
    true,
    {
      chairs,
      chairCount: flights.plane.chairCount,
      rowChairCount: flights.plane.rowChairCount,
    },
    null,
    "get chair success"
  );
});
// update chair
chairController.updateChair = catchAsync(async (req, res, next) => {
  const chairId = req.params.chairId;
  const { status, userId } = req.body;

  let chair = await Chair.findById(chairId).populate("flight");
  if (!chair) throw new AppError(400, "chair not found", "update chair error");
  const flight = await Flight.findById(chair.flight).populate("airlines");
  const user = await mongoose
    .model("User")
    .findOne({ _id: userId, status: "no" });
  if (!user) throw new AppError(400, "user not found", "update chair error");

  if (chair.status === "none" && status === "pending") {
    chair.status = status;
    chair.user = user._id;
    await renderEmail({
      data: { flight, chair },
      to: user.email,
      template_key: "booking",
      text: "check booking flight",
    });
  }
  if (chair.status === "pending" && status === "placed") {
    chair.status = status;
  }
  await chair.save();

  if (status === "placed") {
    await calculateUSerBookingCount(chair);
  }

  sendResponse(res, 200, true, { chair }, null, "update chair success");
});
//get single
chairController.getsingleChair = catchAsync(async (req, res, next) => {
  const { chairId } = req.query;
  const chair = await Chair.findById(chairId).populate("flight");
  if (!chair)
    throw new AppError(400, "chair not foun", "get single chair error");
  const flight = await Flight.findById(chair.flight)
    .populate("airlines")
    .populate("plane");
  if (!flight)
    throw new AppError(400, "flight not foun", "get single chair error");

  sendResponse(
    res,
    200,
    true,
    { chair, flight },
    null,
    "get single chair success"
  );
});
//get list booking
chairController.getListBooking = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let chairs = await Chair.find({ user: currentUserId }).populate("flight");
  if (!chairs) sendResponse(res, 200, true, {}, null, "không tìm thấy đặt chổ");
  let flights = [];
  for (let i = 0; i < chairs.length; i++) {
    const flight = await Flight.findById(chairs[i].flight._id)
      .populate("airlines")
      .populate("plane");
    flights.push(flight);
  }
  await sendResponse(
    res,
    200,
    true,
    { chairs, flights },
    null,
    "get list booking success"
  );
});
// cancel chair
chairController.cancelChair = catchAsync(async (req, res, next) => {
  const chairId = req.params.chairId;
  const { status } = req.body;
  let chair = await Chair.findByIdAndUpdate(
    chairId,
    { status: status, user: null },
    { new: true }
  );

  sendResponse(res, 200, true, { chair }, null, "cancel success");
});
// get list chair with flight
chairController.getListChair = catchAsync(async (req, res, next) => {
  const flightId = req.params.flightId;
  const chairs = await Chair.find({ flight: flightId })
    .sort({
      codeNumber: 1,
    })
    .populate("user");
  console.log(chairs);
  sendResponse(res, 200, true, { chairs }, null, "get list chairs success");
});
//delete chair
chairController.deletedChair = catchAsync(async (req, res, next) => {
  const chairId = req.params.chairId;
  const { status } = req.body;
  const chair = await Chair.findByIdAndUpdate(chairId, { status, user: null });
  sendResponse(res, 200, true, { chair }, null, "deleted chair success");
});
module.exports = chairController;
