const { logger } = require("../../utils/logger");
const {
  createTableUsers: createTableUsersQuery,
  createTableProperties,
} = require("../queries");

(() => {
  require("../../config/db.config").query(createTableUsersQuery, (err, _) => {
    if (err) {
      logger.error(err.message);
      return;
    }
    logger.info("Table users created!");
  });
  require("../../config/db.config").query(createTableProperties, (err, _) => {
    if (err) {
      logger.error(err.message);
      return;
    }
    logger.info("Table properties created!");
    process.exit(0);
  });
})();
