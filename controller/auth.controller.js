const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, isdeleted: true }, "+password");
  if (!user) throw new AppError(400, "invalid creadentials", "login error");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "wrong password", "login error");

  const accessToken = await user.generateToken();
  sendResponse(res, 200, true, { user, accessToken }, null, "login success");
});

module.exports = authController;
