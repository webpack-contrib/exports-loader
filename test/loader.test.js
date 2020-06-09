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

  it('should work with object value', async () => {
    const compiler = getCompiler('simple.js', {
      exports: { list: [{ name: 'Foo' }] },
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with object value with multiple list values', async () => {
    const compiler = getCompiler('simple.js', {
      exports: { list: [{ name: 'Foo' }, { name: 'Bar' }] },
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with multiple object values', async () => {
    const compiler = getCompiler('simple.js', {
      exports: [{ list: [{ name: 'Foo' }] }, { list: [{ name: 'Bar' }] }],
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with object value when the "list" option is string', async () => {
    const compiler = getCompiler('simple.js', {
      exports: { list: 'Foo' },
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with object value when the "list" option is object', async () => {
    const compiler = getCompiler('simple.js', {
      exports: { list: { name: 'Foo' } },
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with object value when the "list" option is array of string', async () => {
    const compiler = getCompiler('simple.js', {
      exports: { list: ['Foo', 'Bar'] },
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with object value when the "list" option is array of strings and objects', async () => {
    const compiler = getCompiler('simple.js', {
      exports: { list: ['Foo', { name: 'Bar' }] },
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

  function createSuccessCase(moduleType, exportType, list) {
    it(`should work with the "${moduleType}" module format with the "${exportType}" exports type for ${JSON.stringify(
      list
    )} export list`, async () => {
      const compiler = getCompiler('simple.js', {
        type: moduleType,
        exports: {
          type: exportType,
          list,
        },
      });
      const stats = await compile(compiler);

      expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
      expect(
        execute(readAsset('main.bundle.js', compiler, stats))
      ).toMatchSnapshot('result');
      expect(getErrors(stats)).toMatchSnapshot('errors');
      expect(getWarnings(stats)).toMatchSnapshot('warnings');
    });
  }

  function createFailedCase(moduleType, exportType, list) {
    it(`should work with the "${moduleType}" module format with the "${exportType}" exports type for ${JSON.stringify(
      list
    )} export list`, async () => {
      const compiler = getCompiler('simple.js', {
        type: moduleType,
        exports: {
          type: exportType,
          list,
        },
      });
      const stats = await compile(compiler);

      expect(getErrors(stats)).toMatchSnapshot('errors');
      expect(getWarnings(stats)).toMatchSnapshot('warnings');
    });
  }

  createFailedCase('commonjs', 'default', 'Foo');
  createFailedCase('commonjs', 'named', 'Foo');
  createSuccessCase('commonjs', 'single', 'Foo');
  createSuccessCase('commonjs', 'single', { name: 'Foo' });
  createFailedCase('commonjs', 'single', ['Foo', 'Bar']);
  createSuccessCase('commonjs', 'multiple', 'Foo');
  createSuccessCase('commonjs', 'multiple', { name: 'Foo' });
  createSuccessCase('commonjs', 'multiple', ['Foo', 'Bar']);
  createSuccessCase('commonjs', 'multiple', [{ name: 'Foo' }, { name: 'Bar' }]);
  createSuccessCase('commonjs', 'multiple', ['Foo', { name: 'Bar' }]);
  createSuccessCase('commonjs', 'multiple', [{ name: 'Foo', alias: 'FooA' }]);
  createSuccessCase('commonjs', 'multiple', [
    { name: 'Foo', alias: 'FooA' },
    { name: 'Bar', alias: 'BarA' },
  ]);
  createSuccessCase('commonjs', 'multiple', [{ name: '[name]' }]);
  createSuccessCase('commonjs', 'multiple', [
    { name: '[name]', alias: '[name]A' },
  ]);

  createFailedCase('module', 'single', 'Foo');
  createFailedCase('module', 'multiple', 'Foo');
  createSuccessCase('module', 'default', 'Foo');
  createSuccessCase('module', 'default', { name: 'Foo' });
  createFailedCase('module', 'default', ['Foo', 'Bar']);
  createSuccessCase('module', 'named', 'Foo');
  createSuccessCase('module', 'named', { name: 'Foo' });
  createSuccessCase('module', 'named', ['Foo', 'Bar']);
  createSuccessCase('module', 'named', [{ name: 'Foo' }, { name: 'Bar' }]);
  createSuccessCase('module', 'named', ['Foo', { name: 'Bar' }]);
  createSuccessCase('module', 'named', [{ name: 'Foo', alias: 'FooA' }]);
  createSuccessCase('module', 'named', [
    { name: 'Foo', alias: 'FooA' },
    { name: 'Bar', alias: 'BarA' },
  ]);
  createSuccessCase('module', 'named', [
    { name: 'Foo', alias: 'default' },
    { name: 'Bar', alias: 'BarA' },
  ]);
  createSuccessCase('module', 'named', [{ name: '[name]' }]);
  createSuccessCase('module', 'named', [{ name: '[name]', alias: '[name]A' }]);
});
