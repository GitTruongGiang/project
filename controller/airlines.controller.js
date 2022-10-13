const { catchAsync, sendResponse, AppError } = require("../heplers/utils");
const Airlines = require("../models/airlines");
const User = require("../models/user");

const airlinesController = {};

//create airlines
airlinesController.createAirlines = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { name, imageUrl } = req.body;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "user not found", "create airline error");

  let airline = await Airlines.findOne({ name });
  if (airline)
    throw new AppError(400, "airlines already", "create airline error");

  airline = await Airlines.create({
    name,
    imageUrl,
    userCreate: currentUserId,
  });
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
//--------
// user acount
airlinesController.getListCreateAirlines = catchAsync(
  async (req, res, next) => {
    const curenUserId = req.userId;
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(page) || 10;

    const user = await User.findById(curenUserId);
    if (user.status !== "accepted")
      throw new AppError(400, "user not found", "get list create flight error");
    const offset = limit * (page - 1);
    const count = await Airlines.countDocuments({ userCreate: curenUserId });
    const totalPage = Math.ceil(count / limit);
    const airlines = await Airlines.find({ userCreate: curenUserId })
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);
    if (!airlines)
      throw new AppError(400, "airlines not found", "get list flight error");
    sendResponse(
      res,
      200,
      true,
      { airlines, count, totalPage },
      null,
      "get list airlines success"
    );
  }
);
module.exports = airlinesController;
