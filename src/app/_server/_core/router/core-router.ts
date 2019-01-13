import * as express from 'express';
import * as fs from 'fs'
import { RouterService } from "../../_base/router/router";
import { SocketIOServer } from '../../_services/socket-io-server';
import moment = require('moment');
import { MyLogger } from '../../../infra/logger';
import { config } from '../../../../config/public/config-public.json'


export class CoreRouterService extends RouterService {


    constructor(api:string){
        super(api);
    }

    public setRoutes(router: express.Router) {
        //Get Active Sockets
        router.get('/activeSockets', (req: express.Request, res: express.Response) => {
            try {
                let uptime = this.getFormattedUptime();

                let socketIOServerRef = SocketIOServer.instance.socketIOServer;

                var nsps = Object.keys(socketIOServerRef.sockets.adapter.nsp['server'].nsps);
                //console.dir(nsps);
                console.log("");
                console.log("##############################################");
                console.log("");
                console.log(`Server Uptime is ${uptime}`)
                console.log("");
                console.log(`CONNECTED SOCKETS REPORT ${moment(new Date(Date.now())).format('YYYY-MM-DD hh:mm:ss')}`);
                nsps.forEach((namespace) => {
                    console.log("");
                    console.log(`namespace: ${namespace}`);
                    console.log(`***********************`);
                    console.log("");
                    var ns = socketIOServerRef.of(namespace);
                    Object.keys(ns.connected).forEach((id, index) => {
                        var roomkeys = Object.keys(ns.connected[id].rooms);
                        var msg = `${index + 1}) ${id} `;
                        roomkeys.forEach((key) => {
                            msg = msg + `${key} `;
                        });
                        console.log(msg);
                        console.log("");
                    });
                })
                console.log("##############################################");
                console.log("");

                var numOfConnections = Object.keys(socketIOServerRef.sockets.adapter.sids).length;
                res.status(200).send(`Connection OK.\nUptime is ${uptime} \n${numOfConnections} sockets connected.\nAdditional info info in the Node console.`);
            }
            catch (e) {
                MyLogger.error("error in router");
                res.status(400).send("error");
            }
        });


        router.get('/getLogFile', (req: express.Request, res: express.Response) => {
            let logFilePath = config.logPath;
            let split = logFilePath.split('.');
            let fileExtension = split[split.length -1];
            let fileName = split[split.length -2];
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + `${fileName}.${fileExtension}`,
              });
            fs.createReadStream(logFilePath).pipe(res);
        });

        router.get('/getUptime', (req: express.Request, res: express.Response)=>{
            let formattedUptime = this.getFormattedUptime()
            res.status(200).send(`uptime is ${formattedUptime}`);
        });
    }

    private getFormattedUptime(){
        let uptimeInSeconds = process.uptime();

        let days = Math.floor(uptimeInSeconds / (60*60*24));
        let hours = Math.floor(uptimeInSeconds % (60*60*24) / (60*60));
        let minutes = Math.floor(uptimeInSeconds % (60*60) / 60);
        let seconds = Math.floor(uptimeInSeconds % 60);
        
        return this.padTime(days)+' days , ' + this.padTime(hours) + ' hours , ' + this.padTime(minutes) + ' minutes , ' + this.padTime(seconds)+ ' seconds';
    }

    private padTime(s:number){
        return (s < 10 ? '0' : '') + s;
    }

}