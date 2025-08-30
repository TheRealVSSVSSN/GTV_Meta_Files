/**
 * Simple HH:MM daily scheduler using server local time.
 * No external dependencies.
 */
function parseTimeOfDay(str) {
  const m = /^\s*([01]?\d|2[0-3]):([0-5]\d)\s*$/.exec(String(str));
  if (!m) {
    const err = new Error('Invalid DAILY_CONVERT_AT, expected HH:MM (00-23:59)');
    err.status = 500;
    throw err;
  }
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function millisUntilNext(target, now = new Date()) {
  const next = new Date(now);
  next.setSeconds(0, 0);
  next.setHours(target.hour, target.minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

function scheduleDaily({ at, task, logger }) {
  const target = parseTimeOfDay(at);

  const scheduleNext = () => {
    const wait = millisUntilNext(target, new Date());
    logger.info({ msg: 'Daily convert scheduled', at, inMs: wait });
    const t = setTimeout(run, wait);
    if (t.unref) t.unref();
  };

  const run = async () => {
    try {
      const start = Date.now();
      logger.info({ msg: 'Daily convert start' });
      const result = await task();
      logger.info({ msg: 'Daily convert done', durationMs: Date.now() - start, result });
    } catch (err) {
      logger.error({ err }, 'Daily convert failed');
    } finally {
      scheduleNext();
    }
  };

  scheduleNext();
}

module.exports = { scheduleDaily, parseTimeOfDay, millisUntilNext };
