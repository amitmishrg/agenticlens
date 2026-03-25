const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

async function startServer(filePath) {
  const app = express();

  const webDistPath = path.join(__dirname, '..', 'web', 'dist');
  if (!fs.existsSync(webDistPath)) {
    console.error('Error: web/dist not found. Run `npm run build` in the web directory first.');
    process.exit(1);
  }

  app.use(express.static(webDistPath));

  app.get('/data', (req, res) => {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      res.type('text/plain').send(raw);
    } catch (err) {
      res.status(500).json({ error: `Failed to read file: ${err.message}` });
    }
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(webDistPath, 'index.html'));
  });

  app.listen(PORT, async () => {
    const url = `http://localhost:${PORT}`;
    console.log(`AgentScope running at ${url}`);
    console.log('Press Ctrl+C to stop.');

    try {
      const { default: open } = await import('open');
      await open(url);
    } catch (err) {
      console.log(`Could not open browser automatically. Open ${url} manually.`);
    }
  });
}

module.exports = { startServer };
