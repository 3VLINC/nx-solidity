import { ExecutorContext } from '@nx/devkit';
import { ChildProcess, fork } from 'child_process';
import { dirname, join, resolve } from 'path';
import { CommandArgs } from './interface';

let childProcess: ChildProcess;

export const runWithOutput = async <T extends CommandArgs>(command: string, args: T,  positionals: string[], context: ExecutorContext) => {
  try {
    
    const { hardhatConfig, ...rest} = args;
    
    const parsedArgs = Object.keys(rest).reduce<string[]>((accum, val) => {
      return accum.concat([`--${val}`, rest[val]]);
    }, [])
    
    await startAsync([command, ...parsedArgs, ...positionals], hardhatConfig, context);

    return { success: true };
    
  } finally {
    if (childProcess) {
      childProcess.kill();
    }
  }
};

const startAsync = async (command: string[], hardhatConfig: string, context: ExecutorContext) => {

  const cwd = dirname(resolve(context.root, hardhatConfig));
  return new Promise((resolve, reject) => {
    
    childProcess = fork(
      join(context.root, './node_modules/.bin/hardhat'),
      command, {
      cwd,
    });

    childProcess.on('error', (err) => {
      reject(err);
    });
    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });

  
}
