import { CommandArgs } from "../libs/interface";

export interface ServeExecutorSchema extends CommandArgs {
    hostname: string;
    port: string;
}
