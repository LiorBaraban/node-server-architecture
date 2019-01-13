import { MyLogger } from './src/app/infra/logger'
import { Server } from './src/app/_server/server';


process.on('uncaughtException', function (exception) {
    console.log(exception);
});


let server: Server = new Server();