"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJson = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function loadJson(json) {
    let result = undefined;
    try {
        result = JSON.parse(json);
    }
    catch (e1) {
        result = JSON.parse(await fs_1.promises.readFile(path_1.default.resolve(json), 'utf8'));
    }
    return result;
}
exports.loadJson = loadJson;
//# sourceMappingURL=json-utils.js.map