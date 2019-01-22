
import fs from 'fs';
import * as winston from 'winston';
import moment from 'moment';
import { config } from '../../config/private/config-private.json'
import { Utils } from './utils.js';


export class Logger {

    private static _instance: Logger

    private logger: winston.Logger;
    private loggerFormattedDate: string;

    private constructor() {
        this.loggerFormattedDate = moment().format('YYYY-MM-DD');

        let logFolder = config[Utils.env].logFolderPath;
        let logFileWithExtension = config[Utils.env].logFile;
        let fullLogPath = `${logFolder}/${logFileWithExtension}`;

        fs.mkdir(logFolder, (err) => {/*do nothing - folder already exists*/ });

        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: `${logFolder}/${this.loggerFormattedDate}_${logFileWithExtension}`,
                    handleExceptions: true,
                    format: winston.format.combine(
                        // winston.format.json(),
                        winston.format.timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss'
                        }),
                        winston.format.json()
                    )
                }),
                new winston.transports.Console({
                    format: winston.format.printf(info => `${moment().format('YYYY-MM-DD HH:mm:ss')}  ${info.message}`)
                })
            ]
        })
    }

    private static get instance() {
        // check if instance exists
        if (!Logger._instance) {
            Logger._instance = new Logger();
        } else {
            // check for date rotation
            let currentFormattedDate = moment().format('YYYY-MM-DD');
            if (!moment(this._instance.loggerFormattedDate).isSame(currentFormattedDate)) {
                Logger._instance = new Logger();
            }
        }
        return Logger._instance;
    }

    static write(type, message) {
        Logger.instance.logger.log(type, message);
    }

    static info(message) {
        Logger.instance.logger.info(message);
    }

    static error(message) {
        Logger.instance.logger.error(message);
    }

}