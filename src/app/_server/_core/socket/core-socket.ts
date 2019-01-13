import { Pipeline } from "../../_services/pipline";
import { SocketService } from "../../_base/socket/socket";
import { Socket } from "socket.io";
import {socketEvents} from "../../../../config/private/socket-events.json"
import { MyLogger } from "../../../infra/logger";

export class CoreSocketService extends SocketService{

    constructor(socketNamespace: SocketIO.Namespace){
        super(socketNamespace);
    }

    subscribeToPipelineEvents(pipeline: Pipeline): void {
        // TODO - add if necessary
    }

    subscribeToSocketEvents(socket: Socket): void{
        socket.on(socketEvents.client.connection, this.onClientConnection.bind(this, socket));
    }
    
    onClientConnection(socket: Socket){
        MyLogger.info(`socket ${socket.id} handshake`);
        socket.emit(socketEvents.server.connectionSuccess);
        MyLogger.info(`emitted connection success`);
    }

}

