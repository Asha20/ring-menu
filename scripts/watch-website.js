const path = require("path");
const chokidar = require("chokidar");
const { processFile, getEnv, DIST, WEBSITE } = require("./build-website");

const resolve = path.resolve;

function timestamp() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `[${h}:${m}:${s}]`;
}

function log(...msgs) {
  console.log(timestamp(), ...msgs);
}

const nunjucksEnv = getEnv();
function update(filename) {
  const processed = processFile("development", filename, nunjucksEnv);
  if (!processed) {
    return;
  }

  const extension = path.extname(filename);
  if (extension === ".njk") {
    log(`Rendered template ${filename}`);
  } else {
    log(`Copied asset ${filename}`);
  }
}

const watcher = chokidar.watch(WEBSITE, { cwd: WEBSITE });
watcher.add(resolve(DIST, "ring-menu.js"));

watcher.on("add", update);
watcher.on("change", update);

console.log("Watching website/ for changes...");
