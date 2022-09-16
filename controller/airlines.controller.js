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

module.exports = airlinesController;
