#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { startServer } = require('./server');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: agenticlens <path-to-logs.jsonl|folder>');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Path not found: ${inputPath}`);
  process.exit(1);
}

let stat;
try {
  stat = fs.statSync(inputPath);
} catch {
  stat = null;
}

if (stat && stat.isFile()) {
  if (!inputPath.endsWith('.jsonl') && !inputPath.endsWith('.json')) {
    console.warn('Warning: File does not have a .jsonl extension. Proceeding anyway.');
  }
}

console.log(`Agenticlens: Loading ${inputPath}`);
startServer(inputPath);
