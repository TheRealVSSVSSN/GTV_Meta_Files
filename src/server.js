require('dotenv').config();
const { buildApp, logger } = require('./app');
const { PORT, SOURCE_DIR, OUTPUT_DIR, DAILY_CONVERT_ENABLED, DAILY_CONVERT_AT } = require('./config');
const { scheduleDaily } = require('./scheduler/daily');
const { convertAll } = require('./services/conversion.service');

(async () => {
  try {
    const app = await buildApp();
    app.listen(PORT, () => {
      logger.info({
        msg: 'meta-json-microserver listening',
        port: PORT,
        sourceDir: SOURCE_DIR,
        outputDir: OUTPUT_DIR
      });

      if (DAILY_CONVERT_ENABLED) {
        scheduleDaily({ at: DAILY_CONVERT_AT, task: convertAll, logger });
      }
    });
  } catch (err) {
    // Fail fast if bootstrapping breaks
    console.error(err);
    process.exit(1);
  }
})();
