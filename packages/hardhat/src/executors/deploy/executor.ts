import { ExecutorContext } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';
import { run } from '../libs/run';

export default async function runExecutor(schema: DeployExecutorSchema, context: ExecutorContext) {
  const { script, ...args } = schema;
  return run('run', args, [script], context);
}
