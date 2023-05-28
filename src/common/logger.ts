/**
 * The log levels available for the logger.
 */
export enum LogLevel {
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
}

/**
 * The Logger class provides logging functionality with different log levels and colors.
 */
export class Logger {

    /**
     * Get the color associated with a log level.
     * @param level - The level of the log.
     * @returns The color code for the log level.
     */
    private getColor(level: LogLevel): string {
        let color: string;

        switch (level) {
            case LogLevel.Info:
                color = '32m'; // Green color for info level
                break;
            case LogLevel.Warn:
                color = '31m'; // Red color for warn level
                break;
            default:
                color = '33m'; // Yellow color for other levels
                break;
        }

        return color;
    }

    /**
     * Print a log message to the console.
     * @param tag - The tag of the logger.
     * @param level - The log level.
     * @param message - The message to be logged.
     */
    public terminal(tag: string, level: LogLevel, message: string): void {
        const color = this.getColor(level);
        const logMessage = this.createLogMessage(tag, level, message);
        console.log(`\x1b[${color}[${logMessage}] \x1b[0m`);
    }

    /**
     * Creates a formatted log message.
     * @param tag - The tag of the logger.
     * @param level - The log level.
     * @param message - The message to be logged.
     * @returns The formatted log message.
     */
    private createLogMessage(tag: string, level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        const logLevel = level.toUpperCase();
        return `${timestamp} [${tag}] ${logLevel}: ${message}`;
    }
}