
import { CoreRouterService } from "./router/core-router";
import { ServerComponent } from "../_base/server-component";
import { CoreSocketService } from "./socket/core-socket";


export class CoreServerComponent extends ServerComponent{
    constructor(coreRouterService: CoreRouterService, coreSocketService: CoreSocketService) {
        super({
            routerService: coreRouterService,
            socketService: coreSocketService
        });
    }
}