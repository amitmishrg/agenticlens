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

export async function readJsonlFiles(fileList) {
  const files = Array.from(fileList || []).filter(isJsonlFile);
  const contents = await Promise.all(
    files.map(async (file) => {
      const content = await readFileAsText(file);
      return {
        name: file.webkitRelativePath || file.name,
        content,
      };
    }),
  );

  return contents;
}
