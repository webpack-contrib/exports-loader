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
  it('should work without options', async () => {
    const compiler = getCompiler('simple.js');
    const stats = await compile(compiler);

    expect(getModuleSource('./simple.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work', async () => {
    const compiler = getCompiler('simple.js', {
      CV: true,
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

  it('should work for single CommonJS export', async () => {
    const compiler = getCompiler('commonjs.js', {
      object: true,
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./commonjs.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work for single CommonJS export with source maps', async () => {
    const compiler = getCompiler(
      'commonjs.js',
      { object: true },
      { devtool: 'source-map' }
    );
    const stats = await compile(compiler);

    expect(getModuleSource('./commonjs.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work for multiple CommonJS exports', async () => {
    const compiler = getCompiler('commonjs.js', {
      object: true,
      otherObject: true,
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./commonjs.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work for multiple CommonJS exports with source maps', async () => {
    const compiler = getCompiler(
      'commonjs.js',
      {
        object: true,
        otherObject: true,
      },
      { devtool: 'source-map' }
    );
    const stats = await compile(compiler);

    expect(getModuleSource('./commonjs.js', stats)).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });
});
