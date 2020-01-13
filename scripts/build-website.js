const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");
const minify = require("html-minifier").minify;

const { resolve } = path;
const PROJECT_ROOT = resolve(__dirname, "..");
const WEBSITE = resolve(PROJECT_ROOT, "website");
const PUBLIC = resolve(PROJECT_ROOT, "public");
const DIST = resolve(PROJECT_ROOT, "dist");

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function build(mode) {
  const filenames = fs.readdirSync(WEBSITE);
  for (const filename of filenames) {
    processFile(mode, filename);
  }
  fs.copyFileSync(
    resolve(DIST, "ring-menu.js"),
    resolve(PUBLIC, "ring-menu.js"),
  );
}

function processFile(mode, filename, nunjucksEnv = getEnv()) {
  if (filename.startsWith("_")) {
    return false;
  }

  switch (path.extname(filename)) {
    case ".njk":
      renderTemplate(mode, filename, nunjucksEnv);
      break;
    default:
      copyAsset(filename);
      break;
  }
  return true;
}

function getEnv() {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(WEBSITE), {
    autoescape: false,
    noCache: true,
  });
  env.addFilter("joinStr", (str, sep = "_") => {
    return str.split(" ").join(sep);
  });
  return env;
}

function filenameIntoParts(filename) {
  const extension = path.extname(filename);
  const name = filename.slice(0, -extension.length);
  return [name, extension];
}

const minifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeTagWhitespace: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
};
function getHtml(mode, filename, env) {
  const content = fs.readFileSync(resolve(WEBSITE, filename), "utf8");
  const html = env.renderString(content);
  if (mode !== "production") {
    return html;
  }
  return minify(html, minifyOptions);
}

function renderTemplate(mode, filename, env) {
  mkdir(PUBLIC);
  const html = getHtml(mode, filename, env);
  const [outputName, _] = filenameIntoParts(filename);
  fs.writeFileSync(resolve(PUBLIC, outputName + ".html"), html);
}

function copyAsset(filePath) {
  mkdir(PUBLIC);
  const filename = path.basename(filePath);
  fs.copyFileSync(resolve(WEBSITE, filePath), resolve(PUBLIC, filename));
}

module.exports = { processFile, getEnv, DIST, WEBSITE };

if (!module.parent) {
  const mode = process.argv[2] || "production";
  if (mode !== "development" && mode !== "production") {
    return console.log(
      "Provide a mode of either 'development' or 'production'.",
    );
  }
  build(mode);
}
