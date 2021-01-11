function forError(item) {
  return typeof item === 'string'
    ? item
    : `\n${JSON.stringify(item, null, ' ')}\n`;
}

function splitCommand(command) {
  const result = command
    .split('|')
    .map((item) => item.split(' '))
    .reduce((acc, val) => acc.concat(val), []);

  for (const item of result) {
    if (!item) {
      throw new Error(
        `Invalid command "${item}" in "${command}" for exports. There must be only one separator: " ", or "|"`
      );
    }
  }

  return result;
}

function resolveExports(type, item) {
  let result;

  if (typeof item === 'string') {
    const noWhitespaceItem = item.trim();

    if (noWhitespaceItem.length === 0) {
      throw new Error(`Invalid "${item}" value for export`);
    }

    const splittedItem = splitCommand(noWhitespaceItem);

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
      `Unknown "${result.syntax}" syntax export in "${forError(item)}" value`
    );
  }

  if (
    ['default', 'single'].includes(result.syntax) &&
    typeof result.alias !== 'undefined'
  ) {
    throw new Error(
      `The "${result.syntax}" syntax can't have "${
        result.alias
      }" alias in "${forError(item)}" value`
    );
  }

  if (type === 'commonjs') {
    if (result.syntax === 'default' || result.syntax === 'named') {
      throw new Error(
        `The "${type}" format can't be used with the "${
          result.syntax
        }" syntax export in "${forError(item)}" value`
      );
    }
  }

  if (type === 'module') {
    if (result.syntax === 'single' || result.syntax === 'multiple') {
      throw new Error(
        `The "${type}" format can't be used with the "${
          result.syntax
        }" syntax export in "${forError(item)}" value`
      );
    }
  }

  return result;
}

function getIdentifiers(array) {
  return array.reduce((accumulator, item) => {
    if (typeof item.alias !== 'undefined') {
      accumulator.push({ type: 'alias', value: item.alias });

      return accumulator;
    }

    accumulator.push({ type: 'name', value: item.name });

    return accumulator;
  }, []);
}

function getExports(type, exports) {
  let result;
  const exportItems =
    typeof exports === 'string' && exports.includes(',')
      ? exports.split(',')
      : exports;

  if (Array.isArray(exportItems)) {
    result = exportItems.map((item) => resolveExports(type, item));
  } else {
    result = [resolveExports(type, exportItems)];
  }

  const hasMultipleDefault = result.filter(
    ({ syntax }) => syntax === 'default' || syntax === 'single'
  );

  if (hasMultipleDefault.length > 1) {
    throw new Error(
      `The "${type}" format can't have multiple "${
        type === 'module' ? 'default' : 'single'
      }" exports in "\n${JSON.stringify(exports, null, ' ')}\n" value`
    );
  }

  const identifiers = getIdentifiers(result);
  const duplicates = duplicateBy(identifiers, 'value');

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate ${duplicates
        .map((identifier) => `"${identifier.value}" (as "${identifier.type}")`)
        .join(', ')} identifiers found in "\n${JSON.stringify(
        exports,
        null,
        ' '
      )}\n" value`
    );
  }

  return result;
}

function duplicateBy(array, key) {
  return array.filter(
    (a, aIndex) =>
      array.filter((b, bIndex) => b[key] === a[key] && aIndex !== bIndex)
        .length > 0
  );
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

    code += `${defaultExport[0].name};\n`;
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
      const { name } = namedExport;
      // eslint-disable-next-line no-undefined
      const alias = namedExport.alias || undefined;

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
