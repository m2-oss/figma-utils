import { Command, Option } from 'clipanion';

import {
    loadMinifiedFigmaSchema,
    SrcFigmaImagePackConfig,
    convertSchemaToHashMap,
} from '@m2-oss/sync-figma-image-pack';

import { loadJson } from '../common/json-utils';

export class LoadSchema extends Command {
    config = Option.String('--config', { required: true });

    hash = Option.Boolean('--hash');

    static paths = [['load-schema']];

    async execute(): Promise<void> {
        const config: SrcFigmaImagePackConfig = await loadJson(this.config);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        const minifiedSchema = await loadMinifiedFigmaSchema(config, process.env.X_FIGMA_TOKEN);
        if (this.hash) {
            console.log(JSON.stringify(convertSchemaToHashMap(minifiedSchema), null, '\t'));
        } else {
            console.log(JSON.stringify(minifiedSchema, null, '\t'));
        }
    }
}
