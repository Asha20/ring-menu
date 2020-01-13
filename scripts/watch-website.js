const path = require("path");
const chokidar = require("chokidar");
const { processFile, getEnv } = require("./build-website");

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
  const processed = processFile(filename, nunjucksEnv);
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

const websiteDir = path.resolve(__dirname, "..", "website");
const watcher = chokidar.watch(websiteDir, {
  cwd: websiteDir,
});
watcher.on("add", update);
watcher.on("change", update);

console.log("Watching website/ for changes...");
