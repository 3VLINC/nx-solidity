import { ExecutorContext } from '@nx/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';
import { TestExecutorSchema } from '../test/schema';
import { dirname, resolve } from 'path';
import { CompileExecutorSchema } from '../compile/schema';

interface Test {
    command: 'test';
    schema: TestExecutorSchema;
}

interface Compile {
    command: 'compile';
    schema: CompileExecutorSchema;
}
type Commands = Test | Compile;

export const run = async (
  options: Commands,
  context: ExecutorContext
) => {
  try {
    const cwd = dirname(resolve(context.root, options.schema.hardhatConfig));
    const { stdout } = await promisify(exec)(`npx hardhat ${options.command}`, {
      cwd,
    });
    console.log(stdout);
    return { success: true };
  } catch (e) {
    console.error(e.stdout);
    return { success: false };
  }
};
