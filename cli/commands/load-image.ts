import { Command, Option } from 'clipanion';

import { loadImage, SrcImageConfig } from '../../src/index';
import { promises as fs } from 'fs';
import path from 'path';
import { loadJson } from '../common/json-utils';

export class LoadImage extends Command {
    srcConfig = Option.String('--config', { required: true });

    dstPath = Option.String({ required: true });

    static paths = [['load-image']];

    async execute(): Promise<void> {
        const config: SrcImageConfig = await loadJson(this.srcConfig);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        const uint8Array = await loadImage(config, process.env.X_FIGMA_TOKEN);
        if (uint8Array) {
            await fs.writeFile(path.resolve(this.dstPath), uint8Array);
        }
    }
}
