const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const { listFiles, readText, writeText, safeJoinAssert } = require('../utils/fsx');
const { ensureSafeBasename } = require('../utils/sanitize');
const { SOURCE_DIR, OUTPUT_DIR } = require('../config');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  trimValues: true,
  parseTagValue: true,
  parseAttributeValue: true
});

async function listMetaFiles() {
  return listFiles(SOURCE_DIR, { ext: '.meta' });
}

async function convertOne(basenameWithoutExt) {
  ensureSafeBasename(basenameWithoutExt);
  const metaName = `${basenameWithoutExt}.meta`;
  const safeMetaPath = await safeJoinAssert(SOURCE_DIR, metaName);

  const xml = await readText(safeMetaPath);

  let jsonObj;
  try {
    jsonObj = parser.parse(xml);
  } catch (e) {
    const err = new Error(`XML parse error in "${metaName}": ${e.message}`);
    err.status = 400;
    throw err;
  }

  const outName = `${basenameWithoutExt}.json`;
  const outPath = path.join(OUTPUT_DIR, outName);

  const jsonText = JSON.stringify(jsonObj, null, 2);
  await writeText(outPath, jsonText);

  return { input: metaName, output: outName, bytesOut: Buffer.byteLength(jsonText, 'utf8') };
}

async function convertAll() {
  const files = await listMetaFiles();
  const names = files.map(f => f.replace(/\.meta$/i, ''));
  const results = await Promise.allSettled(names.map(n => convertOne(n)));
  const summary = {
    total: results.length,
    ok: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
    outputs: [],
    errors: []
  };
  results.forEach(r => {
    if (r.status === 'fulfilled') summary.outputs.push(r.value);
    else summary.errors.push(String(r.reason?.message || r.reason));
  });
  return summary;
}

module.exports = {
  listMetaFiles,
  convertOne,
  convertAll
};
