/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
import { getOptions } from 'loader-utils';
import { validate } from 'schema-utils';
import { SourceMapConsumer, SourceNode } from 'source-map';

import schema from './options.json';
import { getExports, renderExports } from './utils';

const FOOTER = '/*** EXPORTS FROM exports-loader ***/\n';

export default function loader(content, sourceMap) {
  const options = getOptions(this);

  validate(schema, options, {
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

  const exportsCode = renderExports(this, type, exports);

  if (this.sourceMap && sourceMap) {
    const node = SourceNode.fromStringWithSourceMap(
      content,
      new SourceMapConsumer(sourceMap)
    );

    node.add(`\n${FOOTER}${exportsCode}`);

    const result = node.toStringWithSourceMap({ file: this.resourcePath });

    callback(null, result.code, result.map.toJSON());

    return;
  }

  callback(null, `${content}\n${FOOTER}${exportsCode}`, sourceMap);
}
