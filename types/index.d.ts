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
export default function loader<T>(
  this: import("webpack").LoaderContext<LoaderOptions<T>>,
  content: string,
  sourceMap: RawSourceMap
): void;
export type RawSourceMap = import("source-map").RawSourceMap;
export type Schema = import("schema-utils/declarations/validate").Schema;
/**
 * <T>Allows to choose how errors are displayed.
 */
export type LoaderOptions<T> = {
  type?: "module" | "commonjs" | undefined;
  exports: string | object | string[] | object[];
};
