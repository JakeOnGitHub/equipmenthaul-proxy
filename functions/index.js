const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.user,
    pass: functions.config().gmail.pass,
  },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const displayName = user.displayName || "New User";

  const mailOptions = {
    from: `"Blackhawk Services" <${functions.config().gmail.user}>`,
    to: email,
    subject: "Welcome to Equipment Haul",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Welcome, ${displayName}!</h2>
        <p>We're excited to have you using the Equipment Haul Request Platform.</p>
        <p>You're all set to submit haul requests anytime.</p>
        <p>If you have questions or need help, don’t hesitate to reach out.</p>
        <p style="margin-top: 20px;">— The Blackhawk Services Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions)
    .then(() => console.log("Welcome email sent to", email))
    .catch((error) => console.error("Email error:", error));
});
