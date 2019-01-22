export class Utils{
    static get env(){
        return <string>process.env["NODE_ENV"];
    }
}