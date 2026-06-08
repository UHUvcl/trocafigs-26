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

console.log("core tests ok");
