import { ExecutorContext } from '@nx/devkit';
import { TestExecutorSchema } from './schema';
import { run } from '../libs/run';

export default async function runExecutor(schema: TestExecutorSchema, context: ExecutorContext) {

  return run(`test`, schema, [], context)
  
}
