const sgMail = require("@sendgrid/mail");
const SendEmail = require("../models/sendEmail");
const { sendBooking } = require("./emailTemplane");

sgMail.setApiKey(process.env.API_KEY_SEND_GRID);

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
    const email = await SendEmail.findOne({ template_key: template_key });
    const message = {
      to: email.to,
      from: email.from,
      text: email.text,
      html: email.html,
      subject: email.subject,
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
