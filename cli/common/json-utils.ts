import {promises as fs} from "fs";
import path from "path";

export async function loadJson(json:string):Promise<any>{
    let result = undefined;
    try{
        result = JSON.parse(json);
    }catch (e1){
        result = JSON.parse(await fs.readFile(path.resolve(json),'utf8'));
    }
    return result;
}