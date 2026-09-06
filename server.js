const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

const DEFAULT_NEON_CONN = process.env.NEON_DATABASE_URL || "postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const server = http.createServer(async (req, res) => {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Neon-Connection-String, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let reqUrl = decodeURIComponent(req.url.split('?')[0]);

  // Neon PostgreSQL HTTP Proxy Endpoint (CORS-free for browser clients)
  if (reqUrl === '/api/sql' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const connStr = req.headers['neon-connection-string'] || payload.connString || DEFAULT_NEON_CONN;
        
        // Parse host from connStr
        const match = connStr.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
        if (!match) throw new Error("Invalid Neon connection string format");

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
        res.writeHead(neonResp.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(neonData));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (reqUrl === '/') reqUrl = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqUrl);

  // Prevent directory traversal security issue
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  TJCCB Central Portal & Merger is running locally!`);
  console.log(`  Central Login:  http://localhost:${PORT}/index.html`);
  console.log(`  Merger Launcher: http://localhost:${PORT}/merger.html`);
  console.log(`  Gold Loan Site: http://localhost:${PORT}/gold-jccb-final-main/index.html`);
  console.log(`  FD Portal Site: http://localhost:${PORT}/fd-module/index.html`);
  console.log(`  OD Portal Site: http://localhost:${PORT}/od-module/index.html`);
  console.log(`  Neon Postgres:  Active (Singapore / ap-southeast-1)`);
  console.log(`=======================================================`);
});
