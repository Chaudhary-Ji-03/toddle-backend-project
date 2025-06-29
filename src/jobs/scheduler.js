const cron = require("node-cron");
const { query } = require("../utils/database");
const logger = require("../utils/logger");

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const result = await query(
      `UPDATE posts
       SET is_published = true
       WHERE scheduled_at <= NOW() AND is_published = false`
    );

    if (result.rowCount > 0) {
      logger.info(`Published ${result.rowCount} scheduled posts`);
    }
  } catch (err) {
    logger.critical("Scheduled post publishing error:", err);
  }
});
