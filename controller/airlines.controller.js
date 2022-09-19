const { catchAsync, sendResponse, AppError } = require("../heplers/utils");
const Airlines = require("../models/airlines");
const User = require("../models/user");

const airlinesController = {};

//create airlines
airlinesController.createAirlines = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { name } = req.body;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "user not found", "create airline error");

  let airline = await Airlines.findOne({ name });
  if (airline)
    throw new AppError(400, "airlines already", "create airline error");

  airline = await Airlines.create({ name });
  sendResponse(res, 200, true, { airline }, null, "create airlines success");
});
//get airlines
airlinesController.getAirlines = catchAsync(async (req, res, next) => {
  let { page, limit, ...filterQuery } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filtercounditions = [{}];
  if (filterQuery.name) {
    filtercounditions.push({
      name: { $regex: filterQuery.name, $options: "i" },
    });
  }

  const filterCriterial = filtercounditions.length
    ? { $and: filtercounditions }
    : {};

  const offset = (page - 1) * limit;
  const count = await Airlines.countDocuments(filterCriterial);
  const totalPage = Math.ceil(count / limit);
  const airlines = await Airlines.find(filterCriterial)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  sendResponse(
    res,
    200,
    true,
    { airlines, count, totalPage },
    null,
    "get airlines success"
  );
});
module.exports = airlinesController;
