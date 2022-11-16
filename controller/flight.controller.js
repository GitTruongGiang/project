const { isValidObjectId } = require("mongoose");
const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const Airlines = require("../models/airlines");
const Chair = require("../models/chair");
const Flight = require("../models/flight");
const Plane = require("../models/plane");
const User = require("../models/user");

const flightController = {};
//create flight
flightController.createFlight = catchAsync(async (req, res, next) => {
  const curenUserId = req.userId;
  let { planeId, from, to, fromDay, timeFrom, timeTo, price } = req.body;

  from = from.toLowerCase();
  to = to.toLowerCase();

  const user = await User.findById(curenUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "create flight error");
  // const airlines = await Airlines.findOne({ name: nameAirlines });
  // if (!airlines)
  //   throw new AppError(400, "airline not found", "create flight error");

  const plane = await Plane.findById(planeId).populate("authorAirlines");
  if (!plane) throw new AppError(400, "plane not found", "create flight error");
  const codePlane = await plane.codePlane;
  let flight = await Flight.findOne({
    airlines: plane.authorAirlines._id,
    plane: plane._id,
    fromDay,
    timeFrom,
    timeTo,
    codePlane,
  });
  if (flight) throw new AppError(400, "flight already", "create filght error");
  console.log(flight);
  const date = new Date(fromDay).getDate();
  const month = new Date(fromDay).getMonth();
  const year = new Date(fromDay).getFullYear();
  const DMY = new Date(year, month, date);

  flight = await Flight.create({
    airlines: plane.authorAirlines._id,
    plane: plane._id,
    codePlane: plane.codePlane,
    from,
    to,
    fromDay: DMY,
    timeFrom,
    timeTo,
    price,
    userCreate: curenUserId,
  });

  flight = await Flight.findById(flight._id).populate("plane");
  if (!flight)
    throw new AppError(400, "flight not found", "create chair error");

  let String = ["a", "b", "c", "d", "e", "f"];
  let resultNumber = 0;
  const chairCount = flight.plane.chairCount;
  const rowChairCount = flight.plane.rowChairCount;
  for (let i = 1; i < chairCount / rowChairCount + 1; i++) {
    for (let j = 1; j < rowChairCount + 1; j++) {
      resultNumber = i - 1;
      let chair = await Chair.create({
        flight: flight._id,
        codeNumber: j,
        codeString: String[resultNumber],
      });
    }
  }
  const flights = await Flight.find({ userCreate: curenUserId });
  sendResponse(res, 200, true, { flights }, null, "create flight success");
});
// update flight
flightController.updateFlight = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const flightId = req.params.flightId;
  const user = await User.findById(currentUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "create flight error");

  const flight = await Flight.findById(flightId);

  const allows = ["from", "to", "fromDay", "timeTo", "timeFrom", "price"];
  console.log(req.body);
  allows.forEach((field) => {
    if (req.body[field]) {
      flight[field] = req.body[field];
    }
  });
  await flight.save();
  const flights = await Flight.find({ userCreate: currentUserId })
    .populate("airlines")
    .populate("plane");
  sendResponse(res, 200, true, { flights }, null, "update flight success");
});
//get flight
flightController.getFlight = catchAsync(async (req, res, next) => {
  let { page, limit, ...filterQuery } = req.query;
  const { timeFrom, timeTo, fromDay } = req.body;

  const allowedFilterQuery = ["from", "to", "nameAirlines"];
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterKeys = Object.keys(filterQuery);
  filterKeys.forEach((key) => {
    if (!allowedFilterQuery.includes(key)) {
      const exception = new Error(`Query ${key} is not allowed`);
      exception.statusCode = 401;
      throw exception;
    }
    if (!filterQuery[key]) delete filterQuery[key];
  });

  const date = new Date(fromDay).getDate();
  const month = new Date(fromDay).getMonth();
  const year = new Date(fromDay).getFullYear();
  const DMY = new Date(`${year}, ${month + 1}, ${date}`);

  const hoursFrom = new Date(timeFrom).getHours();
  const minuteFrom = new Date(timeFrom).getMinutes();
  const secondsFrom = new Date(timeFrom).getSeconds();

  const hoursTo = new Date(timeTo).getHours();
  const minuteTo = new Date(timeTo).getMinutes();
  const secondsTo = new Date(timeTo).getSeconds();

  const from = filterQuery.from.toLowerCase();
  const to = filterQuery.to.toLowerCase();

  let filtercounditions = [
    { from: from },
    { to: to },
    {
      fromDay: {
        $eq: DMY,
      },
    },
  ];

  if (timeFrom) {
    if (hoursFrom > 6 && hoursFrom !== 23) {
      filtercounditions.push({
        timeFrom: {
          $gte: new Date(year, month, date, hoursFrom - 6),
          $lte: new Date(year, month, date, hoursFrom, minuteFrom, secondsFrom),
        },
      });
    } else if (hoursFrom === 23) {
      filtercounditions.push({
        timeFrom: {
          $gte: new Date(year, month, date, 18),
          $lte: new Date(year, month, date, hoursFrom, minuteFrom, secondsFrom),
        },
      });
    } else {
      filtercounditions.push({
        timeFrom: {
          $gte: new Date(`${year}, ${month + 1}, ${date}`),
          $lt: new Date(year, month, date, hoursFrom, minuteFrom, secondsFrom),
        },
      });
    }
    if (timeTo) {
      if (hoursTo > 6 && hoursTo !== 23) {
        filtercounditions.push({
          timeTo: {
            $gte: new Date(year, month, date, hoursTo - 6),
            $lte: new Date(year, month, date, hoursTo, minuteTo, secondsTo),
          },
        });
      } else if (hoursTo === 23) {
        filtercounditions.push({
          timeTo: {
            $gte: new Date(year, month, date, 18),
            $lte: new Date(year, month, date, hoursTo, minuteTo, secondsTo),
          },
        });
      } else {
        filtercounditions.push({
          timeTo: {
            $gte: DMY,
            $lte: new Date(year, month, date, hoursTo, minuteTo, secondsTo),
          },
        });
      }
      if (filterQuery.nameAirlines) {
        const nameAirlines = await Airlines.findById({
          _id: filterQuery.nameAirlines,
        });
        if (!nameAirlines) {
          sendResponse(res, 200, true, {}, null, "name airlines not found");
        }
        filtercounditions.push({ airlines: nameAirlines._id });
      }
    }
    if (filterQuery.nameAirlines) {
      const nameAirlines = await Airlines.findById({
        _id: filterQuery.nameAirlines,
      });
      if (!nameAirlines) {
        sendResponse(res, 200, true, {}, null, "name airlines not found");
      }
      filtercounditions.push({ airlines: nameAirlines._id });
    }
  } else if (timeTo) {
    if (hoursTo > 6 && hoursTo !== 23) {
      filtercounditions.push({
        timeTo: {
          $gte: new Date(year, month, date, hoursTo - 6),
          $lte: new Date(year, month, date, hoursTo, minuteTo, secondsTo),
        },
      });
    } else if (hoursTo === 23) {
      filtercounditions.push({
        timeTo: {
          $gte: new Date(year, month, date, 18),
          $lte: new Date(year, month, date, hoursTo, minuteTo, secondsTo),
        },
      });
    } else {
      filtercounditions.push({
        timeTo: {
          $gte: DMY,
          $lte: new Date(year, month, date, hoursTo, minuteTo, secondsTo),
        },
      });
    }
    if (filterQuery.nameAirlines) {
      const nameAirlines = await Airlines.findById({
        _id: filterQuery.nameAirlines,
      });
      if (!nameAirlines) {
        sendResponse(res, 200, true, {}, null, "name airlines not found");
      }
      filtercounditions.push({ airlines: nameAirlines._id });
    }
  } else if (filterQuery.nameAirlines) {
    const nameAirlines = await Airlines.findById({
      _id: filterQuery.nameAirlines,
    });
    if (!nameAirlines) {
      sendResponse(res, 200, true, {}, null, "name airlines not found");
    }
    filtercounditions.push({ airlines: nameAirlines._id });
  }

  const filterCriterial = filtercounditions.length
    ? { $and: filtercounditions }
    : {};

  const offset = limit * (page - 1);
  const count = await Flight.countDocuments(filterCriterial);
  const totalPage = Math.ceil(count / limit);

  let flights = await Flight.find(filterCriterial)
    .sort({ fromDay: 1 })
    .skip(offset)
    .limit(limit)
    .populate("airlines")
    .populate("plane");

  sendResponse(
    res,
    200,
    true,
    { flights, count, totalPage },
    null,
    "get list flight success"
  );
});
//get single flight
flightController.getFlightSingle = catchAsync(async (req, res, next) => {
  const { flightId } = req.query;
  const flight = await Flight.findById(flightId)
    .populate("airlines")
    .populate("plane");
  if (!flight)
    throw new AppError(400, "flight not found", "get single flight error");
  sendResponse(res, 200, true, { flight }, null, "get single success");
});
flightController.getListCreateFlight = catchAsync(async (req, res, next) => {
  const curenUserId = req.userId;
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(page) || 10;

  const user = await User.findById(curenUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "get list create flight error");
  const offset = limit * (page - 1);
  const count = await Flight.countDocuments({ userCreate: curenUserId });
  const totalPage = Math.ceil(count / limit);
  const flights = await Flight.find({ userCreate: curenUserId })
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("airlines")
    .populate("plane");
  if (!flights)
    throw new AppError(400, "flights not found", "get list flight error");
  sendResponse(
    res,
    200,
    true,
    { flights, count, totalPage },
    null,
    "get list flight success"
  );
});
flightController.deletedFlight = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const flightId = req.params.flightId;
  const user = await User.findById(currentUserId);
  if (user.status !== "accepted")
    throw new AppError(400, "user not found", "deleted flight error");
  const chairs = await Chair.deleteMany({ flight: flightId });
  const flight = await Flight.findByIdAndDelete(flightId);
  const flights = await Flight.find({ userCreate: currentUserId });
  sendResponse(res, 200, true, { flights }, null, "deleted flight success");
});
module.exports = flightController;
