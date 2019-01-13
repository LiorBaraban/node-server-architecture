import { IServerComponent } from "./i-server-component";
import { RouterService } from "./router/router";
import { SocketService } from "./socket/socket";

export abstract class ServerComponent implements IServerComponent {
    routerService?: RouterService;
    socketService?: SocketService;

    constructor(iServerComponent: IServerComponent) {
        Object.assign(this, iServerComponent);
    }
    
    createServerComponent(){
        if (this.routerService){
            this.routerService.createRoutes();
        }

        if (this.socketService){
            this.socketService.createSocketConnection();
        }
    }
}