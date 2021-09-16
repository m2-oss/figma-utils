import { Command, Option } from 'clipanion';
import { loadMinifiedSchema, SrcSchemaConfig } from '../../src/index';
import {loadJson} from "../common/json-utils";

export class LoadSchema extends Command {
    config = Option.String('--config',{required:true});

    static paths = [['load-schema']];

    async execute() {
      const config:SrcSchemaConfig = await loadJson(this.config);
      if (!process.env.X_FIGMA_TOKEN) {
        throw new Error('X_FIGMA_TOKEN does not define');
      }
      const minifiedSchema = await loadMinifiedSchema(config, process.env.X_FIGMA_TOKEN);
      console.log(JSON.stringify(minifiedSchema, null, '\t'));
    }
}
