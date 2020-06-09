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

  const isModule = moduleType === 'module';
  const defaultExportSyntax = isModule ? 'named' : 'multiple';

  if (typeof exports === 'string') {
    result.push({
      syntax: defaultExportSyntax,
      list: getExportsList(exports),
    });
  } else if (Array.isArray(exports)) {
    result = [].concat(exports).map((item) => {
      if (typeof item === 'string') {
        return {
          syntax: defaultExportSyntax,
          list: getExportsList(item),
        };
      }

      return {
        syntax: defaultExportSyntax,
        ...item,
        list: getExportsList(item.list),
      };
    });
  } else {
    result.push({
      syntax: defaultExportSyntax,
      ...exports,
      list: getExportsList(exports.list),
    });
  }

  for (const item of result) {
    if (
      (moduleType === 'commonjs' &&
        !['single', 'multiple'].includes(item.syntax)) ||
      (moduleType === 'module' && !['default', 'named'].includes(item.syntax))
    ) {
      throw new Error(
        `The "${moduleType}" format can't be used with the "${item.syntax}" syntax`
      );
    }

    if (
      (item.syntax === 'single' || item.syntax === 'default') &&
      item.list.length > 1
    ) {
      throw new Error(
        `The "${moduleType}" format can't be used with the "${item.syntax}" syntax and multiple export list`
      );
    }
  }

  // TODO union

  return result;
}

function renderExports(loaderContext, moduleType, exports) {
  let code = '';

  const exportSyntax = exports.syntax;
  const type = `${moduleType}-${exportSyntax}`;

  // eslint-disable-next-line default-case
  switch (type) {
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

  const { list } = exports;
  const isCommonJs = moduleType === 'commonjs';
  const isSingleExport =
    exportSyntax === 'single' || exportSyntax === 'default';

  list.forEach((item, i) => {
    const needComma = i < list.length - 1;
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
    }${needComma ? ',\n' : ''}`;
  });

  // eslint-disable-next-line default-case
  switch (type) {
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
