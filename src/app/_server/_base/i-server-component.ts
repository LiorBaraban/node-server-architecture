import { RouterService } from "./router/router";
import { SocketService } from "./socket/socket";

export interface IServerComponent{
    routerService?: RouterService;
    socketService?: SocketService;
}