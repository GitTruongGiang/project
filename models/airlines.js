const mongoose = require("mongoose");
const { Schema } = mongoose;

const airlinesSchema = Schema(
  {
    name: {
      type: String,
      requrired: true,
      enum: [
        "Vietnam Airlines",
        "Vietjet Air",
        "Jetstar Pacific Airlines",
        "Bamboo Airways",
      ],
      unique: true,
    },
    countPlane: { type: Number, requrired: true, default: 0 },
  },
  { timestamps: true }
);
const Airlines = mongoose.model("Airlines", airlinesSchema);
module.exports = Airlines;
