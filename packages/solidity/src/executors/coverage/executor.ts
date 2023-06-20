import { ExecutorContext } from '@nx/devkit';
import { CoverageExecutorSchema } from './schema';
import { runWithOutput } from '../libs/runWithOutput';

export default async function runExecutor(schema: CoverageExecutorSchema, context: ExecutorContext) {

  return runWithOutput('coverage', schema, [], context)
  
}
