import { getCompiler, compile } from './helpers';

describe('validate options', () => {
  const tests = {
    type: {
      success: ['commonjs', 'module'],
      failure: [true, false, 'foo'],
    },
    exports: {
      // success: [
      //   // module.exports = Foo;
      //   // export default Foo;
      //   'Foo',
      //   {
      //     name: 'Foo',
      //   },
      //   // module.exports = { Foo, Bar };
      //   // export { Foo, Bar };
      //   ['Foo', 'Bar'],
      //   [
      //     {
      //       name: 'Foo',
      //     },
      //     {
      //       name: 'Bar',
      //     },
      //   ],
      //   [
      //     {
      //       name: 'Foo',
      //     },
      //     'Bar',
      //   ],
      //   // export { Foo as Foo1, Bar as Bar1 };
      //   [
      //     {
      //       name: 'Foo',
      //       alias: 'Foo1',
      //     },
      //     {
      //       name: 'Bar',
      //       alias: 'Bar1',
      //     },
      //   ],
      //   // export { Foo as default, Bar };
      //   [
      //     {
      //       name: 'Foo',
      //       alias: 'default',
      //     },
      //     'Bar',
      //   ],
      //   // Should we support it?
      //   // export const { Foo, Bar: Baz } = o;
      // ],
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
      const compiler = getCompiler(
        'simple.js',
        key !== 'exports' ? { [key]: value, exports: 'Foo' } : { [key]: value }
      );

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
