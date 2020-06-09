import { interpolateName } from 'loader-utils';

function getExports(type, exports) {
  let result = [];

  if (typeof exports === 'string') {
    result.push({ type: 'named', list: [{ name: exports }] });
  } else if (Array.isArray(exports)) {
    result = [].concat(exports).map((item) => {
      if (typeof item === 'string') {
        return { type: 'named', list: [{ name: item }] };
      }

      return item;
    });
  } else {
    result.push(
      typeof exports.list === 'string'
        ? { ...exports, list: [{ name: exports.list }] }
        : Array.isArray(exports.list)
        ? {
            ...exports,
            list: exports.list.map((item) => {
              if (typeof item === 'string') {
                return { name: item };
              }

              return item;
            }),
          }
        : exports
    );
  }

  // TODO union

  return result;
}

function renderExports(loaderContext, moduleType, exports) {
  const code = [];
  const exportType =
    typeof exports.type !== 'undefined'
      ? exports.type
      : moduleType === 'commonjs'
      ? 'multiple'
      : 'named';
  const type = `${moduleType}-${exportType}`;

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

  const { list } = exports;
  const isCommonJs = moduleType === 'commonjs';

  list.forEach((item, i) => {
    const needComma = i < list.length - 1;
    const name = interpolateName(loaderContext, item.name, {});
    const alias = item.alias
      ? interpolateName(loaderContext, item.alias, {})
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

  return code.join('\n');
}

export { getExports, renderExports };
