declare class WinstonLogger {
    private logger;
    constructor();
    private getLogLevel;
    private formatLogEntry;
    private configureTransports;
    emerg(message: string, metadata?: object): void;
    alert(message: string, metadata?: object): void;
    crit(message: string, metadata?: object): void;
    error(message: string, metadata?: object): void;
    warning(message: string, metadata?: object): void;
    notice(message: string, metadata?: object): void;
    info(message: string, metadata?: object): void;
    debug(message: string, metadata?: object): void;
}
export declare const Logger: WinstonLogger;
export {};
//# sourceMappingURL=index.d.ts.map