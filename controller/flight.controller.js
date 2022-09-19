const { isValidObjectId } = require("mongoose");
const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const Airlines = require("../models/airlines");
const Chair = require("../models/chair");
const Flight = require("../models/flight");
const Plane = require("../models/plane");

const flightController = {};
//create flight
flightController.createFlight = catchAsync(async (req, res, next) => {
  let {
    nameAirlines,
    namePlane,
    codePlane,
    from,
    to,
    fromDay,
    timeFrom,
    timeTo,
    price,
  } = req.body;

  from = from.toLowerCase();
  to = to.toLowerCase();

  const airlines = await Airlines.findOne({ name: nameAirlines });
  if (!airlines)
    throw new AppError(400, "airline not found", "create flight error");

  const plane = await Plane.findOne({ name: namePlane, codePlane });
  if (!plane) throw new AppError(400, "plane not found", "create flight error");

  const date = new Date(fromDay).getDate();
  const month = new Date(fromDay).getMonth();
  const year = new Date(fromDay).getFullYear();

  let flight = await Flight.findOne({
    airlines: airlines._id,
    plane: plane._id,
    fromDay,
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
    fromDay,
    timeFrom,
    timeTo,
    price,
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
  sendResponse(res, 200, true, { flight }, null, "create flight success");
});
//get flight
flightController.getFlight = catchAsync(async (req, res, next) => {
  let { page, limit, ...filterQuery } = req.query;
  let { fromDay, timeFrom, timeTo } = req.body;
  const allowedFilterQuery = ["from", "to", "nameAirlines"];

  page = parseInt(page) || 1;
  limit = parseInt(page) || 10;
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

  const hoursFrom = new Date(timeFrom).getHours();
  const minuteFrom = new Date(timeFrom).getMinutes();

  const hoursTo = new Date(timeTo).getHours();
  const minuteTo = new Date(timeTo).getMinutes();

  const from = filterQuery.from.toLowerCase();
  const to = filterQuery.to.toLowerCase();

  let flights = [];

  let filtercounditions = [
    { from: from },
    { to: to },
    { fromDay: { $eq: new Date(year, month, date) } },
  ];

  if (timeFrom) {
    filtercounditions.push({
      timeFrom: { $gte: new Date(year, month, date, hoursFrom, minuteFrom) },
    });
    if (timeTo) {
      filtercounditions.push({
        timeTo: { $gte: new Date(year, month, date, hoursTo, minuteTo) },
      });
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
    filtercounditions.push({
      timeTo: { $gte: new Date(year, month, date, hoursTo, minuteTo) },
    });
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

  flights = await Flight.find(filterCriterial);
  sendResponse(res, 200, true, { flights }, null, "get list flights success");
});
module.exports = flightController;
