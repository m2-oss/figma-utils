"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncImagePackCommand = void 0;
const clipanion_1 = require("clipanion");
const sync_figma_image_pack_1 = require("@m2-oss/sync-figma-image-pack");
const json_utils_1 = require("../common/json-utils");
class SyncImagePackCommand extends clipanion_1.Command {
    constructor() {
        super(...arguments);
        this.config = clipanion_1.Option.String('--config', { required: true });
        this.targetDir = clipanion_1.Option.String('--target-dir', { required: true });
    }
    async execute() {
        const config = await (0, json_utils_1.loadJson)(this.config);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        await (0, sync_figma_image_pack_1.syncFigmaImagePack)(config, process.env.X_FIGMA_TOKEN, this.targetDir);
    }
}
exports.SyncImagePackCommand = SyncImagePackCommand;
SyncImagePackCommand.paths = [['sync-image-pack']];
//# sourceMappingURL=sync-image-pack.js.map