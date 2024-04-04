
import winston from 'winston';
import config from '../config/config.js';

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

const level = () => {
  const env = config.logger.ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

const colors = {
  fatal: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console({ level: 'http'}),
  new winston.transports.File({ filename: config.logger.ERR || 'errors.log', level: 'error' })
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports
});

export default Logger;
