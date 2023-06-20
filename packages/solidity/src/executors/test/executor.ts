import { ExecutorContext } from '@nx/devkit';
import { TestExecutorSchema } from './schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import { dirname, resolve } from 'path';

export default async function runExecutor(options: TestExecutorSchema, context: ExecutorContext) {

  const cwd = dirname(resolve(context.root, options.hardhatConfig));

  try {

    const { stdout } = await promisify(exec)(
      `npx hardhat test`,
      {
        cwd
      }
      );
      console.log(stdout);
      return { success: true };
    } catch (e) {
      console.error(e.stdout);
      return { success : false}
    }

  
}
