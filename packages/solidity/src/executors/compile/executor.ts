import { ExecutorContext } from '@nx/devkit';
import { CompileExecutorSchema } from './schema';
import { runWithOutput } from '../libs/runWithOutput';

export default async function runExecutor(schema: CompileExecutorSchema, context: ExecutorContext) {

  return runWithOutput('compile', schema, [], context)
  
}
