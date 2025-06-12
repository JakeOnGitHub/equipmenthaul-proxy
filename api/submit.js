export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://equipmenthaul.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbx0risrNQ5MaEZpAFI0rfB6e9Xlp9p8wDDdQl-blMhovB-uxvCN96tTXD_eMXlE32pR9g/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const result = await response.text();
    return res.status(200).json({ status: "ok", googleResponse: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
