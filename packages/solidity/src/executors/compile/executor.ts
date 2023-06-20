import { ExecutorContext } from '@nx/devkit';
import { CompileExecutorSchema } from './schema';
import { run } from '../libs/run';

export default async function runExecutor(schema: CompileExecutorSchema, context: ExecutorContext) {

  return run({ command: 'compile', schema }, context)
  
}
