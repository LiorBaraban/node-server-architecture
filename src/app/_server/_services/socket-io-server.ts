import socketIo from "socket.io";
import http from "http";

export class SocketIOServer{
    
    private _socketIOServer: SocketIO.Server;
    private static _instance: SocketIOServer;

    private constructor() {
    }

    public static get instance() {
        if (!SocketIOServer._instance) {
            console.log("creating io instance");
            
            SocketIOServer._instance = new SocketIOServer();
        }
        return SocketIOServer._instance;
    }

    public createSocketIOServer(server: http.Server) {
        if (this._socketIOServer) {
            throw "Cannot create SocketIO server because it already exists!";
        }

        console.log("creating io server");
        this._socketIOServer = socketIo(server);
        console.log("io server created!");
        return this._socketIOServer;
    }

    public createNamespace(name: string) {
        return this.socketIOServer.of('/' + name);
    }

    public get socketIOServer() {
        return this._socketIOServer;
    }

    public getAllConnections(): any {
        return this.socketIOServer.sockets;
    }

    public getNamespaceConnection(namespace: SocketIO.Namespace): any {
        return namespace.sockets;
    }
}