// Basic filename sanitizer to prevent path traversal & weird chars.
const SAFE_NAME_RE = /^[A-Za-z0-9._-]+$/;

function ensureSafeBasename(name) {
  if (!SAFE_NAME_RE.test(name)) {
    const err = new Error('Invalid file name.');
    err.status = 400;
    throw err;
  }
  return name;
}

module.exports = { ensureSafeBasename };
