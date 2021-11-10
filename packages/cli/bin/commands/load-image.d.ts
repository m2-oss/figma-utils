import { Command } from 'clipanion';
export declare class LoadImage extends Command {
    srcConfig: string;
    dstPath: string;
    static paths: string[][];
    execute(): Promise<void>;
}
