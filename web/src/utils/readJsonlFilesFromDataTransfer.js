function isJsonlFile(file) {
  const name = file?.name || '';
  return name.toLowerCase().endsWith('.jsonl');
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsText(file);
  });
}

async function readEntryFiles(entry, prefix, out) {
  if (!entry) return;

  // @ts-ignore - webkit types
  if (entry.isFile) {
    // @ts-ignore - webkit types
    entry.file(async (file) => {
      if (!isJsonlFile(file)) return;
      const name = prefix ? `${prefix}/${file.name}` : file.name;
      const content = await readFileAsText(file);
      out.push({ name, content });
    });
    return;
  }

  // @ts-ignore - webkit types
  const reader = entry.createReader?.();
  if (!reader) return;

  const readBatch = () =>
    new Promise((resolve) => {
      reader.readEntries((entries) => resolve(entries || []));
    });

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const entries = await readBatch();
    if (!entries.length) break;
    // eslint-disable-next-line no-restricted-syntax
    for (const ent of entries) {
      // eslint-disable-next-line no-await-in-loop
      await readEntryFiles(ent, prefix ? `${prefix}/${ent.name}` : ent.name, out);
    }
  }
}

export async function readJsonlFilesFromDataTransfer(dataTransfer) {
  const items = Array.from(dataTransfer?.items || []);
  if (!items.length) return [];

  const first = items[0];
  // Folder recursion only works when the browser exposes webkitGetAsEntry.
  // eslint-disable-next-line no-prototype-builtins
  const getAsEntry = first?.webkitGetAsEntry;
  if (typeof getAsEntry !== 'function') return [];

  const out = [];
  const entries = items.map((it) => it.webkitGetAsEntry?.()).filter(Boolean);

  await Promise.all(entries.map((entry) => readEntryFiles(entry, '', out)));

  // Deduplicate by name.
  const seen = new Set();
  const deduped = [];
  for (const f of out) {
    if (seen.has(f.name)) continue;
    seen.add(f.name);
    deduped.push(f);
  }

  return deduped;
}
