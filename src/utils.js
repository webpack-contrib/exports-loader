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
  } else {
    result = [].concat(exports).map((item) => resolveExports(type, item));
  }

  // TODO validation

  return result;
}

function renderExports(loaderContext, type, exports) {
  let code = '';

  const defaultExport = exports.filter(
    (item) => item.syntax === 'default' || item.syntax === 'single'
  );
  const namedExports = exports.filter(
    (item) => item.syntax === 'named' || item.syntax === 'multiple'
  );

  if (defaultExport.length > 0) {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'commonjs':
        code += 'module.exports = ';
        break;
      case 'module':
        code += 'export default ';
        break;
    }

    const name = interpolateName(loaderContext, defaultExport[0].name, {});

    code += `${name};\n`;
  }

  if (namedExports.length > 0) {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'commonjs':
        code += 'module.exports = {\n';
        break;
      case 'module':
        code += 'export {\n';
        break;
    }

    namedExports.forEach((namedExport, i) => {
      const needComma = i < namedExports.length - 1;
      const name = interpolateName(loaderContext, namedExport.name, {});
      const alias = namedExport.alias
        ? interpolateName(loaderContext, namedExport.alias, {})
        : // eslint-disable-next-line no-undefined
          undefined;

      code += `  ${
        type === 'commonjs'
          ? alias
            ? `${JSON.stringify(alias)}: (${name})`
            : `${name}`
          : `${name}${alias ? ` as ${alias}` : ''}`
      }${needComma ? ',\n' : ''}`;
    });

    code += '\n};\n';
  }

  return code;
}

export { getExports, renderExports };
