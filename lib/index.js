/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const loaderUtils = require('loader-utils');
const { SourceNode } = require('source-map');
const { SourceMapConsumer } = require('source-map');

const FOOTER = '/*** EXPORTS FROM exports-loader ***/\n';

module.exports = function loader(content, sourceMap) {
  if (this.cacheable) this.cacheable();
  const query = loaderUtils.getOptions(this) || {};
  const exports = [];
  const keys = Object.keys(query);

  // apply name interpolation i.e. substitute strings like [name] or [ext]
  for (let i = 0; i < keys.length; i++) {
    keys[i] = loaderUtils.interpolateName(this, keys[i], {});
  }

  if (keys.length === 1 && typeof query[keys[0]] === 'boolean') {
    exports.push(`module.exports = ${keys[0]};`);
  } else {
    keys.forEach((name) => {
      let mod = name;
      if (typeof query[name] === 'string') {
        mod = query[name];
      }
      exports.push(`exports[${JSON.stringify(name)}] = (${mod});`);
    });
  }

  if (sourceMap) {
    const currentRequest = loaderUtils.getCurrentRequest(this);
    const node = SourceNode.fromStringWithSourceMap(
      content,
      new SourceMapConsumer(sourceMap)
    );
    node.add(`\n\n${FOOTER}${exports.join('\n')}`);
    const result = node.toStringWithSourceMap({
      file: currentRequest,
    });
    this.callback(null, result.code, result.map.toJSON());
    return;
  }

  // eslint-disable-next-line consistent-return
  return `${content}\n\n${FOOTER}${exports.join('\n')}`;
};
