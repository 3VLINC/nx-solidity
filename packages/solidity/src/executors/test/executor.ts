import { ExecutorContext } from '@nx/devkit';
import { TestExecutorSchema } from './schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import { dirname, resolve } from 'path';

export default async function runExecutor(options: TestExecutorSchema, context: ExecutorContext) {

  
  const project = context.projectGraph.nodes[context.projectName];

  const cwd = dirname(resolve(context.root, options.hardhatConfig));
  
  const { stdout, stderr } = await promisify(exec)(
    `npx hardhat test`,
    {
      cwd
    }
  );
  console.log(stdout);
  console.error(stderr);

  const success = !stderr;
  return { success };
  
}
