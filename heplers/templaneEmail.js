const sgMail = require("@sendgrid/mail");
const SendEmail = require("../models/sendEmail");
const { sendBooking } = require("./emailTemplane");
const API_KEY_SEND_GRID =
  "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";
const templaneEmail = {};

templaneEmail.createSendEmail = async ({ name, subject, template_key }) => {
  try {
    let templane = await SendEmail.findOne({ template_key: template_key });
    if (!templane) {
      let email = await SendEmail.create({
        name: name,
        subject: subject,
        template_key: template_key,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

templaneEmail.renderEmail = async ({ data, to, template_key, text }) => {
  const { flight, chair } = data;
  const html = await sendBooking({ flight, chair });
  let email = await SendEmail.findOneAndUpdate(
    { template_key: template_key },
    { html: html, to: to, text: text },
    { new: true }
  );
  return email;
};

templaneEmail.sendTo = async ({ template_key }) => {
  try {
    sgMail.setApiKey(API_KEY_SEND_GRID);
    const email = await SendEmail.findOne({ template_key: template_key });
    const message = {
      to: email.to,
      from: email.from,
      subject: email.subject,
      text: email.text,
      html: email.html,
    };
    await sgMail
      .send(message)
      .then(() => console.log("email sent ..."))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

module.exports = templaneEmail;
