const mongoose = require("mongoose");
const { Schema } = mongoose;

const planeSchema = Schema(
  {
    name: { type: String, required: true },
    codePlane: { type: String, required: true, unique: true },
    authorAirlines: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Airlines",
    },
    userCreate: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    chairCount: { type: Number, required: true, default: 24 },
    rowChairCount: { type: Number, required: true, default: 4 },
  },
  { timestamps: true }
);

planeSchema.methods.toJSON = function () {
  const plane = this._doc;
  delete plane.userCreate;
  return plane;
};
planeSchema.methods.generateCodePlane = async function (length) {
  const CODE_STRING = process.env.CODE_STRING;
  let result = "";
  const charactersLength = CODE_STRING.length;
  for (let i = 0; i < length; i++) {
    result += CODE_STRING.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const Plane = mongoose.model("Plane", planeSchema);
module.exports = Plane;
