import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const createLogger = (labelText: string) => {
  const logger = winston.createLogger({
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      label({ label: labelText }),
      logFormat
    ),
    transports: [
      new winstonDaily({
        level: "info",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + "/info",
        filename: `info.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      new winstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + "/error",
        filename: `error.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      new winstonDaily({
        level: "warn",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + "/warn",
        filename: `warn.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      new winstonDaily({
        level: "debug",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + "/debug",
        filename: `debug.error.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      new winstonDaily({
        level: "verbose",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + "/verbose",
        filename: `verbose.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
    ],
    exceptionHandlers: [
      new winstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: logDir,
        filename: `%DATE%.exception.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
    ],
  });

  return logger;
};

export const logger = createLogger("homo-memetus-bot");
