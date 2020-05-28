/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
import loaderUtils from 'loader-utils';
import { SourceMapConsumer, SourceNode } from 'source-map';
import validateOptions from 'schema-utils';

import schema from './options.json';

const FOOTER = '/*** EXPORTS FROM exports-loader ***/\n';

export default function loader(content, sourceMap) {
  const options = loaderUtils.getOptions(this);

  validateOptions(schema, options, {
    name: 'Exports Loader',
    baseDataPath: 'options',
  });

  const callback = this.async();
  const keys = Object.keys(options);

  // Apply name interpolation i.e. substitute strings like [name] or [ext]
  for (let i = 0; i < keys.length; i++) {
    keys[i] = loaderUtils.interpolateName(this, keys[i], {});
  }

  const exports = [];

  exports.push(`module.exports = exports = {`);

  keys.forEach((name) => {
    let mod = name;

    if (typeof options[name] === 'string') {
      mod = options[name];
    }

    exports.push(`  ${JSON.stringify(name)}: (${mod}),`);
  });

  exports.push('};');

  if (sourceMap) {
    const node = SourceNode.fromStringWithSourceMap(
      content,
      new SourceMapConsumer(sourceMap)
    );

    node.add(`\n\n${FOOTER}${exports.join('\n')}`);

    const result = node.toStringWithSourceMap({ file: this.resourcePath });

    callback(null, result.code, result.map.toJSON());

    return;
  }

  // eslint-disable-next-line consistent-return
  return callback(
    null,
    `${content}\n\n${FOOTER}${exports.join('\n')}`,
    sourceMap
  );
}
