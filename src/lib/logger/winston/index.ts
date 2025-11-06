import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
  colors: {
    emerg: "inverse bold red",
    alert: "bold red",
    crit: "red",
    error: "magenta",
    warning: "yellow",
    notice: "grey",
    info: "green",
    debug: "gray yellowBG",
  },
};

winston.addColors(customLevels.colors);

class WinstonLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      levels: customLevels.levels,
      level: this.getLogLevel(),
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.splat(),
        this.formatLogEntry()
      ),
      transports: this.configureTransports(),
    });
  }

  private getLogLevel() {
    return "info";
  }

  private formatLogEntry() {
    return winston.format.printf(
      ({ level, message, timestamp, ...metadata }) => {
        const metadataStr = Object.keys(metadata).length
          ? ` ${JSON.stringify(metadata)}`
          : "";

        return `${timestamp} [${level}]: ${message}${metadataStr}`;
      }
    );
  }

  private configureTransports() {
    const transports = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          this.formatLogEntry()
        ),
      }),

      new DailyRotateFile({
        filename: path.join(process.cwd(), "logs", "application-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "10m",
        maxFiles: "10d",
      }),

      new DailyRotateFile({
        filename: path.join(
          process.cwd(),
          "logs",
          "application-error-%DATE%.log"
        ),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "10m",
        maxFiles: "10d",
        level: "error",
      }),
    ];

    return transports;
  }

  emerg(message: string, metadata?: object) {
    this.logger.emerg(message, metadata);
  }
  alert(message: string, metadata?: object) {
    this.logger.alert(message, metadata);
  }
  crit(message: string, metadata?: object) {
    this.logger.crit(message, metadata);
  }
  error(message: string, metadata?: object) {
    this.logger.error(message, metadata);
  }
  warning(message: string, metadata?: object) {
    this.logger.warning(message, metadata);
  }
  notice(message: string, metadata?: object) {
    this.logger.notice(message, metadata);
  }
  info(message: string, metadata?: object) {
    this.logger.info(message, metadata);
  }
  debug(message: string, metadata?: object) {
    this.logger.debug(message, metadata);
  }
}

export const Logger = new WinstonLogger();
