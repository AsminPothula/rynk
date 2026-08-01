import { LoggerService } from '@nestjs/common';
import chalk from 'chalk';
import PrettyError from 'pretty-error';
import * as winston from 'winston';
import { LoggerOptions } from 'winston';

export class LogService implements LoggerService {
  private readonly _logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
      new winston.transports.File({
        filename: 'application.log',
        dirname: 'logs',
        zippedArchive: false,
        maxsize: 400,
        maxFiles: 7,
      }),
    ],
  });

  private readonly _prettyError = new PrettyError()
    .skipNodeFiles()
    .skipPackage('express', '@nestjs/common', '@nestjs/core');

  private readonly _chalk = new chalk.Instance();

  constructor(private context: string) {}

  log(message: string): void {
    const currentDate = new Date();
    this._logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('info', message);
  }

  error(e: Error): void {
    const { message, stack } = e;
    const currentDate = new Date();
    this._logger.error(`${message} -> (${stack || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('error', message, stack);
  }

  warn(message: string): void {
    const currentDate = new Date();
    this._logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('warn', message);
  }

  overrideOptions(options: LoggerOptions) {
    this._logger.configure(options);
  }

  private formatedLog(level: string, message: string, error?: any): void {
    let result = '';
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      case 'info':
        result = `[${this._chalk.blue(
          'INFO',
        )}] ${this._chalk.dim.yellow.bold.underline(time)} [${this._chalk.green(
          this.context,
        )}] ${message}`;
        break;
      case 'error':
        result = `[${this._chalk.red(
          'ERR',
        )}] ${this._chalk.dim.yellow.bold.underline(time)} [${this._chalk.green(
          this.context,
        )}] ${message}`;
        if (error) this._prettyError.render(error, true);
        break;
      case 'warn':
        result = `[${this._chalk.yellow(
          'WARN',
        )}] ${this._chalk.dim.yellow.bold.underline(time)} [${this._chalk.green(
          this.context,
        )}] ${message}`;
        break;
      default:
        break;
    }
    console.log(result);
  }
}
