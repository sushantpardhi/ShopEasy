import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        format
    ),
  }),

  new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '../../logs/error/error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    frequency: '1d',
    maxFiles: '14d',
    format,
    createSymlink: true,
    symlinkName: 'error.log',
  }),

  new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    frequency: '1d',
    maxFiles: '14d',
    format,
    createSymlink: true,
    symlinkName: 'combined.log',
  }),
];


const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
});

export default logger;
