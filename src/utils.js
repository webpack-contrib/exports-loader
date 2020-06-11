import { interpolateName } from 'loader-utils';

function resolveExports(type, item) {
  let result;

  if (typeof item === 'string') {
    const noWhitespaceItem = item.trim();

    if (noWhitespaceItem.length === 0) {
      throw new Error(`Invalid "${item}" value for export`);
    }

    const splittedItem = noWhitespaceItem.split(' ');

    if (splittedItem.length > 3) {
      throw new Error(`Invalid "${item}" value for export`);
    }

    if (splittedItem.length === 1) {
      result = {
        syntax: type === 'module' ? 'named' : 'multiple',
        name: splittedItem[0],
        // eslint-disable-next-line no-undefined
        alias: undefined,
      };
    } else {
      result = {
        syntax: splittedItem[0],
        name: splittedItem[1],
        alias:
          // eslint-disable-next-line no-undefined
          typeof splittedItem[2] !== 'undefined' ? splittedItem[2] : undefined,
      };
    }
  } else {
    result = { syntax: type === 'module' ? 'named' : 'multiple', ...item };
  }

  if (!['default', 'named', 'single', 'multiple'].includes(result.syntax)) {
    throw new Error(
      `Unknown "${result.syntax}" syntax export in "${item}" value`
    );
  }

  if (
    ['default', 'single'].includes(result.syntax) &&
    typeof result.alias !== 'undefined'
  ) {
    throw new Error(
      `The "${result.syntax}" syntax can't have "${result.alias}" alias in "${item}" value`
    );
  }

  if (type === 'commonjs') {
    if (result.syntax === 'default' || result.syntax === 'named') {
      throw new Error(
        `The "${type}" format can't be used with the "${result.syntax}" syntax export in "${item}" value`
      );
    }
  }

  if (type === 'module') {
    if (result.syntax === 'single' || result.syntax === 'multiple') {
      throw new Error(
        `The "${type}" format can't be used with the "${result.syntax}" syntax export in "${item}" value`
      );
    }
  }

  return result;
}

function getExports(type, exports) {
  let result;

  if (Array.isArray(exports)) {
    result = exports.map((item) => resolveExports(type, item));
  } else {
    result = [resolveExports(type, exports)];
  }

  const hasMultipleDefault = result.filter(
    ({ syntax }) => syntax === 'default' || syntax === 'single'
  );

  if (hasMultipleDefault.length > 1) {
    throw new Error(
      `The "${type}" format can't have multiple "${
        type === 'module' ? 'default' : 'single'
      }" exports`
    );
  }

  return result;
}

function renderExports(loaderContext, type, exports) {
  let code = '';

  const defaultExport = exports.filter(
    ({ syntax }) => syntax === 'default' || syntax === 'single'
  );
  const namedExports = exports.filter(
    ({ syntax }) => syntax === 'named' || syntax === 'multiple'
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
