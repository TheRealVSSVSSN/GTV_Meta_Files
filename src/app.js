const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pino = require('pino');
const pinoHttp = require('pino-http');
const { SOURCE_DIR, OUTPUT_DIR, AUTO_CONVERT_ON_START } = require('./config');
const { ensureDir } = require('./utils/fsx');
const healthRoutes = require('./routes/health.routes');
const filesRoutes = require('./routes/files.routes');
const convertRoutes = require('./routes/convert.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { convertAll } = require('./services/conversion.service');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

async function buildApp() {
  await ensureDir(SOURCE_DIR);
  await ensureDir(OUTPUT_DIR);

  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Soft rate limit on mutating endpoints
  app.use(
    ['/convert', '/convert/all'],
    rateLimit({
      windowMs: 60_000,
      max: 30,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(healthRoutes);
  app.use(filesRoutes);
  app.use(convertRoutes);

  app.use(notFound);
  app.use(errorHandler);

  if (AUTO_CONVERT_ON_START) {
    // Fire-and-forget; log summary
    convertAll()
      .then(sum => logger.info({ msg: 'Auto convert on start complete', ...sum }))
      .catch(err => logger.error({ err }, 'Auto convert on start failed'));
  }

  return app;
}

module.exports = { buildApp, logger };
