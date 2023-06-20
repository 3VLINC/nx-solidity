import {
  addDependenciesToPackageJson,
  ensurePackage,
  extractLayoutDirectory,
  generateFiles,
  GeneratorCallback,
  getWorkspaceLayout,
  joinPathFragments,
  logger,
  names,
  readProjectConfiguration,
  runTasksInSerial,
  toJS,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as NxNode from '@nx/node';
import { SolidityGeneratorSchema } from './schema';
import { join } from 'path';
import { platform } from 'os';
import { existsSync, removeSync, symlinkSync } from 'fs-extra';

export function ensureNodeModulesSymlink(
  workspaceRoot: string,
  projectRoot: string
): void {
  const worksapceNodeModulesPath = join(workspaceRoot, 'node_modules');
  if (!existsSync(worksapceNodeModulesPath)) {
    throw new Error(`Cannot find ${worksapceNodeModulesPath}`);
  }

  const appNodeModulesPath = join(workspaceRoot, projectRoot, 'node_modules');
  // `mklink /D` requires admin privilege in Windows so we need to use junction
  const symlinkType = platform() === 'win32' ? 'junction' : 'dir';

  if (existsSync(appNodeModulesPath)) {
    removeSync(appNodeModulesPath);
  }
  symlinkSync(worksapceNodeModulesPath, appNodeModulesPath, symlinkType);
}

const nxVersion = '16.2.2';

function normalizeOptions(host: Tree, options: SolidityGeneratorSchema) {
  const { layoutDirectory, projectDirectory } = extractLayoutDirectory(
    options.directory
  );
  const appsDir = layoutDirectory ?? getWorkspaceLayout(host).appsDir;

  const appDirectory = projectDirectory
    ? `${names(projectDirectory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const appProjectRoot = options.rootProject
    ? '.'
    : joinPathFragments(appsDir, appDirectory);


  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    name: names(appProjectName).fileName,
    appProjectRoot,
    // parsedTags,
    // linter: options.linter ?? Linter.EsLint,
    // rootProject: options.rootProject ?? false,
  };
}

export function runSymlink(
  workspaceRoot: string,
  projectRoot: string
): GeneratorCallback {
  return () => {
    logger.info(`creating symlinks for ${projectRoot}`);
    try {
      ensureNodeModulesSymlink(workspaceRoot, projectRoot);
    } catch {
      throw new Error(
        `Failed to create symlinks for ${projectRoot}`
      );
    }
  };
}

export async function solidityGenerator(
  tree: Tree,
  options: SolidityGeneratorSchema
) {
  
  const tasks: GeneratorCallback[] = [];

  const { applicationGenerator } = ensurePackage(
    '@nx/node',
    nxVersion
  ) as typeof NxNode;

  await applicationGenerator(tree, {
    ...options,
    unitTestRunner: 'none',
    e2eTestRunner: 'none',
    babelJest: false,
    framework: 'none',
    docker: false,
    isNest: false,
  });

  const normalizedOptions = normalizeOptions(tree, options);

  const config = readProjectConfiguration(tree, options.name);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { build, serve, ...targets } = config.targets;
  updateProjectConfiguration(tree, options.name, {
    ...config,
    targets: {
      ...targets,
      test: {
        executor: 'solidity:test',
        options: {
          network: "polygon",
          hardhatConfig: joinPathFragments(normalizedOptions.appProjectRoot, 'hardhat.config.ts')
        }
      },
    },
  });

  generateFiles(
    tree,
    join(__dirname, './files'),
    normalizedOptions.appProjectRoot,
    {
      projectName: normalizedOptions.name,
      compiler: options.compiler,
      networks: options.network
    }
  );
  updateJson(tree, join(normalizedOptions.appProjectRoot, 'tsconfig.json'), (pkgJson) => {
    pkgJson.compilerOptions.module = "commonjs";
    return pkgJson;
  });

  
  if (options.js) {
    toJS(tree);
  }
  
  if (options.pascalCaseFiles) {
    logger.warn('NOTE: --pascalCaseFiles is a noop');
  }

  tasks.push(runSymlink(tree.root, normalizedOptions.appProjectRoot));
  

  return runTasksInSerial(...tasks);

}


export default solidityGenerator;