import { Schema } from '@nx/node';

export interface SolidityGeneratorSchema extends Pick<Schema, 'name' | 'skipFormat' | 'skipPackageJson' | 'directory' | 'linter' | 'tags' | 'js' | 'pascalCaseFiles' | 'setParserOptionsProject' | 'standaloneConfig' | 'rootProject'> {
  compiler: string;
  network: string[];
}
