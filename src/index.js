/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
import { getOptions } from 'loader-utils';
import { SourceMapConsumer, SourceNode } from 'source-map';
import validateOptions from 'schema-utils';

import schema from './options.json';
import { getExports, renderExports } from './utils';

const FOOTER = '/*** EXPORTS FROM exports-loader ***/\n';

export default function loader(content, sourceMap) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Exports Loader',
    baseDataPath: 'options',
  });

  const type = options.type || 'module';
  const callback = this.async();

  let exports;

  try {
    exports = getExports(type, options.exports);
  } catch (error) {
    callback(error);

    return;
  }

  const exportsCode = exports.reduce((accumulator, item) => {
    return `${accumulator}${renderExports(this, type, item)}\n`;
  }, '');

  if (this.sourceMap && sourceMap) {
    const node = SourceNode.fromStringWithSourceMap(
      content,
      new SourceMapConsumer(sourceMap)
    );

    node.add(`\n\n${FOOTER}${exportsCode}`);

    const result = node.toStringWithSourceMap({ file: this.resourcePath });

    callback(null, result.code, result.map.toJSON());

    return;
  }

  callback(null, `${content}\n\n${FOOTER}${exportsCode}`, sourceMap);
}
