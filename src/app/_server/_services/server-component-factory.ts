import { CoreServerComponent } from "../_core/core-server-component";
import { CoreSocketService } from "../_core/socket/core-socket";
import { SocketIOServer } from "./socket-io-server";
import { CoreRouterService } from "../_core/router/core-router";

// TODO - REPLACE WITH DI FRAMEWORK

export class ServerComponentFactory {

    static createCoreComponent() {
        return new CoreServerComponent(new CoreRouterService('/core'), new CoreSocketService(SocketIOServer.instance.createNamespace('CORE')));
    }
}