import ts from "@wessberg/rollup-plugin-ts";
import pkg from "./package.json";

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

const common = {
  input: "src/main.ts",
  output: {
    sourcemap: true,
  },
  plugins: [ts()],
};

const umd = merge(common, {
  output: {
    name: "RM",
    file: pkg.browser,
    format: "umd",
  },
});

const es6 = merge(common, {
  output: {
    file: pkg.module,
    format: "es",
  },
});

export default filterFalsy([umd, PRODUCTION && es6]);
