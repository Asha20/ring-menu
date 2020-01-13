const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const WEBSITE = path.resolve(PROJECT_ROOT, "website");
const PUBLIC = path.resolve(PROJECT_ROOT, "public");
const { resolve } = path;

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function build() {
  const filenames = fs.readdirSync(WEBSITE);
  for (const filename of filenames) {
    processFile(filename);
  }
}

function processFile(filename, nunjucksEnv = getEnv()) {
  if (filename.startsWith("_")) {
    return false;
  }

  switch (path.extname(filename)) {
    case ".njk":
      renderTemplate(filename, nunjucksEnv);
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

function renderTemplate(filename, env) {
  mkdir(PUBLIC);
  const content = fs.readFileSync(resolve(WEBSITE, filename), "utf8");
  const html = env.renderString(content);
  const [outputName, _] = filenameIntoParts(filename);
  fs.writeFileSync(resolve(PUBLIC, outputName + ".html"), html);
}

function copyAsset(filename) {
  mkdir(PUBLIC);
  fs.copyFileSync(resolve(WEBSITE, filename), resolve(PUBLIC, filename));
}

module.exports = { processFile, getEnv };

if (!module.parent) {
  build();
}
