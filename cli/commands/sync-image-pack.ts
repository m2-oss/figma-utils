import { Command, Option } from 'clipanion';

import { ImagePackConfig } from '../../src/export-icons/config';
import { syncImagePack } from '../../src/export-icons/sync-image-pack';
import { loadJson } from '../common/json-utils';

export class SyncImagePackCommand extends Command {
    config = Option.String('--config', { required: true });
    targetDir = Option.String('--target-dir', { required: true });
    async execute(): Promise<number | void> {
        const config: ImagePackConfig[] = await loadJson(this.config);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        await syncImagePack(config, process.env.X_FIGMA_TOKEN, this.targetDir);
    }
    static paths = [['sync-image-pack']];
}
