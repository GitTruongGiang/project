const mongoose = require("mongoose");
const { Schema } = mongoose;

const chairSchema = Schema(
  {
    flight: { type: Schema.Types.ObjectId, require: true, ref: "Flight" },
    codeNumber: { type: Number, required: true },
    codeString: { type: String, required: true },
    status: { enum: ["none", "pending", "placed"] },
  },
  { timestamps: true }
);
const Chair = mongoose.model("Chair", chairSchema);
module.exports = Chair;
