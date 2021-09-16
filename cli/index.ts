import { Cli } from 'clipanion';
import { Schema } from './commands/schema';
import {LoadImage} from "./commands/load-image";

const cli = new Cli();
cli.register(Schema);
cli.register(LoadImage);
cli.runExit(process.argv.slice(2), {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
});
