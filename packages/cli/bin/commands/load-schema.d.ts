import { Command } from 'clipanion';
export declare class LoadSchema extends Command {
    config: string;
    hash: boolean | undefined;
    static paths: string[][];
    execute(): Promise<void>;
}
