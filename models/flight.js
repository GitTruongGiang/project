const mongoose = require("mongoose");
const { Schema } = mongoose;

const flightSchema = Schema(
  {
    airlines: { type: Schema.Types.ObjectId, required: true, ref: "Airlines" },
    plane: { type: Schema.Types.ObjectId, required: true, ref: "Plane" },
    codePlane: { type: String, required: true },
    imageUrl: {
      type: String,
      required: true,
      default: "",
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    fromDay: { type: Date, required: true, default: Date.now },
    timeFrom: { type: Date, required: true, default: Date.now },
    timeTo: { type: Date, required: true, default: Date.now },
    price: { type: Number, required: true },
    userBookingCount: { type: String, default: 0 },
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
