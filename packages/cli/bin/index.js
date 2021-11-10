"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clipanion_1 = require("clipanion");
const load_schema_1 = require("./commands/load-schema");
const load_image_1 = require("./commands/load-image");
const sync_image_pack_1 = require("./commands/sync-image-pack");
const cli = new clipanion_1.Cli();
cli.register(load_schema_1.LoadSchema);
cli.register(load_image_1.LoadImage);
cli.register(sync_image_pack_1.SyncImagePackCommand);
cli.runExit(process.argv.slice(2), {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
});
//# sourceMappingURL=index.js.map