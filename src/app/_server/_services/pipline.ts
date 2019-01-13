import { EventEmitter } from "events";

export class Pipeline extends EventEmitter{
    private static _instance: Pipeline;
    
    private constructor(){
        super();
    }

    public static get instance(){
        if (!Pipeline._instance) {
            console.log("creating pipeline");
            
            Pipeline._instance = new Pipeline();
        }
        return Pipeline._instance;
    }

}
