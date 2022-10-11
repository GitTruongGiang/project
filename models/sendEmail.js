const mongoose = require("mongoose");
const { Schema } = mongoose;

const sendEmailSchema = Schema({
  to: { type: String, required: false, default: "" },
  from: {
    type: String,
    required: true,
    default: "nguyentruonggiangvv@gmail.com",
  },
  text: { type: String, required: false, default: "" },
  html: { type: String, required: false, default: "" },
  template_key: { type: String, required: true },
  name: { type: String, required: true },
  subject: { type: String },
});

const SendEmail = mongoose.model("SendEmail", sendEmailSchema);

module.exports = SendEmail;
