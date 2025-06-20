export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbx0risrNQ5MaEZpAFI0rfB6e9Xlp9p8wDDdQl-blMhovB-uxvCN96tTXD_eMXlE32pR9g/exec';
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
