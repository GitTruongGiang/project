const mongoose = require("mongoose");
const { Schema } = mongoose;

const flightSchema = Schema(
  {
    airlines: { type: Schema.Types.ObjectId, required: true, ref: "Airlines" },
    plane: { type: Schema.Types.ObjectId, requiredd: true, ref: "Plane" },
    codePlane: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    fromDay: { type: Date, required: true, default: Date.now },
    timeFrom: { type: Date, required: true, default: Date.now },
    timeTo: { type: Date, required: true, default: Date.now },
    price: { type: Number, required: true },
    userBookingCount: { type: String, default: 0 },
    // userCreate: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: {
      type: String,
      required: true,
      enum: ["full", "available"],
      default: "available",
    },
  },
  { timestamps: true }
);
const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;
