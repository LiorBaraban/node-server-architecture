
import fs from 'fs';
import * as winston from 'winston';
import moment from 'moment';
import { config } from '../../config/private/config-private.json'
import { Utils } from '../_server/_services/utils.js';


export class Logger {

    private static _instance: Logger

    private logger : winston.Logger;

    private constructor() {

        let logFolder = config[Utils.env].logFolderPath;
        let logFile = config[Utils.env].logFile;
        let fullLogPath = `${logFolder}/${logFile}`; 

        fs.mkdir(logFolder,(err)=>{/*do nothing - folder already exists*/});

        this.logger =  winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: `${fullLogPath}_${moment().format('YYYY-MM-DD')}`,
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

    private static get instance(){
        if (!Logger._instance) {
            console.log("creating Logger");
            
            Logger._instance = new Logger();
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