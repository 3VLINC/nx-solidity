import { ExecutorContext } from '@nx/devkit';
import { TestExecutorSchema } from './schema';
import { runWithOutput } from '../libs/runWithOutput';

export default async function runExecutor(schema: TestExecutorSchema, context: ExecutorContext) {

  return runWithOutput(`test`, schema, [], context)
  
}
