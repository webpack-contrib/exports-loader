/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
import { getOptions, interpolateName } from 'loader-utils';
import { SourceMapConsumer, SourceNode } from 'source-map';
import validateOptions from 'schema-utils';

import schema from './options.json';

const FOOTER = '/*** EXPORTS FROM exports-loader ***/\n';

export default function loader(content, sourceMap) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Exports Loader',
    baseDataPath: 'options',
  });

  const callback = this.async();
  const type = options.type || 'module-named';
  const code = [];

  // eslint-disable-next-line default-case
  switch (type) {
    case 'commonjs-single':
      code.push(`module.exports = `);
      break;
    case 'commonjs-multiple':
      code.push(`module.exports = {`);
      break;
    case 'module-default':
      code.push(`export default`);
      break;
    case 'module-named':
      code.push(`export {`);
      break;
  }

  const exports =
    typeof options.exports === 'string'
      ? [{ name: options.exports }]
      : Array.isArray(options.exports)
      ? options.exports.map((item) => {
          if (typeof item === 'string') {
            return { name: item };
          }

          return item;
        })
      : [options.exports];

  if (
    (type === 'commonjs-single' || type === 'module-default') &&
    exports.filter((item) => item.alias).length > 0
  ) {
    callback(new Error(`The "${type}" exports type is not support aliases`));

    return;
  }

  const isCommonJs = type.startsWith('commonjs');

  exports.forEach((item, i) => {
    const needComma = i < exports.length - 1;
    const name = interpolateName(this, item.name, {});
    const alias = item.alias
      ? interpolateName(this, item.alias, {})
      : // eslint-disable-next-line no-undefined
        undefined;

    code.push(
      `${
        isCommonJs
          ? alias
            ? `  ${JSON.stringify(alias)}: (${name})`
            : `  ${name}`
          : `  ${name}${alias ? ` as ${alias}` : ''}`
      }${needComma ? ',' : ''}`
    );
  });

  // eslint-disable-next-line default-case
  switch (type) {
    case 'commonjs-single':
    case 'module-default':
      code.push(`;`);
      break;
    case 'commonjs-multiple':
    case 'module-named':
      code.push(`};`);
      break;
  }

  if (sourceMap) {
    const node = SourceNode.fromStringWithSourceMap(
      content,
      new SourceMapConsumer(sourceMap)
    );

    node.add(`\n\n${FOOTER}${code.join('\n')}`);

    const result = node.toStringWithSourceMap({ file: this.resourcePath });

    callback(null, result.code, result.map.toJSON());

    return;
  }

  callback(null, `${content}\n\n${FOOTER}${code.join('\n')}`, sourceMap);
}
