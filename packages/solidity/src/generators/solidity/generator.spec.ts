import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { solidityGenerator } from './generator';
import { SolidityGeneratorSchema } from './schema';

describe('solidity generator', () => {
  let tree: Tree;
  const options: SolidityGeneratorSchema = { compiler: '0.81' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await solidityGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
