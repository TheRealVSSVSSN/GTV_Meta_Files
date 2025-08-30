const fs = require('fs/promises');
const fssync = require('fs');
const path = require('path');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listFiles(dir, { ext = null } = {}) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile()).map(e => e.name);
  if (!ext) return files;
  const e = ext.startsWith('.') ? ext : `.${ext}`;
  return files.filter(name => name.toLowerCase().endsWith(e.toLowerCase()));
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

async function writeText(filePath, data) {
  await ensureDir(path.dirname(filePath));
  return fs.writeFile(filePath, data, 'utf8');
}

function isSubpath(parent, target) {
  const rel = path.relative(parent, target);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function safeJoinAssert(parent, filename) {
  const absParent = fssync.realpathSync.native ? fssync.realpathSync.native(parent) : fssync.realpathSync(parent);
  const candidate = path.join(absParent, filename);
  const absCandidate = path.resolve(candidate);
  if (!isSubpath(absParent, absCandidate) && absParent !== absCandidate) {
    const err = new Error('Path outside of allowed directory.');
    err.status = 400;
    throw err;
  }
  return absCandidate;
}

module.exports = {
  ensureDir,
  listFiles,
  readText,
  writeText,
  safeJoinAssert
};
