/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
import { SourceMapConsumer, SourceNode } from "source-map";

import schema from "./options.json";
import { getExports, renderExports } from "./utils";

const FOOTER = "/*** EXPORTS FROM exports-loader ***/\n";

/** @typedef {import("source-map").RawSourceMap} RawSourceMap */
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */

/**
 * @template T
 * @typedef {Object} LoaderOptions<T>Allows to choose how errors are displayed.
 * @property {"commonjs" | "module"} [type]
 * @property {string| object | string[] | object[]} exports
 */

/**
 * The exports loader allows to setup exports
 * @template T
 * @this {import("webpack").LoaderContext<LoaderOptions<T>>}
 * @param {string} content
 * @param { RawSourceMap } sourceMap
 */

export default function loader(content, sourceMap) {
  const options = this.getOptions(/** @type {Schema} */ (schema));
  const type = options.type || "module";
  const callback = this.async();

  let exports;

  try {
    exports = getExports(type, options.exports);
  } catch (error) {
    callback(/** @type {Error | null | undefined} */ (error));

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

    // @ts-ignore map only has toString() method in types
    callback(null, result.code, result.map.toJSON());

    return;
  }

  // @ts-ignore sourceMap in the webpack doesn't have the type RawSourceMap
  callback(null, `${content}\n${FOOTER}${exportsCode}`, sourceMap);
}
