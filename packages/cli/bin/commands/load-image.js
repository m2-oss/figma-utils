"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadImage = void 0;
const clipanion_1 = require("clipanion");
const load_figma_image_1 = require("@m2-oss/load-figma-image");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const json_utils_1 = require("../common/json-utils");
class LoadImage extends clipanion_1.Command {
    constructor() {
        super(...arguments);
        this.srcConfig = clipanion_1.Option.String('--config', { required: true });
        this.dstPath = clipanion_1.Option.String({ required: true });
    }
    async execute() {
        const config = await (0, json_utils_1.loadJson)(this.srcConfig);
        if (!process.env.X_FIGMA_TOKEN) {
            throw new Error('X_FIGMA_TOKEN does not define');
        }
        const uint8Array = await (0, load_figma_image_1.loadFigmaImage)(config, process.env.X_FIGMA_TOKEN);
        if (uint8Array) {
            await fs_1.promises.writeFile(path_1.default.resolve(this.dstPath), uint8Array);
        }
    }
}
exports.LoadImage = LoadImage;
LoadImage.paths = [['load-image']];
//# sourceMappingURL=load-image.js.map