export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
  }

  debug(message: string, context?: Record<string, unknown>) {
    const entry = this.formatEntry(LogLevel.DEBUG, message, context);
    console.debug(entry);
  }

  info(message: string, context?: Record<string, unknown>) {
    const entry = this.formatEntry(LogLevel.INFO, message, context);
    console.info(entry);
  }

  warn(message: string, context?: Record<string, unknown>) {
    const entry = this.formatEntry(LogLevel.WARN, message, context);
    console.warn(entry);
  }

  error(message: string, context?: Record<string, unknown>) {
    const entry = this.formatEntry(LogLevel.ERROR, message, context);
    console.error(entry);
  }
}

export const logger = new Logger();
