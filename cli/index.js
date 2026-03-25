#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { startServer } = require('./server');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: agentscope <path-to-logs.jsonl>');
  process.exit(1);
}

const filePath = path.resolve(args[0]);

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

if (!filePath.endsWith('.jsonl') && !filePath.endsWith('.json')) {
  console.warn(`Warning: File does not have a .jsonl extension. Proceeding anyway.`);
}

console.log(`AgentScope: Loading ${filePath}`);
startServer(filePath);
