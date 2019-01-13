import { MyLogger } from "../../../infra/logger";
import { socketEvents } from "../../../../config/private/socket-events.json"
import { Pipeline } from "../../_services/pipline";
import {Socket} from 'socket.io'

export abstract class SocketService {

    socketNamespace: SocketIO.Namespace;

    constructor(socketNamespace: SocketIO.Namespace) {
        this.socketNamespace = socketNamespace;
    }

    createSocketConnection() {
        this.socketNamespace.on(socketEvents.client.connection, this.onSocketConnection.bind(this));
        
        this.subscribeToPipelineEvents(Pipeline.instance);
    }

    onSocketConnection(socket:Socket){
        console.log(`socket ${socket.id} handshake on ${this.socketNamespace.name}`);
        socket.on(socketEvents.client.disconnect, this.onSocketDisconnect.bind(this, socket));
        this.subscribeToSocketEvents(socket);
        MyLogger.info(socketEvents.server.connectionSuccess);
        socket.emit(socketEvents.server.connectionSuccess);
    };

    onSocketDisconnect(socket:Socket){
        MyLogger.info(`socket ${socket.id} disconnected from ${this.socketNamespace.name}`);
    }

    
    abstract subscribeToPipelineEvents(pipeline: Pipeline): void;
    
    abstract subscribeToSocketEvents(socket: Socket): void;
    
}