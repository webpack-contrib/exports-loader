<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# exports-loader

Allow to setup custom exports `module.exports`/`export` for modules.

> ⚠ Be careful, existing exports (`export`/`module.exports`/`exports`) can break the source code or be overwritten.
> ⚠ By default loader generate ES module named syntax.

## Getting Started

To begin, you'll need to install `exports-loader`:

```console
$ npm install exports-loader --save-dev
```

### Inline

Then add the loader to the desired `require` calls. For example:

```js
const { myFunction } = require('exports-loader?exports=myFunction!./file.js');
// Adds the following code to the file's source:
//
// export { myFunction }

myFunction('Hello world');
```

```js
const {
  myVariable,
  myFunction,
} = require('exports-loader?exports[]=myVariable&exports[]=myFunction!./file.js');
// Adds the following code to the file's source:
//
// export { myVariable, myFunction };

const newVariable = myVariable + '!!!';

console.log(newVariable);

myFunction('Hello world');
```

```js
const { file } = require('exports-loader?[name]!./file.js');
// Adds the following code to the file's source:
//
// export { file };

file('string');
```

```js
const {
  myFunction,
} = require('exports-loader?type=commonjs&exports=myFunction!./file.js');
// Adds the following code to the file's source:
//
// module.exports = { myFunction }

myFunction('Hello world');
```

### Using Configuration

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        // You can use `regexp`
        // test: /vendor\.js/$
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: 'myFunction',
        },
      },
    ],
  },
};
```

And run `webpack` via your preferred method.

## Options

|           Name           |           Type            |   Default   | Description                 |
| :----------------------: | :-----------------------: | :---------: | :-------------------------- |
|   **[`type`](#type)**    |        `{String}`         |  `module`   | Format of generated exports |
| **[`exports`](#import)** | `{String\|Object\|Array}` | `undefined` | List of exported values     |

### `type`

Type: `String`
Default: `module`

Format of generated exports.

Possible values - `commonjs` and `module` (ES modules syntax).

#### `CommonJS`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          type: 'commonjs',
          exports: 'Foo',
        },
      },
    ],
  },
};
```

Generate output:

```js
// ...
// Code
// ...

module.exports = { Foo };
```

#### `Module`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          type: 'module',
          exports: 'Foo',
        },
      },
    ],
  },
};
```

Generate output:

```js
// ...
// Code
// ...

export { Foo };
```

### `exports`

Type: `String|Object|Array`
Default: `undefined`

List of exported values.

#### `String`

Allow to specify exported value.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: 'Foo',
        },
      },
    ],
  },
};
```

Generate output:

- When the **[`type`](#type)** option is `module`

```js
// ...
// Code
// ...

export { Foo };
```

- When the **[`type`](#type)** option is `commonjs`

```js
// ...
// Code
// ...

module.exports = { Foo };
```

#### `Object`

Allow to specify exported value and setup aliases.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: {
            syntax: 'named',
            list: [
              {
                name: 'Foo',
                alias: 'FooAlias',
              },
            ],
          },
        },
      },
    ],
  },
};
```

Generate output:

- When the **[`type`](#type)** option is `commonjs`

```js
// ...
// Code
// ...

module.exports = { FooAlias: Foo };
```

- When the **[`type`](#type)** option is `module`

```js
// ...
// Code
// ...

export { Foo as FooAlias };
```

You can generate `default` export for a single `export` statement:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: {
            syntax: 'named',
            list: [
              {
                name: 'Foo',
                alias: 'default',
              },
              {
                name: 'Bar',
              },
            ],
          },
        },
      },
    ],
  },
};
```

Generate output:

```js
// ...
// Code
// ...

export { Foo as default, Bar };
```

#### `Array`

Allow to specify multiple exported values and setup aliases.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: [
            {
              syntax: 'default',
              list: 'Foo',
            },
            {
              list: [
                'Bar',
                {
                  name: 'Baz',
                  alias: 'myBaz',
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
```

Generate output:

```js
// ...
// Code
// ...

export default Foo;
export { Bar, Baz as myBaz };
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/exports-loader.svg
[npm-url]: https://npmjs.com/package/exports-loader
[node]: https://img.shields.io/node/v/exports-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/exports-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/exports-loader
[tests]: https://github.com/webpack-contrib/exports-loader/workflows/exports-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/exports-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/exports-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/exports-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=exports-loader
