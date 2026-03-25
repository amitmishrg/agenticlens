/** Standard 8-4-4-4-12 hex id (UUID-style filenames). */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function stripJsonl(name) {
  return name?.replace(/\.jsonl$/i, '') ?? '';
}

/**
 * @param {string} [rawName]
 * @returns {{ title: string; subtitle: string | null; fullLabel: string }}
 */
export function formatSessionDisplay(rawName) {
  const name = rawName?.trim() || '';
  const base = stripJsonl(name);
  const fullLabel = name || 'Session';

  if (base && UUID_RE.test(base)) {
    return {
      title: `Session ${base.slice(0, 8)}`,
      subtitle: base,
      fullLabel: name || base,
    };
  }

  return {
    title: name || 'Untitled',
    subtitle: null,
    fullLabel: name || 'Untitled',
  };
}
