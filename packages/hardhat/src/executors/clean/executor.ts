import { ExecutorContext } from '@nx/devkit';
import { CleanExecutorSchema } from './schema';
import { run } from '../libs/run';

export default async function runExecutor(schema: CleanExecutorSchema, context: ExecutorContext) {

  return run('clean', schema, [], context)
  
}
