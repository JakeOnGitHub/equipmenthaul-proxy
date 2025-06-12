const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://equipmenthaul.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method Not Allowed" });
  }

  const data = req.body;

  try {
    // ✅ Send to Google Apps Script
    await fetch("https://script.google.com/macros/s/AKfycbx0risrNQ5MaEZpAFI0rfB6e9Xlp9p8wDDdQl-blMhovB-uxvCN96tTXD_eMXlE32pR9g/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    // ✅ Format equipment section for email
    const equipmentDetails = data.equipment.map(item => `
  - Name: ${item.name}
  - Weight: ${item.weight} lbs
  - Dimensions: ${item.dimensions}
`).join("\n");

    // ✅ Format full email message
    const message = `
Pickup Address: ${data.pickup_address}
Drop-off Address: ${data.dropoff_address}
Pickup Time: ${data.pickup_time === 'Scheduled' ? `${data.scheduled_date} at ${data.scheduled_time}` : 'ASAP'}

Equipment Details:
${equipmentDetails}

Delivery Contact: ${data.delivery_contact_name}
Delivery Contact Number: ${data.delivery_contact_phone}
`;

    // ✅ Send email via Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "service@blackhawkservices.us",
      bcc: "jake@blackhawkservices.us",
      subject: `Request for Quote – ${data.pickup_address.split(',').slice(-2).join(', ').trim()}`,
      text: message
    });

    return res.status(200).json({ status: "ok" });

  } catch (error) {
    console.error("Submission error:", error);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
