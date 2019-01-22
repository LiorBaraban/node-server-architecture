import express from 'express';
import http from 'http'
import bodyParser from 'body-parser'
import { config } from '../../config/private/config-private.json'
import { Logger } from '../infra/logger.js';
import { ServerComponent } from './_base/server-component.js';
import { ServerComponentFactory } from './_services/server-component-factory.js';
import { SocketIOServer } from './_services/socket-io-server.js';
import { Utils } from '../infra/utils.js';

export class Server {
 

    server: http.Server;
    expressApp: express.Express;
    port: number;
    serverComponents: Array<ServerComponent>;

    constructor() {
        this.expressApp = express();
        this.server = http.createServer(this.expressApp);
        SocketIOServer.instance.createSocketIOServer(this.server);
        this.port = this.getPort();

        this.listen();
        this.setExpressGlobalRouteConfiguration();
        this.createServerComponents();
    }


    private getPort() {
        let port: number;
        if (config[Utils.env].port) {
            port = config[Utils.env].port;
        } else {
            port = 3000;
        }
        return port;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            Logger.write("info", 'listening on *:' + this.port);
        });
    }

    private setExpressGlobalRouteConfiguration(){
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.all('/*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", config[Utils.env].AllowOrigins.join(',')); // restrict it to the required domain
            res.header('Access-Control-Allow-Methods', 'GET,POST');
            res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
            // res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
            next();
        });
    }

    private createServerComponents(): any {
        this.serverComponents = new Array<ServerComponent>();

        this.serverComponents.push(ServerComponentFactory.createCoreComponent());

        this.serverComponents.forEach((serverComponent)=>{

            serverComponent.createServerComponent();

            if (serverComponent.routerService){
                // assign ServerComponent routes in express:
                this.expressApp.use('/api', serverComponent.routerService.exportRouter);
            }
        })
    }

}