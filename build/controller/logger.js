const winston = require('winston');
const dateFormat = require('dateformat');
const util = require('util');
const os = require('os');

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
const MAXSIZE = 100000000;
function TIMESTAMP() {
  return dateFormat('yyyy-mm-dd HH:MM:ss.l');
}

/**
 * 日志
 * @param {{
 *   outFile:string,
 *   errFile:string,
 *   level:string
 * }} [config]
 * @constructor
 */
function Logger(config) {
  this.configure(config);
}

Logger.prototype.configure = function (config) {
  const logger = new winston.Logger({
    levels: LEVELS,
    exitOnError: false
  });
  const level = config.level || 'info';
  if (config.outFile) {
    logger.add(winston.transports.File, {
      filename: config.outFile,
      timestamp: TIMESTAMP,
      json: false,
      level: level,
      maxsize: MAXSIZE
    });
  } else {
    logger.add(winston.transports.Console, {
      timestamp: TIMESTAMP,
      json: false,
      level: level
    });
  }
  if (config.errFile) {
    logger.handleExceptions(new winston.transports.File({
      filename: config.errFile,
      timestamp: TIMESTAMP,
      json: false,
      level: level,
      maxsize: MAXSIZE
    }));
  }
  this._logger = logger;
};

function formatError(e) {
  return util.format('%s\nprocess: %s, memory: %j, os loadavg: %j',
    e.stack || e.message, process.pid, process.memoryUsage(), os.loadavg());
}
function formatErrorInArgs(args) {
  if (!args || args.length === 0) {
    return args;
  }
  const len = args.length;
  const e = args[len - 1];
  if (e instanceof Error) {
    args[len - 1] = formatError(e);
  }
  return args;
}

Logger.prototype.debug = function () {
  return this._logger.debug(util.format.apply(util, formatErrorInArgs(arguments)));
};

Logger.prototype.info = function () {
  return this._logger.info(util.format.apply(util, formatErrorInArgs(arguments)));
};

Logger.prototype.warn = function () {
  return this._logger.warn(util.format.apply(util, formatErrorInArgs(arguments)));
};

Logger.prototype.error = function () {
  return this._logger.error(util.format.apply(util, formatErrorInArgs(arguments)));
};

const logger = new Logger(global.SHOMOP_CONF.log);

process.on('uncaughtException', function (e) {
  logger.error('Uncaught exception.', e);
});

exports = module.exports = logger;
