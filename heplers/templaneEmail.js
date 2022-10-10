const sgMail = require("@sendgrid/mail");
const SendEmail = require("../models/sendEmail");
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

templaneEmail.renderEmail = async ({ html, to, template_key, text }) => {
  let email = await SendEmail.findOneAndUpdate(
    { template_key: template_key },
    { html: html, to: to, text: text },
    { new: true }
  );
};

templaneEmail.sendTo = async ({ template_key }) => {
  try {
    sgMail.setApiKey(process.env.API_KEY_SEND_GRID);
    let email = await SendEmail.findOne({ template_key: template_key });
    let message = {
      to: email.to,
      from: email.from,
      text: email.text,
      html: email.html,
      subject: email.subject,
    };
    await sgMail.send(message).then(() => console.log("Email sent ... "));
  } catch (error) {
    console.log(error);
  }
};

module.exports = templaneEmail;
