import assert from "node:assert/strict";
import {
  catalog,
  teams,
  createInitialState,
  computeStats,
  setCount,
  changeCount,
  parseStickerText,
  buildListText,
  compareTrade,
  sanitizeState,
  parseBackup,
  normalizeCode,
  formatPercent
} from "../core.mjs";

assert.equal(catalog.length, 980, "catalogo principal deve ter 980 figurinhas");
assert.equal(teams.length, 49, "48 selecoes mais especiais FWC");
assert.equal(catalog.filter((item) => item.teamCode === "FWC").length, 20);
assert.equal(catalog.filter((item) => item.teamCode === "BRA").length, 20);

assert.equal(normalizeCode("bra10"), "BRA 10");
assert.equal(normalizeCode("BRA 01"), "BRA 1");
assert.equal(formatPercent(0.5), "0,5%");

const state = createInitialState();
assert.deepEqual(computeStats(state), {
  total: 980,
  owned: 0,
  missing: 980,
  duplicateTypes: 0,
  duplicateTotal: 0,
  percent: 0
});

assert.equal(setCount(state, "BRA 1", 1), true);
assert.equal(changeCount(state, "BRA 1", 2), true);
assert.equal(setCount(state, "ZZZ 1", 1), false);
assert.equal(computeStats(state).owned, 1);
assert.equal(computeStats(state).duplicateTotal, 2);

const parsed = parseStickerText("BRA 1, ARG10, FWC 5, USA12x2, XPTO");
assert.deepEqual(
  parsed.parsed.map((item) => `${item.code}:${item.amount}`),
  ["BRA 1:1", "ARG 10:1", "FWC 5:1", "USA 12:2"]
);
assert.equal(parsed.invalid.length, 1);

const text = buildListText(state, "duplicates", { name: "Teste", city: "Recife", meetup: "Shopping" });
assert.match(text, /BRA 1 x2/);
assert.match(text, /Ponto de troca sugerido: Shopping/);

const trade = compareTrade(state, "ARG 2, CAN 5", "BRA 1, USA 1");
assert.deepEqual(trade.iCanGive, ["BRA 1"]);
assert.deepEqual(trade.iCanReceive, ["ARG 2", "CAN 5"]);

const dirty = sanitizeState({ counts: { "bra 1": "3", "zzz 9": 10 }, profile: { name: "A".repeat(80) } });
assert.deepEqual(dirty.counts, { "BRA 1": 3 });
assert.equal(dirty.profile.name.length, 40);

// Invalid JSON objects must never become empty replacement collections.
const backup = createInitialState();
setCount(backup, "BRA 1", 3);
backup.profile.name = "Colecionador de teste";
assert.deepEqual(parseBackup(JSON.stringify(backup)), backup);
const emptyBackup = createInitialState();
assert.deepEqual(parseBackup(JSON.stringify(emptyBackup)), emptyBackup);
// The original release exported this same v1 / 2026-06-08 format.
const originalBackup = {
  version: 1,
  catalogVersion: "2026-06-08",
  counts: { "BRA 1": 2, "USA 12": 1 },
  profile: { name: "Teste", city: "", meetup: "" },
  updatedAt: "2026-06-08T12:00:00.000Z"
};
assert.deepEqual(parseBackup(JSON.stringify(originalBackup)), originalBackup);
for (const invalid of [
  null, [], {}, 42, true, "", { unrelated: true },
  { ...backup, version: undefined },
  { ...backup, version: 2 },
  { ...backup, catalogVersion: "unknown" },
  { ...backup, counts: null },
  { ...backup, counts: [] },
  { ...backup, counts: { "ZZZ 1": 1 } },
  { ...backup, counts: { "BRA 1": -1 } },
  { ...backup, counts: { "BRA 1": 1.5 } },
  { ...backup, counts: { "BRA 1": "3" } },
  { ...backup, counts: { "BRA 1": null } },
  { ...backup, counts: { "BRA 1": true } },
  { ...backup, counts: { "BRA 1": {} } },
  { ...backup, counts: { "BRA 1": 1000 } },
  { ...backup, profile: null },
  { ...backup, profile: [] },
  { ...backup, profile: { ...backup.profile, name: {} } },
  { ...backup, profile: { name: "Teste" } }
]) {
  let current = backup;
  assert.throws(() => { current = parseBackup(JSON.stringify(invalid)); });
  assert.equal(current, backup, "backup inválido deve preservar a coleção atual");
}
assert.throws(() => parseBackup("{broken"));
assert.throws(() => parseBackup(""));
assert.throws(() => parseBackup("   "));

console.log("core tests ok");
