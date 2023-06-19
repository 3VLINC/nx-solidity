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
    logger.info(`creating symlinks for ${chalk.bold(projectRoot)}`);
    try {
      ensureNodeModulesSymlink(workspaceRoot, projectRoot);
    } catch {
      throw new Error(
        `Failed to create symlinks for ${chalk.bold(projectRoot)}`
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

  tasks.push(addDependenciesToPackageJson(tree, {
    
  }, {
    "@nomicfoundation/hardhat-toolbox": "^3.0.0",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.0",
    "@nomicfoundation/hardhat-chai-matchers": "^2.0.0",
    "@nomicfoundation/hardhat-ethers": "^3.0.0",
    "@nomicfoundation/hardhat-verify": "^1.0.0",
    "@nomiclabs/hardhat-web3": "^2.0.0",
    "@typechain/ethers-v6": "^0.4.0",
    "@typechain/hardhat": "^8.0.0",
    "@types/chai": "^4.2.0",
    "@types/mocha": ">=9.1.0",
    "@types/node": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "4.29.2",
    "@typescript-eslint/parser": "4.29.2",
    "chai": "^4.2.0",
    "ethers": "^6.4.0",
    "hardhat": "^2.11.0",
    "hardhat-gas-reporter": "^1.0.8",
    "mocha": "^10.0.0",
    "prettier": "2.4.1",
    "rimraf": "^3.0.2",
    "solidity-coverage": "^0.8.1",
    "ts-node": "^10.8.0",
    "typechain": "^8.2.0"
  }));
  

  return runTasksInSerial(...tasks);

}


export default solidityGenerator;