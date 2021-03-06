import ts from "@wessberg/rollup-plugin-ts";
import pkg from "./package.json";
import { ScriptTarget } from "typescript";

const PRODUCTION = process.env.BUILD === "production";

function merge(...objects) {
  const result = {};
  for (const obj of objects) {
    for (const [key, val] of Object.entries(obj)) {
      if (typeof result[key] === "object" && typeof val === "object") {
        result[key] = merge(result[key], val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

function filterFalsy(array) {
  return array.filter(x => x);
}

const banner = `
/*!
 * RingMenu v${pkg.version}
 * (c) 2020 Vukašin Stepanović
 * Released under the MIT License.
 */
`;

export default async function() {
  const common = {
    input: "src/ring-menu.ts",
    output: {
      sourcemap: true,
      banner,
    },
  };

  const iife = merge(common, {
    output: {
      name: "RM",
      file: pkg.browser,
      format: "iife",
    },
    plugins: filterFalsy([
      ts(),
      PRODUCTION && (await import("rollup-plugin-terser")).terser(),
    ]),
  });

  const es6 = merge(common, {
    output: {
      file: pkg.module,
      format: "es",
    },
    plugins: [
      ts({
        tsconfig: {
          target: ScriptTarget.ES2015,
          declaration: true,
        },
      }),
    ],
  });

  return filterFalsy([iife, PRODUCTION && es6]);
}
