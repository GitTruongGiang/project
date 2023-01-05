const mongoose = require("mongoose");
const { Schema } = mongoose;
const bookingSchema = Schema(
  {
    airlines: { type: Schema.Types.ObjectId, required: true, ref: "Airlines" },
    plane: { type: Schema.Types.ObjectId, required: true, ref: "Plane" },
    chair: {type: Schema.Types.ObjectId, required: true, ref: "Chair"},
    user: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    from: { type: String, required: true },
    to: { type: String, required: true },
    fromDay: { type: Date, required: true },
    timeFrom: { type: Date, required: true},
    timeTo: { type: Date, required: true},
    price: { type: Number, required: true },
    codeNumber: { type: Number, required: true },
    codeString: { type: String, required: true },
    dateBooking: { type: Date, required: false },
}, 
{ timestamps: true }
);
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
