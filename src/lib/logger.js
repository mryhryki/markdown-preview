const log4js = require("log4js");

const getLogger = (logLevel) => {
  log4js.configure({
    appenders: {
      console: {
        type: "console",
        layout: {
          type: "basic",
        },
      },
    },
    categories: {
      default: {
        appenders: ["console"],
        level: logLevel,
      },
    },
  });
  return log4js.getLogger();
};

module.exports = getLogger;
