import { Command } from 'clipanion';
export declare class SyncImagePackCommand extends Command {
    config: string;
    targetDir: string;
    execute(): Promise<number | void>;
    static paths: string[][];
}
