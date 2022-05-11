export type RawSourceMap = import("source-map").RawSourceMap;
/**
 * <T>
 */
export type LoaderOptions<T> = {
  type?: string | undefined;
  exports?: string | object | string[] | object[] | undefined;
};
/**
 * The exports loader allows to setup exports
 */
export type LoaderOption<T> = import("webpack").LoaderContext<LoaderOptions<T>>;
export type Identifier = {
  type: string;
  value?: string | undefined;
};
export type Export = {
  syntax: string;
  name?: string | undefined;
  alias?: string | undefined;
};
/**
 *
 * @param {string} type
 * @param {string| object | string[] | object[]} exports
 * @returns
 */
export function getExports(
  type: string,
  exports: string | object | string[] | object[]
): Export[];
/**
 * @template T
 * @param {LoaderOption<T>} loaderContext
 * @param {"commonjs"|"module"} type
 * @param {Array<Export>} exports
 * @returns
 */
export function renderExports<T>(
  loaderContext: import("webpack").LoaderContext<LoaderOptions<T>>,
  type: "commonjs" | "module",
  exports: Array<Export>
): string;
