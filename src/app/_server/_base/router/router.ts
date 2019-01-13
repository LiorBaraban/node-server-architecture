import express from 'express'
export abstract class RouterService{
    
    public readonly api: string
    private innerRouter: express.Router;
    public exportRouter: express.Router;

    constructor(api:string){
        this.api = api;
        this.innerRouter = express.Router();
        this.exportRouter = express.Router();
        
    }


    public createRoutes(){
        this.setRoutes(this.innerRouter);
        this.wrapRoutes();
    }
    
    public wrapRoutes(){
        this.exportRouter.use(this.api, this.innerRouter)
    }

    public abstract setRoutes(router: express.Router);
}