import { ExecutorContext } from '@nx/devkit';
import { ServeExecutorSchema } from './schema';
import { runWithOutput } from '../libs/runWithOutput';

export default async function runExecutor(schema: ServeExecutorSchema, context: ExecutorContext) {

  return runWithOutput('node', schema, [], context);
}
