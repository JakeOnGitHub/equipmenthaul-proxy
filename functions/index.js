const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendWelcomeEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { name, email } = req.body;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Welcome to EquipmentHaul",
      text: `
Hi ${name},

Welcome to EquipmentHaul!

We’ve received your access request. A member of our team will review it and contact you shortly. If approved, you’ll receive a second email to complete your login setup.

Thanks for your interest in working with us.

– The EquipmentHaul Team
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(500).send("Email failed");
      } else {
        return res.status(200).send("Email sent");
      }
    });
  });
});
