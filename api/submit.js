export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    const body = req.body;

    // Replace with your actual Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx0risrNQ5MaEZpAFI0rfB6e9Xlp9p8wDDdQl-blMhovB-uxvCN96tTXD_eMXlE32pR9g/exec';

    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.status === 'ok') {
      return res.status(200).json({ status: 'ok' });
    } else {
      return res.status(500).json({ status: 'error', message: 'Google Apps Script responded with an error' });
    }
  } catch (err) {
    console.error('Error sending to Apps Script:', err);
    return res.status(500).json({ status: 'error', message: err.message || 'Unknown error' });
  }
}
