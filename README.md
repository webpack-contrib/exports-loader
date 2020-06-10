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

```js
import myFunction from 'exports-loader?exports=default%20myFunction!./file.js';
// `%20` is space in a query string, equivalently `default myFunction`
// Adds the following code to the file's source:
//
// exports default myFunction;

myFunction('Hello world');
```

```js
import { myFunctionAlias } from 'exports-loader?exports=named%20myFunction%20myFunctionAlias!./file.js';
// `%20` is space in a query string, equivalently `named myFunction myFunctionAlias`
// Adds the following code to the file's source:
//
// exports default myFunction;

myFunctionAlias('Hello world');
```

Description of string values can be found in the documentation below.

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

|           Name           |       Type        |   Default   | Description                 |
| :----------------------: | :---------------: | :---------: | :-------------------------- |
|   **[`type`](#type)**    |    `{String}`     |  `module`   | Format of generated exports |
| **[`exports`](#import)** | `{String\|Array}` | `undefined` | List of exports             |

### `type`

Type: `String`
Default: `module`

Format of generated exports.

Possible values - `commonjs` and `module` (ES modules syntax).

#### `commonjs`

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

#### `module`

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

Type: `String|Array`
Default: `undefined`

List of exports.

String values let you specify export syntax, name, and alias.

Examples:

- `[Foo]` - generates ES module named exports and exports `Foo` value.
- `[default Foo]` - generates ES module default export and exports `Foo` value.
- `[named Foo FooA]` - generates ES module named exports and exports `Foo` value under `FooA` name.
- `[single Foo]` - generates CommonJS single export and exports `Foo` value.
- `[multiple Foo FooA]` - generates CommonJS multiple exports and exports `Foo` value under `FooA` name.
- `[[name]]` - generates ES module named exports and exports a variable equal to the filename, for `single.js` it will be `single`.
- `[named [name] [name]A]` - generates ES module named exports and exports a value equal to the filename under other name., for `single.js` it will be `single` and `singleA`

> ⚠ You need to set `type: "commonjs"` to use `single` or `multiple` syntax.

> ⚠ Aliases can't be used together with `default` or `single` syntax.

String syntax - `[[syntax] [name] [alias]]`, where:

- `[syntax]` can be `default` or `named` for the `module` type (`ES modules` module format), and `single` or `multiple` for the `commonjs` type (`CommonJS` module format)
- `[name]` - name of exported value
- `[alias]` - alias of exported value

Examples:

- ES module default exports.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: 'default Foo',
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
```

- ES module named exports.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: 'named Foo FooA',
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

export { Foo as FooA };
```

- CommonJS single export.

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
          exports: 'single Foo',
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

module.exports = Foo;
```

- CommonJS multiple exports.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: 'multiple Foo FooA',
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

module.exports = { FooA: Foo };
```

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
          exports: 'default Foo',
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
```

#### `Array`

Allow to specify multiple exports.

> ⚠ Not possible to use `single` and `multiple` syntaxes together due to CommonJS format limitations.

> ⚠ Not possible to use multiple `default` syntaxes due to ES module format limitations.

> ⚠ Not possible to use multiple `single` syntaxes due to CommonJS format limitations.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: ['Foo', 'named Bar BarA'],
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

export { Foo, Bar as BarA };
```

Examples:

- Multiple CommonJS exports

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
          exports: ['Foo', 'multiple Baz BazA'],
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

module.exports = { Foo, Bar, BazA: Bar };
```

- ES module default export and named exports together.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./path/to/vendor.js'),
        loader: 'exports-loader',
        options: {
          exports: ['default Foo', 'named Bar BarA'],
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
export { Bar as BarA };
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
