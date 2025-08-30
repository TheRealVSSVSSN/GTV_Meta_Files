require('dotenv').config();
const { buildApp, logger } = require('./app');
const { PORT, SOURCE_DIR, OUTPUT_DIR } = require('./config');

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
    });
  } catch (err) {
    // Fail fast if bootstrapping breaks
    console.error(err);
    process.exit(1);
  }
})();
