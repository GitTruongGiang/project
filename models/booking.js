const mongoose = require("mongoose");
const { Schema } = mongoose;
const bookingSchema = Schema({}, { timestamps: true });
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
