import { CompileExecutorSchema } from "../compile/schema";
import { TestExecutorSchema } from "../test/schema";

interface Test {
    command: 'test';
    schema: TestExecutorSchema;
}

interface Compile {
    command: 'compile';
    schema: CompileExecutorSchema;
}

interface Coverage {
    command: 'coverage';
    schema: CompileExecutorSchema;
}
export type Commands = Test | Compile | Coverage;