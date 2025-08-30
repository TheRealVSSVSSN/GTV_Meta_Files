const path = require('path');

const env = (key, fallback) => process.env[key] ?? fallback;

const PORT = Number(env('PORT', 3000));
const SOURCE_DIR = path.resolve(env('SOURCE_DIR', './data/meta'));
const OUTPUT_DIR = path.resolve(env('OUTPUT_DIR', './data/json'));
const AUTO_CONVERT_ON_START = String(env('AUTO_CONVERT_ON_START', 'false')).toLowerCase() === 'true';
const DAILY_CONVERT_ENABLED = String(env('DAILY_CONVERT_ENABLED', 'true')).toLowerCase() === 'true';
const DAILY_CONVERT_AT = env('DAILY_CONVERT_AT', '02:00');

module.exports = {
  PORT,
  SOURCE_DIR,
  OUTPUT_DIR,
  AUTO_CONVERT_ON_START,
  DAILY_CONVERT_ENABLED,
  DAILY_CONVERT_AT
};
