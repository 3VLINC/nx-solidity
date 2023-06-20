import { ExecutorContext } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';
import { runWithOutput } from '../libs/runWithOutput';

export default async function runExecutor(schema: DeployExecutorSchema, context: ExecutorContext) {
  const { script, ...args } = schema;
  return runWithOutput('run', args, [script], context);
}
