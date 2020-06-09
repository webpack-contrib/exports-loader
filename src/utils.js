import { interpolateName } from 'loader-utils';

function getExportsList(list) {
  if (typeof list === 'string') {
    return [{ name: list }];
  }

  if (Array.isArray(list)) {
    return list.map((item) => {
      if (typeof item === 'string') {
        return { name: item };
      }

      return item;
    });
  }

  return [list];
}

function getExports(moduleType, exports) {
  let result = [];

  const isCommonJs = moduleType === 'commonjs';
  const defaultExportType = isCommonJs ? 'multiple' : 'named';

  if (typeof exports === 'string') {
    result.push({
      type: defaultExportType,
      list: getExportsList(exports),
    });
  } else if (Array.isArray(exports)) {
    result = [].concat(exports).map((item) => {
      if (typeof item === 'string') {
        return {
          type: defaultExportType,
          list: getExportsList(item),
        };
      }

      // TODO
      return {
        type: defaultExportType,
        ...item,
      };
    });
  } else {
    result.push({
      type: defaultExportType,
      ...exports,
      list: getExportsList(exports.list),
    });
  }

  for (const item of result) {
    if (
      (moduleType === 'commonjs' &&
        !['single', 'multiple'].includes(item.type)) ||
      (moduleType === 'module' && !['default', 'named'].includes(item.type))
    ) {
      throw new Error(
        `The "${moduleType}" format can't be used with "${item.type}" export type`
      );
    }

    if (
      (item.type === 'single' || item.type === 'default') &&
      item.list.length > 1
    ) {
      throw new Error(
        `The "${moduleType}" format can't be used with "${item.type}" export type and multiple export list`
      );
    }
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
