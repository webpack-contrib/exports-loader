import { interpolateName } from 'loader-utils';

function resolveExports(type, item) {
  const splittedItem = item.split(' ');

  if (splittedItem.length === 0) {
    throw new Error(`Invalid "${item}" for export`);
  }

  if (splittedItem.length === 1) {
    return {
      syntax: type === 'module' ? 'named' : 'multiple',
      name: splittedItem[0],
      // eslint-disable-next-line no-undefined
      alias: undefined,
    };
  }

  return {
    syntax: splittedItem[0],
    name: splittedItem[1],
    // eslint-disable-next-line no-undefined
    alias: splittedItem[2] ? splittedItem[2] : undefined,
  };
}

function getExports(type, exports) {
  let result = [];

  if (typeof exports === 'string') {
    result.push(resolveExports(type, exports));
  } else if (Array.isArray(exports)) {
    result = [].concat(exports).map((item) => resolveExports(type, item));
  }

  // TODO validation
  // TODO union

  return result;
}

function renderExports(loaderContext, type, item) {
  let code = '';

  const exportType = `${type}-${item.syntax}`;

  // eslint-disable-next-line default-case
  switch (exportType) {
    case 'commonjs-single':
      code += 'module.exports = ';
      break;
    case 'commonjs-multiple':
      code += 'module.exports = {\n';
      break;
    case 'module-default':
      code += 'export default ';
      break;
    case 'module-named':
      code += 'export {\n';
      break;
  }

  const isCommonJs = type === 'commonjs';
  const isSingleExport = item.syntax === 'single' || item.syntax === 'default';

  const name = interpolateName(loaderContext, item.name, {});
  const alias = item.alias
    ? interpolateName(loaderContext, item.alias, {})
    : // eslint-disable-next-line no-undefined
      undefined;

  code += `${isSingleExport ? '' : '  '}${
    isCommonJs
      ? alias
        ? `${JSON.stringify(alias)}: (${name})`
        : `${name}`
      : `${name}${alias ? ` as ${alias}` : ''}`
  }`;

  // eslint-disable-next-line default-case
  switch (exportType) {
    case 'commonjs-single':
    case 'module-default':
      code += ';';
      break;
    case 'commonjs-multiple':
    case 'module-named':
      code += '\n};';
      break;
  }

  return code;
}

export { getExports, renderExports };
