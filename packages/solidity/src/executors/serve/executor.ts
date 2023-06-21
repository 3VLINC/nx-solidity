import { ExecutorContext } from '@nx/devkit';
import { ServeExecutorSchema } from './schema';
import { run } from '../libs/run';

export default async function runExecutor(schema: ServeExecutorSchema, context: ExecutorContext) {

  return run('node', schema, [], context);
}
