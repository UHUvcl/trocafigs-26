import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { catalog, parseStickerText, createInitialState, changeCount, computeStats, buildListText } from "../core.mjs";

const publicBases = [
  "https://trocafigs-26.vercel.app",
  "https://coruscating-biscochitos-f68126.netlify.app"
];

const requiredIds = [
  "quickInput",
  "quickAddButton",
  "albumGroups",
  "missingText",
  "dupesText",
  "friendDupesInput",
  "friendMissingInput",
  "exportButton",
  "importInput"
];

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });
  assert.equal(response.ok, true, `${url} returned ${response.status}`);
  return {
    text: await response.text(),
    contentType: response.headers.get("content-type") || ""
  };
}

function assertNoUnexpectedExternalDeps(source, file) {
  const matches = source.match(/https?:\/\/[^"`'\s)]+/g) || [];
  const allowed = matches.filter((url) => url.startsWith("https://wa.me/"));
  assert.equal(matches.length, allowed.length, `${file} has unexpected external URL(s): ${matches.join(", ")}`);
}

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const appJs = await readFile(new URL("../app.js", import.meta.url), "utf8");
const coreJs = await readFile(new URL("../core.mjs", import.meta.url), "utf8");
const sw = await readFile(new URL("../service-worker.js", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"));

assert.match(html, /styles\.css\?v=9/);
assert.match(html, /app\.js\?v=9/);
assert.match(appJs, /core\.mjs\?v=9/);
assert.match(sw, /trocafigs-26-v9/);
assert.equal(manifest.display, "standalone");
assert.equal(manifest.icons.length > 0, true);
for (const id of requiredIds) assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
for (const [file, source] of Object.entries({ "index.html": html, "styles.css": css, "app.js": appJs, "core.mjs": coreJs, "service-worker.js": sw })) {
  assertNoUnexpectedExternalDeps(source, file);
}

assert.equal(catalog.length, 980);
const parsed = parseStickerText("BRA1, ARG 10, USA12x2, BAD 9");
assert.deepEqual(parsed.parsed.map((item) => `${item.code}:${item.amount}`), ["BRA 1:1", "ARG 10:1", "USA 12:2"]);
assert.deepEqual(parsed.invalid, ["BAD9"]);

const state = createInitialState();
changeCount(state, "USA 12", 2);
assert.equal(computeStats(state).duplicateTotal, 1);
assert.match(buildListText(state, "duplicates"), /USA 12/);

for (const base of publicBases) {
  const publicHtml = await fetchText(`${base}/`);
  assert.match(publicHtml.text, /styles\.css\?v=9/, `${base} does not reference v9 CSS`);
  assert.match(publicHtml.text, /app\.js\?v=9/, `${base} does not reference v9 JS`);
  assert.match(publicHtml.text, /Abra, marque, troque\./);

  const publicCss = await fetchText(`${base}/styles.css?v=9`);
  assert.match(publicCss.text, /--purple: #6c5ce7/);

  const publicApp = await fetchText(`${base}/app.js?v=9`);
  assert.match(publicApp.text, /dupe-badge/);
  assert.match(publicApp.text, /core\.mjs\?v=9/);

  const publicCore = await fetchText(`${base}/core.mjs?v=9`);
  assert.match(publicCore.text, /export const CATALOG_VERSION/);

  const publicSw = await fetchText(`${base}/service-worker.js`);
  assert.match(publicSw.text, /trocafigs-26-v9/);

  const publicManifest = await fetchText(`${base}/manifest.webmanifest`);
  assert.equal(JSON.parse(publicManifest.text).display, "standalone");

  const publicIcon = await fetchText(`${base}/icon.svg`);
  assert.match(publicIcon.contentType, /svg|image/);
  assert.match(publicIcon.text, /<svg/);
}

console.log("public smoke tests ok");
