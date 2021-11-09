import { Command, Option } from 'clipanion';

import { convertSchemaToHashMap } from '../../src/export-icons/schema';
import { loadMinifiedSchema, SrcSchemaConfig } from '../../src/index';
import { loadJson } from '../common/json-utils';

export class LoadSchema extends Command {
    config = Option.String('--config', { required: true });

    hash = Option.Boolean('--hash');

    static paths = [['load-schema']];

    async execute(): Promise<void> {
        const config: SrcSchemaConfig = await loadJson(this.config);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        const minifiedSchema = await loadMinifiedSchema(config, process.env.X_FIGMA_TOKEN);
        if (this.hash) {
            console.log(JSON.stringify(convertSchemaToHashMap(minifiedSchema), null, '\t'));
        } else {
            console.log(JSON.stringify(minifiedSchema, null, '\t'));
        }
    }
}
