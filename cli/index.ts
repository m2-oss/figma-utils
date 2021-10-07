import { Cli } from "clipanion";

import { LoadSchema } from "./commands/load-schema";
import { LoadImage } from "./commands/load-image";

const cli = new Cli();
cli.register(LoadSchema);
cli.register(LoadImage);
cli.runExit(process.argv.slice(2), {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
});
