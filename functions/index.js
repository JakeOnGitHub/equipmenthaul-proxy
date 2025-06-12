const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const mailOptions = {
    from: 'Blackhawk Services <noreply@equipmenthaul.com>',
    to: user.email,
    subject: 'Welcome to Equipment Haul',
    text: `Welcome to Equipment Haul, ${user.displayName || 'partner'}!\n\nYou now have access to request hauls directly from our platform.\n\nIf you ever forget your password, click “Forgot Password” on the login screen.\n\nIf you didn’t expect this email or need help, contact us at support@equipmenthaul.com.\n\n– The Blackhawk Team`
  };

  return transporter.sendMail(mailOptions);
});
