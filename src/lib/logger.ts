import log4js, { Logger as LoggerType } from "log4js";

const LogLevels = ["trace", "debug", "info", "warn", "error", "fatal"] as const;
export type LogLevel = typeof LogLevels[number];
export function getLogLevel(level: string): LogLevel {
  switch (level) {
    case "trace":
    case "debug":
    case "info":
    case "warn":
    case "error":
    case "fatal":
      return level;
    default:
      throw new Error(`Undefined log level: ${level}`);
  }
}

export type Logger = LoggerType;

export function getLogger(logLevel: LogLevel): Logger {
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
}
