import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { hardhatGenerator } from './generator';
import { HardhatGeneratorSchema } from './schema';

describe('hardhat generator', () => {
  let tree: Tree;
  const options: HardhatGeneratorSchema = { compiler: '0.81' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await hardhatGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
