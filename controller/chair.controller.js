const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const Chair = require("../models/chair");
const Flight = require("../models/flight");

const chairController = {};
//create chair
chairController.createChair = catchAsync(async (req, res, next) => {});
module.exports = chairController;
