const mongoose = require("mongoose");
const { Schema } = mongoose;

const chairSchema = Schema(
  {
    flight: { type: Schema.Types.ObjectId, require: true, ref: "Flight" },
    user: { type: Schema.Types.ObjectId, require: false, ref: "User" },
    codeNumber: { type: Number, required: true },
    codeString: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["none", "pending", "placed"],
      default: "none",
    },
  },
  { timestamps: true }
);

const Chair = mongoose.model("Chair", chairSchema);
module.exports = Chair;
