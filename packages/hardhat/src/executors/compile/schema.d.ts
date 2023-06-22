import { CommandArgs } from "../libs/interface";
export interface CompileExecutorSchema extends CommandArgs {
    concurrency: number;
};