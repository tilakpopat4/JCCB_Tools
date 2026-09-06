const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

const items = [
  'index.html',
  'merger.html',
  'central-backup.js',
  'postgres-sync.js',
  'schema.sql',
  'jccb-logo.png',
  'gold-jccb-final-main',
  'fd-module',
  'od-module'
];

items.forEach(item => {
  const src = path.join(__dirname, item);
  const dest = path.join(dist, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied ${item} -> dist/${item}`);
  }
});

console.log('✅ Dist built successfully with all portals and assets!');
