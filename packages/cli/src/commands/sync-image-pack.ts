import { Command, Option } from 'clipanion';

import { syncFigmaImagePack, ImageFigmaPackConfig } from '@m2-oss/sync-figma-image-pack';

import { loadJson } from '../common/json-utils';

export class SyncImagePackCommand extends Command {
    config = Option.String('--config', { required: true });
    targetDir = Option.String('--target-dir', { required: true });
    async execute(): Promise<number | void> {
        const config: ImageFigmaPackConfig[] = await loadJson(this.config);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        await syncFigmaImagePack(config, process.env.X_FIGMA_TOKEN, this.targetDir);
    }
    static paths = [['sync-image-pack']];
}
