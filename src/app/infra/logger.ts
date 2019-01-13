
import * as winston from 'winston';
import { Logger, transports } from 'winston';
import moment from 'moment';
import { config } from '../../config/public/config-public.json'
import { format } from 'util';


export class MyLogger {

    
    static logger = winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: config.logPath,
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


    static write(type, message) {
        this.logger.log(type, message);
    }

    static info(message) {
        this.logger.info(message);
    }

    static error(message) {
        this.logger.error(message);
    }

}