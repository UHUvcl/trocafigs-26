export const STORAGE_KEY = "trocafigs26.state.v1";
export const CATALOG_VERSION = "2026-06-08";

export const teams = [
  { code: "FWC", name: "Especiais do torneio", confed: "Especial", host: false },
  { code: "CAN", name: "Canadá", confed: "Concacaf", host: true },
  { code: "MEX", name: "México", confed: "Concacaf", host: true },
  { code: "USA", name: "Estados Unidos", confed: "Concacaf", host: true },
  { code: "AUS", name: "Austrália", confed: "AFC", host: false },
  { code: "IRQ", name: "Iraque", confed: "AFC", host: false },
  { code: "IRN", name: "Irã", confed: "AFC", host: false },
  { code: "JPN", name: "Japão", confed: "AFC", host: false },
  { code: "JOR", name: "Jordânia", confed: "AFC", host: false },
  { code: "KOR", name: "Coreia do Sul", confed: "AFC", host: false },
  { code: "QAT", name: "Catar", confed: "AFC", host: false },
  { code: "KSA", name: "Arábia Saudita", confed: "AFC", host: false },
  { code: "UZB", name: "Uzbequistão", confed: "AFC", host: false },
  { code: "ALG", name: "Argélia", confed: "CAF", host: false },
  { code: "CPV", name: "Cabo Verde", confed: "CAF", host: false },
  { code: "COD", name: "RD Congo", confed: "CAF", host: false },
  { code: "CIV", name: "Costa do Marfim", confed: "CAF", host: false },
  { code: "EGY", name: "Egito", confed: "CAF", host: false },
  { code: "GHA", name: "Gana", confed: "CAF", host: false },
  { code: "MAR", name: "Marrocos", confed: "CAF", host: false },
  { code: "SEN", name: "Senegal", confed: "CAF", host: false },
  { code: "RSA", name: "África do Sul", confed: "CAF", host: false },
  { code: "TUN", name: "Tunísia", confed: "CAF", host: false },
  { code: "CUW", name: "Curaçao", confed: "Concacaf", host: false },
  { code: "HAI", name: "Haiti", confed: "Concacaf", host: false },
  { code: "PAN", name: "Panama", confed: "Concacaf", host: false },
  { code: "ARG", name: "Argentina", confed: "CONMEBOL", host: false },
  { code: "BRA", name: "Brasil", confed: "CONMEBOL", host: false },
  { code: "COL", name: "Colômbia", confed: "CONMEBOL", host: false },
  { code: "ECU", name: "Equador", confed: "CONMEBOL", host: false },
  { code: "PAR", name: "Paraguai", confed: "CONMEBOL", host: false },
  { code: "URU", name: "Uruguai", confed: "CONMEBOL", host: false },
  { code: "NZL", name: "Nova Zelândia", confed: "OFC", host: false },
  { code: "AUT", name: "Áustria", confed: "UEFA", host: false },
  { code: "BEL", name: "Bélgica", confed: "UEFA", host: false },
  { code: "BIH", name: "Bósnia e Herzegovina", confed: "UEFA", host: false },
  { code: "CRO", name: "Croácia", confed: "UEFA", host: false },
  { code: "CZE", name: "Tchequia", confed: "UEFA", host: false },
  { code: "ENG", name: "Inglaterra", confed: "UEFA", host: false },
  { code: "FRA", name: "França", confed: "UEFA", host: false },
  { code: "GER", name: "Alemanha", confed: "UEFA", host: false },
  { code: "NED", name: "Países Baixos", confed: "UEFA", host: false },
  { code: "NOR", name: "Noruega", confed: "UEFA", host: false },
  { code: "POR", name: "Portugal", confed: "UEFA", host: false },
  { code: "SCO", name: "Escócia", confed: "UEFA", host: false },
  { code: "ESP", name: "Espanha", confed: "UEFA", host: false },
  { code: "SWE", name: "Suécia", confed: "UEFA", host: false },
  { code: "SUI", name: "Suíça", confed: "UEFA", host: false },
  { code: "TUR", name: "Turquia", confed: "UEFA", host: false }
];

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

export function normalizeCode(code) {
  const clean = normalizeText(code).replace(/[^A-Z0-9]/g, "");
  const match = clean.match(/^([A-Z]{3})(\d{1,2})$/);
  if (!match) return "";
  return `${match[1]} ${Number(match[2])}`;
}

export function createCatalog() {
  return teams.flatMap((team) => {
    const limit = team.code === "FWC" ? 20 : 20;
    return Array.from({ length: limit }, (_, index) => ({
      code: `${team.code} ${index + 1}`,
      teamCode: team.code,
      teamName: team.name,
      confed: team.confed,
      number: index + 1,
      kind: team.code === "FWC" ? "special" : "team"
    }));
  });
}

export const catalog = createCatalog();
export const catalogByCode = new Map(catalog.map((item) => [item.code, item]));

export function createInitialState() {
  return {
    version: 1,
    catalogVersion: CATALOG_VERSION,
    counts: {},
    profile: {
      name: "",
      city: "",
      meetup: ""
    },
    updatedAt: new Date().toISOString()
  };
}

export function sanitizeState(value) {
  const base = createInitialState();
  if (!value || typeof value !== "object") return base;
  const counts = {};
  if (value.counts && typeof value.counts === "object") {
    for (const [rawCode, rawCount] of Object.entries(value.counts)) {
      const code = normalizeCode(rawCode);
      const count = Math.max(0, Math.min(999, Number.parseInt(rawCount, 10) || 0));
      if (code && catalogByCode.has(code) && count > 0) counts[code] = count;
    }
  }
  return {
    ...base,
    counts,
    profile: {
      name: String(value.profile?.name || "").slice(0, 40),
      city: String(value.profile?.city || "").slice(0, 60),
      meetup: String(value.profile?.meetup || "").slice(0, 120)
    },
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : base.updatedAt
  };
}

export function setCount(state, code, count) {
  const normalized = normalizeCode(code);
  if (!catalogByCode.has(normalized)) return false;
  const next = Math.max(0, Math.min(999, Number.parseInt(count, 10) || 0));
  if (next === 0) delete state.counts[normalized];
  else state.counts[normalized] = next;
  state.updatedAt = new Date().toISOString();
  return true;
}

export function changeCount(state, code, delta) {
  const normalized = normalizeCode(code);
  const current = state.counts[normalized] || 0;
  return setCount(state, normalized, current + delta);
}

export function computeStats(state) {
  const total = catalog.length;
  let owned = 0;
  let duplicateTypes = 0;
  let duplicateTotal = 0;
  for (const item of catalog) {
    const count = state.counts[item.code] || 0;
    if (count > 0) owned += 1;
    if (count > 1) {
      duplicateTypes += 1;
      duplicateTotal += count - 1;
    }
  }
  return {
    total,
    owned,
    missing: total - owned,
    duplicateTypes,
    duplicateTotal,
    percent: total ? Number(((owned / total) * 100).toFixed(1)) : 0
  };
}

export function formatPercent(value) {
  return `${String(value).replace(".", ",")}%`;
}

export function parseStickerText(text) {
  const normalized = normalizeText(text)
    .replace(/([A-Z]{3})\s*[-#]?\s*(\d{1,2})/g, "$1 $2")
    .replace(/[;|\n\r\t]+/g, ",");
  const parts = normalized
    .split(/[,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const parsed = [];
  const invalid = [];

  for (let index = 0; index < parts.length; index += 1) {
    const current = parts[index];
    let token = current;
    if (/^[A-Z]{3}$/.test(current) && /^\d{1,2}(X\d{1,3})?$/.test(parts[index + 1] || "")) {
      token = `${current}${parts[index + 1]}`;
      index += 1;
    }
    const match = token.match(/^([A-Z]{3})(\d{1,2})(?:X(\d{1,3}))?$/);
    if (!match) {
      invalid.push(current);
      continue;
    }
    const code = `${match[1]} ${Number(match[2])}`;
    const amount = Math.max(1, Math.min(999, Number.parseInt(match[3] || "1", 10)));
    if (!catalogByCode.has(code)) invalid.push(token);
    else parsed.push({ code, amount });
  }

  return { parsed, invalid };
}

export function groupedCodes(codes) {
  const groups = new Map();
  for (const code of codes) {
    const item = catalogByCode.get(code);
    if (!item) continue;
    if (!groups.has(item.teamCode)) {
      groups.set(item.teamCode, {
        teamCode: item.teamCode,
        teamName: item.teamName,
        codes: []
      });
    }
    groups.get(item.teamCode).codes.push(code);
  }
  return [...groups.values()];
}

export function buildListText(state, type, profile = state.profile) {
  const stats = computeStats(state);
  const title = type === "missing" ? "Figurinhas que faltam" : "Figurinhas repetidas para troca";
  const source =
    type === "missing"
      ? catalog.filter((item) => (state.counts[item.code] || 0) === 0).map((item) => item.code)
      : catalog.filter((item) => (state.counts[item.code] || 0) > 1).map((item) => item.code);
  const lines = [];
  lines.push(`${title} - TrocaFigs 26`);
  if (profile?.name) lines.push(`Colecionador: ${profile.name}`);
  if (profile?.city) lines.push(`Local: ${profile.city}`);
  lines.push(`Progresso: ${stats.owned}/${stats.total} (${formatPercent(stats.percent)})`);
  lines.push("");

  if (!source.length) {
    lines.push(type === "missing" ? "Nenhuma faltante. Álbum completo!" : "Nenhuma repetida cadastrada.");
    return lines.join("\n");
  }

  for (const group of groupedCodes(source)) {
    const values = group.codes.map((code) => {
      if (type === "duplicates") {
        const extra = (state.counts[code] || 0) - 1;
        return extra > 1 ? `${code} x${extra}` : code;
      }
      return code;
    });
    lines.push(`${group.teamCode} - ${group.teamName}: ${values.join(", ")}`);
  }

  if (type === "duplicates" && profile?.meetup) {
    lines.push("");
    lines.push(`Ponto de troca sugerido: ${profile.meetup}`);
  }
  return lines.join("\n");
}

export function compareTrade(state, friendDupesText, friendMissingText) {
  const friendDupes = new Set(parseStickerText(friendDupesText).parsed.map((item) => item.code));
  const friendMissing = new Set(parseStickerText(friendMissingText).parsed.map((item) => item.code));
  const myMissing = new Set(catalog.filter((item) => (state.counts[item.code] || 0) === 0).map((item) => item.code));
  const myDupes = new Set(catalog.filter((item) => (state.counts[item.code] || 0) > 1).map((item) => item.code));
  const iCanGive = [...myDupes].filter((code) => friendMissing.has(code));
  const iCanReceive = [...friendDupes].filter((code) => myMissing.has(code));
  return { iCanGive, iCanReceive };
}

export function buildTradeText(state, trade, profile = state.profile) {
  const lines = ["Proposta de troca - TrocaFigs 26"];
  if (profile?.name) lines.push(`Colecionador: ${profile.name}`);
  if (profile?.city) lines.push(`Local: ${profile.city}`);
  lines.push("");
  lines.push(`Eu posso entregar: ${trade.iCanGive.length ? trade.iCanGive.join(", ") : "nenhuma compatibilidade"}`);
  lines.push(`Eu preciso receber: ${trade.iCanReceive.length ? trade.iCanReceive.join(", ") : "nenhuma compatibilidade"}`);
  if (profile?.meetup) lines.push(`Ponto sugerido: ${profile.meetup}`);
  return lines.join("\n");
}
