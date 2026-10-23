import fs from 'fs';
import path from 'path';

const base = path.join(process.env.LOCALAPPDATA, 'electron-builder', 'Cache');

function getDirStats(dir) {
  let fileCount = 0;
  let extractedSize = 0;
  function walk(d) {
    const list = fs.readdirSync(d, { withFileTypes: true });
    for (const item of list) {
      const full = path.join(d, item.name);
      if (item.isDirectory()) {
        walk(full);
      } else if (item.isFile()) {
        fileCount++;
        extractedSize += fs.statSync(full).size;
      }
    }
  }
  walk(dir);
  return { fileCount, extractedSize };
}

function fixCache(subDir, folderName) {
  const dir = path.join(base, subDir);
  const tmp = path.join(dir, folderName + '.tmp');
  const target = path.join(dir, folderName);
  const state = path.join(dir, folderName + '.state');

  if (fs.existsSync(tmp)) {
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
    }
    fs.renameSync(tmp, target);
  }

  if (fs.existsSync(target)) {
    const { fileCount, extractedSize } = getDirStats(target);
    const data = {
      version: 1,
      state: "complete",
      timestamp: Date.now(),
      fileCount,
      extractedSize
    };
    fs.writeFileSync(state, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Fixed ${subDir}: ${fileCount} files, ${extractedSize} bytes.`);
  }
}

fixCache('nsis-resources-3.4.1', 'nsis-resources-3.4.1-2jx2y');
fixCache('nsis-3.0.4.1', 'nsis-3.0.4.1-1mx3n');
