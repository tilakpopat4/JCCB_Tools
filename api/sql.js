export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Neon-Connection-String, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body || {};
    const connStr = req.headers['neon-connection-string'] || payload.connString || process.env.NEON_DATABASE_URL;

    if (!connStr) {
      return res.status(400).json({ error: 'Missing Neon connection string' });
    }

    const match = connStr.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid connection string format' });
    }

    const [, user, password, host] = match;
    const targetUrl = `https://${host}/sql`;

    const neonResp = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': connStr
      },
      body: JSON.stringify({ query: payload.query, params: payload.params || [] })
    });

    const neonData = await neonResp.json();
    return res.status(neonResp.status).json(neonData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
