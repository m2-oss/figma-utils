import { Command, Option } from 'clipanion';
import {loadImage, SrcImageConfig} from '../../src/index';
import {promises as fs} from "fs";
import path from "path";

export class LoadImage extends Command {
    srcConfig = Option.String('--src-config',{required:true});

    dst = Option.String('--dst',{required:true});

    static paths = [['load-image']];

    async execute() {
        const config:SrcImageConfig = JSON.parse(this.srcConfig || '');
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        const uint8Array = await loadImage(config, process.env.X_FIGMA_TOKEN);
        if(uint8Array.length > 0){
            await fs.writeFile(path.resolve(this.dst), uint8Array);
        }
    }
}