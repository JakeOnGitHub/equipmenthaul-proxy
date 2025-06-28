import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://equipmenthaul.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx0risrNQ5MaEZpAFI0rfB6e9Xlp9p8wDDdQl-blMhovB-uxvCN96tTXD_eMXlE32pR9g/exec';

    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (data.status === 'ok') {
      return res.status(200).json({ status: 'ok' });
    } else {
      return res.status(500).json({ status: 'error', message: 'Google Apps Script error', detail: data });
    }
  } catch (err) {
    console.error('Proxy failed:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}