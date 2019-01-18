<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]

# exports-loader

exports loader module for webpack

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `exports-loader`:

```console
$ npm install exports-loader --save-dev
```

Then add the loader to the desired `require` calls. For example:

```js
require('exports-loader?run,parse=helpers.parse!./file.js');
// adds the following code to the file's source:
//  exports['run'] = run;
//  exports['parse'] = helpers.parse;

require('exports-loader?run!./file.js');
// adds the following code to the file's source:
//  module.exports = run;

require('exports-loader?[name]!./file.js');
// adds the following code to the file's source:
//  module.exports = file;
```

And run `webpack` via your preferred method.

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

#### [CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

#### [MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/exports-loader.svg
[npm-url]: https://npmjs.com/package/exports-loader

[node]: https://img.shields.io/node/v/exports-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/exports-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/exports-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/exports-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/exports-loader

[cover]: https://codecov.io/gh/webpack-contrib/exports-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/exports-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
