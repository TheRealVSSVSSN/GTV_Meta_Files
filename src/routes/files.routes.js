const { Router } = require('express');
const { listMetaFiles } = require('../services/conversion.service');
const router = Router();

router.get('/files', async (_req, res, next) => {
  try {
    const files = await listMetaFiles();
    res.json({ count: files.length, files });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
