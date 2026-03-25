const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

function isJsonlPath(p) {
  const s = p?.toLowerCase?.() || '';
  return s.endsWith('.jsonl') || s.endsWith('.json');
}

function collectJsonlFilesRecursively(rootDir) {
  const out = [];

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && isJsonlPath(full)) {
        out.push(full);
      }
    }
  };

  walk(rootDir);
  return out.sort();
}

async function startServer(inputPath) {
  const app = express();

  const webDistPath = path.join(__dirname, '..', 'web', 'dist');
  if (!fs.existsSync(webDistPath)) {
    console.error('Error: web/dist not found. Run `npm run build` in the web directory first.');
    process.exit(1);
  }

  const stat = fs.existsSync(inputPath) ? fs.statSync(inputPath) : null;
  const jsonlFiles =
    stat && stat.isDirectory() ? collectJsonlFilesRecursively(inputPath) : [inputPath];

  const workspaceFiles = jsonlFiles.filter(isJsonlPath);

  if (!workspaceFiles.length) {
    console.error('Error: No .jsonl files found for the provided path.');
    process.exit(1);
  }

  app.use(express.static(webDistPath));

  app.get('/workspace', (req, res) => {
    const baseDir = stat && stat.isDirectory() ? inputPath : path.dirname(inputPath);
    const files = workspaceFiles.map((p) => ({
      name: stat && stat.isDirectory() ? path.relative(baseDir, p) : path.basename(p),
    }));

    res.json({ files });
  });

  // Backward compatible: `/data` returns the first file.
  // For workspace mode: `/data?index=n` returns file `n`.
  app.get('/data', (req, res) => {
    try {
      const index = req.query?.index ? Number(req.query.index) : 0;
      const file = workspaceFiles[index] || workspaceFiles[0];
      const raw = fs.readFileSync(file, 'utf-8');
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
    console.log(`Agenticlens running at ${url}`);
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
