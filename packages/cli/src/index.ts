import { Cli } from 'clipanion';

import { LoadSchema } from './commands/load-schema';
import { LoadImage } from './commands/load-image';
import { SyncImagePackCommand } from './commands/sync-image-pack';

const cli = new Cli();
cli.register(LoadSchema);
cli.register(LoadImage);
cli.register(SyncImagePackCommand);
cli.runExit(process.argv.slice(2), {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
});
