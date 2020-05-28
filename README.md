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

## Getting Started

To begin, you'll need to install `exports-loader`:

```console
$ npm install exports-loader --save-dev
```

Then add the loader to the desired `require` calls. For example:

```js
const { myFunction } = require('exports-loader?myFunction!./file.js');
// Adds the following code to the file's source:
//
// module.exports = exports = { 'myFunction': myFunction };

myFunction('Hello world');
```

```js
const {
  myFunction,
  myVariable,
} = require('exports-loader?myFunction,myVariable=helpers.parse!./file.js');
// Adds the following code to the file's source:
//
// module.exports = exports = { 'myFunction': myFunction, 'myVariable' : myVariable };

myFunction('Hello world');

const newVariable = myVariable + '!!!';

console.log(newVariable);
```

```js
const { file } = require('exports-loader?[name]!./file.js');
// Adds the following code to the file's source:
//
// module.exports = exports = { 'file' : file };

file('string');
```

And run `webpack` via your preferred method.

> ⚠ Be careful, existing exports (`module.exports`/`exports`) will be overwritten.

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
