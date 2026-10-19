import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { env } from '../config/env';

const logDir = path.resolve(
  process.cwd(),
  process.env.LOG_DIR?.trim() || 'logs',
);

fs.mkdirSync(logDir, { recursive: true });

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/** Daily app logs — rotated each day, kept for 3 days. */
const dailyTransport = new DailyRotateFile({
  dirname: logDir,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '3d',
  level: 'info',
});

/** Weekly rollup logs — one file per ISO week, kept for 3 days of files window. */
const weeklyTransport = new DailyRotateFile({
  dirname: logDir,
  filename: 'app-week-%DATE%.log',
  datePattern: 'YYYY-[W]WW',
  zippedArchive: false,
  maxFiles: '3d',
  level: 'info',
});

const consoleTransport = new winston.transports.Console({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${String(timestamp)} ${level}: ${String(message)}${rest}`;
    }),
  ),
});

const winstonLogger = winston.createLogger({
  level: 'info',
  format: jsonFormat,
  defaultMeta: { service: 'marriage-server' },
  transports: [dailyTransport, weeklyTransport, consoleTransport],
});

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    winstonLogger.info(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    winstonLogger.warn(message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    winstonLogger.error(message, meta),
  debug: (message: string, meta?: Record<string, unknown>) =>
    winstonLogger.debug(message, meta),
};

export function getLogDirectory(): string {
  return logDir;
}
