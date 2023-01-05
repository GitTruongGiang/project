const mongoose = require("mongoose");
const { Schema } = mongoose;

const airlinesSchema = Schema(
  {
    name: {
      type: String,
      requrired: true,
    },
    countPlane: { type: Number, requrired: true, default: 0 },
    // userCreate: { type: Schema.Types.ObjectId, requrired: true, ref: "User" },
    imageUrl: { type: String, requrired: true, default: "" },
  },
  { timestamps: true }
);
airlinesSchema.methods.toJSON = function () {
  const airline = this._doc;
  delete airline.userCreate;
  return airline;
};
const Airlines = mongoose.model("Airlines", airlinesSchema);
module.exports = Airlines;
