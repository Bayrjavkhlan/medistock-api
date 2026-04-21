"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
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
winston_1.default.addColors(customLevels.colors);
class WinstonLogger {
    logger;
    constructor() {
        this.logger = winston_1.default.createLogger({
            levels: customLevels.levels,
            level: this.getLogLevel(),
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.splat(), this.formatLogEntry()),
            transports: this.configureTransports(),
        });
    }
    getLogLevel() {
        return "info";
    }
    formatLogEntry() {
        return winston_1.default.format.printf(({ level, message, timestamp, ...metadata }) => {
            const metadataStr = Object.keys(metadata).length
                ? ` ${JSON.stringify(metadata)}`
                : "";
            return `${timestamp} [${level}]: ${message}${metadataStr}`;
        });
    }
    configureTransports() {
        const transports = [
            new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), this.formatLogEntry()),
            }),
            new winston_daily_rotate_file_1.default({
                filename: path_1.default.join(process.cwd(), "logs", "application-%DATE%.log"),
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "10m",
                maxFiles: "10d",
            }),
            new winston_daily_rotate_file_1.default({
                filename: path_1.default.join(process.cwd(), "logs", "application-error-%DATE%.log"),
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "10m",
                maxFiles: "10d",
                level: "error",
            }),
        ];
        return transports;
    }
    emerg(message, metadata) {
        this.logger.emerg(message, metadata);
    }
    alert(message, metadata) {
        this.logger.alert(message, metadata);
    }
    crit(message, metadata) {
        this.logger.crit(message, metadata);
    }
    error(message, metadata) {
        this.logger.error(message, metadata);
    }
    warning(message, metadata) {
        this.logger.warning(message, metadata);
    }
    notice(message, metadata) {
        this.logger.notice(message, metadata);
    }
    info(message, metadata) {
        this.logger.info(message, metadata);
    }
    debug(message, metadata) {
        this.logger.debug(message, metadata);
    }
}
exports.Logger = new WinstonLogger();
//# sourceMappingURL=index.js.map