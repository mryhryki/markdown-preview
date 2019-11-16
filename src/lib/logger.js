const log4js = require('log4js');
const { logLevel } = require('./param');

const Logger = log4js.getLogger();
log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'basic',
      },
    },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: logLevel,
    },
  },
});

module.exports = Logger;
