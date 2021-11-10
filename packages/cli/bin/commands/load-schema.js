"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadSchema = void 0;
const clipanion_1 = require("clipanion");
const sync_figma_image_pack_1 = require("@m2-oss/sync-figma-image-pack");
const json_utils_1 = require("../common/json-utils");
class LoadSchema extends clipanion_1.Command {
    constructor() {
        super(...arguments);
        this.config = clipanion_1.Option.String('--config', { required: true });
        this.hash = clipanion_1.Option.Boolean('--hash');
    }
    async execute() {
        const config = await (0, json_utils_1.loadJson)(this.config);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        const minifiedSchema = await (0, sync_figma_image_pack_1.loadMinifiedFigmaSchema)(config, process.env.X_FIGMA_TOKEN);
        if (this.hash) {
            console.log(JSON.stringify((0, sync_figma_image_pack_1.convertSchemaToHashMap)(minifiedSchema), null, '\t'));
        }
        else {
            console.log(JSON.stringify(minifiedSchema, null, '\t'));
        }
    }
}
exports.LoadSchema = LoadSchema;
LoadSchema.paths = [['load-schema']];
//# sourceMappingURL=load-schema.js.map