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
    chairCount: { type: Number, required: true, default: 24 },
    rowChairCount: { type: Number, required: true, default: 4 },
  },
  { timestamps: true }
);

const Plane = mongoose.model("Plane", planeSchema);
module.exports = Plane;
