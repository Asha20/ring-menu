const path = require("path");
const chokidar = require("chokidar");
const { build } = require("./build-website");

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

function update() {
  log("Change detected. Rebuilding website...");
  build();
}

const websiteDir = path.resolve(__dirname, "..", "website");
const watcher = chokidar.watch(websiteDir);
watcher.on("add", update);
watcher.on("change", update);

console.log("Watching website/ for changes...");
