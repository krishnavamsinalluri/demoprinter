import fs from 'fs';
import path from 'path';

const localAppData = process.env.LOCALAPPDATA || (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local') : null);
if (!localAppData) {
  process.exit(0);
}

const base = path.join(localAppData, 'electron-builder', 'Cache');
if (!fs.existsSync(base)) {
  process.exit(0);
}

function getDirStats(dir) {
  let fileCount = 0;
  let extractedSize = 0;
  function walk(d) {
    let list = [];
    try {
      list = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const item of list) {
      const full = path.join(d, item.name);
      if (item.isDirectory()) {
        walk(full);
      } else if (item.isFile()) {
        fileCount++;
        try {
          extractedSize += fs.statSync(full).size;
        } catch {
          // ignore stat errors
        }
      }
    }
  }
  walk(dir);
  return { fileCount, extractedSize };
}

function fixCache(subDir, folderName) {
  try {
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
  } catch (err) {
    console.warn(`fixCache notice for ${subDir}:`, err.message);
  }
}

fixCache('nsis-resources-3.4.1', 'nsis-resources-3.4.1-2jx2y');
fixCache('nsis-3.0.4.1', 'nsis-3.0.4.1-1mx3n');
