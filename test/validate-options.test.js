import { getCompiler, compile } from './helpers';

describe('validate options', () => {
  const tests = {
    type: {
      success: ['commonjs', 'module'],
      failure: [true, false, 'foo'],
    },
    exports: {
      success: [
        'Foo',
        'default Foo',
        'named Foo',
        'named Foo FooA',
        ['named Foo', 'named Bar'],
        ['named Foo FooA', 'named Bar BarA'],
        ['default Foo', 'named Bar BarA'],
        'single Foo',
        'multiple Foo',
        'multiple Foo FooA',
        ['multiple Foo', 'multiple Bar'],
        ['multiple Foo FooA', 'multiple Bar BarA'],
      ],
      failure: [true, () => {}, [1, 2, 3]],
    },
  };

  function stringifyValue(value) {
    if (
      Array.isArray(value) ||
      (value && typeof value === 'object' && value.constructor === Object)
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  async function createTestCase(key, value, type) {
    it(`should ${
      type === 'success' ? 'successfully validate' : 'throw an error on'
    } the "${key}" option with "${stringifyValue(value)}" value`, async () => {
      // eslint-disable-next-line no-shadow
      const getOptions = (key, value) => {
        if (key === 'type') {
          return { [key]: value, exports: 'Foo' };
        }

        if (
          key === 'exports' &&
          (typeof value === 'string' ||
            (Array.isArray(value) &&
              value.filter((item) => typeof item !== 'string').length === 0))
        ) {
          // eslint-disable-next-line no-shadow
          const type = Array.isArray(value)
            ? value.filter(
                (item) => item.includes('single') || item.includes('multiple')
              ).length > 0
              ? 'commonjs'
              : 'module'
            : value.includes('single') || value.includes('multiple')
            ? 'commonjs'
            : 'module';

          return { type, [key]: value };
        }

        return { [key]: value };
      };

      const compiler = getCompiler('simple.js', getOptions(key, value));

      let stats;

      try {
        stats = await compile(compiler);
      } finally {
        if (type === 'success') {
          expect(stats.hasErrors()).toBe(false);
        } else if (type === 'failure') {
          const {
            compilation: { errors },
          } = stats;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
        }
      }
    });
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values)) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
