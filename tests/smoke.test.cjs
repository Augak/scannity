const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const app = read("app.js");
const studio = read("studio.js");
const sw = read("sw.js");
const manifest = JSON.parse(read("manifest.webmanifest"));
for (const asset of ["styles.css", "storage.js", "app.js", "studio.js", "manifest.webmanifest", "icon.svg", "sw.js"]) {
  assert.ok(fs.existsSync(path.join(root, asset)), `Missing app asset: ${asset}`);
}
assert.match(html, /<title>Scannity<\/title>/);
assert.match(html, /id="appShell"/);
assert.doesNotMatch(html, /id="authScreen"|id="authForm"|id="logoutBtn"/, "Login UI must not be shipped");
assert.match(html, /id="feedbackBtn"/);
assert.match(app, /async function autoCropPage/);
assert.match(app, /async function exportSearchablePdf/);
assert.match(app, /data-filter=/);
assert.match(studio, /function generate\(/);
assert.match(studio, /async function readFile\(/);
assert.match(studio, /async function startCamera\(/);
assert.match(sw, /\.\/studio\.js/);
assert.equal(manifest.name, "Scannity — Scan, Read & Create");
console.log("Scannity product smoke checks passed");
