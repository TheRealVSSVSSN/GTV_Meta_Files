const { Router } = require('express');
const { convertAll, convertOne } = require('../services/conversion.service');
const { ensureSafeBasename } = require('../utils/sanitize');

const router = Router();

/**
 * Convert ALL .meta files in SOURCE_DIR
 */
router.post('/convert/all', async (_req, res, next) => {
  try {
    const summary = await convertAll();
    res.json(summary);
  } catch (e) {
    next(e);
  }
});

/**
 * Convert a single file by basename (no extension):
 * POST /convert/:name
 * Example: POST /convert/vehicles  -> reads vehicles.meta, writes vehicles.json
 */
router.post('/convert/:name', async (req, res, next) => {
  try {
    const base = ensureSafeBasename(req.params.name);
    const result = await convertOne(base);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
