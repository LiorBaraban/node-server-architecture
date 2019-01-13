import { Server } from './src/app/_server/server';


process.on('uncaughtException', (exception)=>{
    console.log(exception);
});


let server: Server = new Server();