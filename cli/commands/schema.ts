import { Command, Option } from 'clipanion';
import { loadMinifiedSchema, SrcSchemaConfig } from '../../src/index';

export class Schema extends Command {
    config = Option.String('--config');

    static paths = [['schema']];

    async execute() {
      const config:SrcSchemaConfig = JSON.parse(this.config || '');
      if (!process.env.X_FIGMA_TOKEN) {
        throw new Error('X_FIGMA_TOKEN does not define');
      }
      const minifiedSchema = await loadMinifiedSchema(config, process.env.X_FIGMA_TOKEN);
      console.log(JSON.stringify(minifiedSchema, null, '\t'));
    }
}
