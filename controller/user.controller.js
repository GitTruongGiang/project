const { catchAsync, AppError, sendResponse } = require("../heplers/utils");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { findById } = require("../models/user");

const userController = {};
// get user me
userController.getUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);

  if (!user) throw new AppError(400, "user not found", "get user error");

  sendResponse(res, 200, true, user, null, "get user success");
});
//create user
userController.createUser = catchAsync(async (req, res, next) => {
  let { name, email, password, phone, city, status } = req.body;
  console.log(status);
  let user = await User.findOne({ email });
  if (user) throw new AppError(400, "user already exists", "create user error");
  if (password.length < 8)
    throw new AppError(400, "password is length < 8", "create user error");
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ name, email, password, phone, city, status });
  const accessToken = await user.generateToken();

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "create user success"
  );
});
//updated user
userController.updateUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;

  if (currentUserId !== userId)
    throw new AppError(400, "not match user", "update user error");

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "user not found", "update user error");

  const allows = [
    "name",
    "avatarUrl",
    "coverUrl",
    "phone",
    "city",
    "country",
    "facebookLink",
    "instagramLink",
    "linkedinLink",
    "twitterLink",
  ];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();
  sendResponse(res, 200, true, { user }, null, "Update User Success");
});
//deleted user
userController.deletedUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;

  if (currentUserId !== userId)
    throw new AppError(400, "not match user", "update user error");
  const user = await User.findByIdAndUpdate(userId, { isdeleted: false });

  sendResponse(res, 200, true, { user }, null, "success");
});

module.exports = userController;
