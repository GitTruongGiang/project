const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    city: { type: String, required: false, default: "" },
    avatarUrl: { type: String, required: false, default: "" },
    country: { type: String, required: false, default: "" },
    address: { type: String, required: false, default: "" },
    facebookLink: { type: String, required: false, default: "" },
    instagramLink: { type: String, required: false, default: "" },
    linkedinLink: { type: String, required: false, default: "" },
    twitterLink: { type: String, required: false, default: "" },
    status: {
      type: String,
      required: true,
      enum: ["no", "accepted"],
      default: "no",
    },
    isdeleted: { type: Boolean, default: true, select: false },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
