const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

function build() {
  const PROJECT_ROOT = path.resolve(__dirname, "..");
  function fromRoot(...paths) {
    return path.resolve(PROJECT_ROOT, ...paths);
  }

  const input = fromRoot("website", "index.njk");
  const output = fromRoot("public", "index.html");
  if (!fs.existsSync("public")) {
    fs.mkdirSync("public");
  }

  nunjucks.configure({ autoescape: false });
  const rendered = nunjucks.render(input);
  fs.writeFileSync(output, rendered);
  fs.copyFileSync(
    fromRoot("website", "index.css"),
    fromRoot("public", "index.css"),
  );
  fs.copyFileSync(
    fromRoot("website", "index.js"),
    fromRoot("public", "index.js"),
  );
}

module.exports = { build };

if (!module.parent) {
  build();
}
