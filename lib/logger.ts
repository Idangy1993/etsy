/**
 * Centralized logging utility for the application
 * Provides consistent logging format and environment-based logging levels
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${level.toUpperCase()}`;

    if (data) {
      return `${prefix}: ${message} ${JSON.stringify(data, null, 2)}`;
    }

    return `${prefix}: ${message}`;
  }

  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage("info", message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage("warn", message, data));
    }
  }

  error(message: string, error?: any): void {
    // Always log errors, even in production
    console.error(this.formatMessage("error", message, error));
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage("debug", message, data));
    }
  }
}

export const logger = new Logger();
