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

const chairController = {};
const calculateUSerBookingCount = async (chair) => {
  const countUsers = await Chair.countDocuments({ status: chair.status });
  await Flight.findByIdAndUpdate(chair.flight, {
    userBookingCount: countUsers,
  });
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

  const date = new Date(flight.fromDay).getDate();
  const month = new Date(flight.fromDay).getMonth() + 1;
  const year = new Date(flight.fromDay).getFullYear();
  const user = await mongoose
    .model("User")
    .findOne({ _id: userId, status: "no" });
  if (!user) throw new AppError(400, "user not found", "update chair error");

  if (chair.status === "none" && status === "pending") {
    chair.status = status;
    chair.user = user._id;
    await renderEmail({
      html: `<h1>Hello, i come from ${flight.airlines.name}</h1> <br/> <p>you booking flight date: ${date}-${month}-${year}</p>`,
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
    await sendTo({ template_key: "booking" });
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
  const chairs = await mongoose.model("Chair").findOne({ user: currentUserId });
  if (!chairs) sendResponse(res, 200, true, {}, null, "không tìm thấy đặt chổ");
  const flights = await Flight.findById(chairs.flight)
    .populate("airlines")
    .populate("plane");
  sendResponse(
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
module.exports = chairController;
