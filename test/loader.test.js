import path from 'path';

import {
  compile,
  execute,
  getCompiler,
  getErrors,
  getModuleSource,
  getWarnings,
  readAsset,
} from './helpers';

describe('loader', () => {
  it('should work with string value', async () => {
    const compiler = getCompiler('simple.js', {
      exports: 'Foo',
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with multiple string values', async () => {
    const compiler = getCompiler('simple.js', {
      exports: ['Foo', 'Bar'],
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with inline syntax', async () => {
    // eslint-disable-next-line no-undefined
    const compiler = getCompiler('inline.js', {}, { module: undefined });
    const stats = await compile(compiler);

    expect(getModuleSource('./inline.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with source maps when the "devtool" option is enabled', async () => {
    const compiler = getCompiler(
      'simple.js',
      {},
      {
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, '../src'),
                  options: { exports: 'Foo' },
                },
                {
                  loader: 'babel-loader',
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should not work with source maps when the "devtool" options are disabled', async () => {
    const compiler = getCompiler(
      'simple.js',
      {},
      {
        devtool: false,
        module: {
          rules: [
            {
              test: /\.js$/i,
              rules: [
                {
                  loader: path.resolve(__dirname, '../src'),
                  options: { exports: 'Foo' },
                },
                {
                  loader: 'babel-loader',
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  function createSuccessCase(type, exports) {
    it(`should work with the "${type}" module format for ${JSON.stringify(
      exports
    )} export list`, async () => {
      const compiler = getCompiler('simple.js', { type, exports });
      const stats = await compile(compiler);

      expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
      expect(
        execute(readAsset('main.bundle.js', compiler, stats))
      ).toMatchSnapshot('result');
      expect(getErrors(stats)).toMatchSnapshot('errors');
      expect(getWarnings(stats)).toMatchSnapshot('warnings');
    });
  }

  function createFailedCase(type, exports) {
    it(`should work with the "${type}" module format for ${JSON.stringify(
      exports
    )} export list`, async () => {
      const compiler = getCompiler('simple.js', { type, exports });
      const stats = await compile(compiler);

      expect(getErrors(stats)).toMatchSnapshot('errors');
      expect(getWarnings(stats)).toMatchSnapshot('warnings');
    });
  }

  createSuccessCase('commonjs', 'Foo');
  createSuccessCase('commonjs', '[name]');
  createFailedCase('commonjs', 'default');
  createFailedCase('commonjs', 'default Foo');
  createFailedCase('commonjs', 'named Foo');
  createSuccessCase('commonjs', 'single Foo');
  createSuccessCase('commonjs', 'single [name]');
  createSuccessCase('commonjs', 'single single');
  createFailedCase('commonjs', 'single Foo FooA');
  createSuccessCase('commonjs', 'multiple Foo');
  createSuccessCase('commonjs', 'multiple [name]');
  createSuccessCase('commonjs', 'multiple Foo FooA');
  createSuccessCase('commonjs', 'multiple Foo Foo-Bar');
  createSuccessCase('commonjs', 'multiple [name] FooA');
  createSuccessCase('commonjs', 'multiple [name] [name]A');
  createSuccessCase('commonjs', ['Foo', 'Bar']);
  createSuccessCase('commonjs', ['multiple Foo', 'multiple Bar']);
  createSuccessCase('commonjs', ['multiple Foo FooA', 'multiple Bar BarA']);
  createSuccessCase('commonjs', [
    'multiple myVariable.myFunction myFunction',
    'multiple Bar BarA',
  ]);
  createFailedCase('commonjs', 'multiple Foo FooA FooB');
  createFailedCase('commonjs', ['single Foo', 'single Bar']);
  createFailedCase('commonjs', 'unknown Foo');
  createFailedCase('commonjs', '`invalid`');

  createSuccessCase('module', 'Foo');
  createSuccessCase('module', '[name]');
  createFailedCase('module', 'default');
  createFailedCase('module', 'single Foo');
  createFailedCase('module', 'multiple Foo');
  createSuccessCase('module', 'default Foo');
  createSuccessCase('module', 'default [name]');
  createFailedCase('module', 'default default');
  createFailedCase('module', 'default Foo FooA');
  createSuccessCase('module', 'named Foo');
  createSuccessCase('module', 'named [name]');
  createSuccessCase('module', 'named Foo FooA');
  createSuccessCase('module', 'named [name] FooA');
  createSuccessCase('module', 'named [name] [name]A');
  createSuccessCase('module', ['Foo', 'Bar']);
  createSuccessCase('module', ['named Foo', 'named Bar']);
  createSuccessCase('module', ['named Foo FooA', 'named Bar BarA']);
  createSuccessCase('module', ['named Foo default', 'named Bar BarA']);
  createSuccessCase('module', ['default Foo', 'named Bar']);
  createSuccessCase('module', ['default Foo', 'named Bar BarA']);
  createSuccessCase('module', ['default Foo', 'named Bar BarA', 'named Baz']);
  createFailedCase('module', 'named Foo FooA FooB');
  createFailedCase('module', ['default Foo', 'default Bar']);
  createFailedCase('module', 'unknown Foo');
  createFailedCase('module', '`invalid`');
});
