import { ExecutorContext } from '@nx/devkit';
import { CoverageExecutorSchema } from './schema';
import { run } from '../libs/run';

export default async function runExecutor(schema: CoverageExecutorSchema, context: ExecutorContext) {

  return run('coverage', schema, [], context)
  
}
