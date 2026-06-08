import {
  STORAGE_KEY,
  catalog,
  catalogByCode,
  teams,
  sanitizeState,
  createInitialState,
  computeStats,
  setCount,
  changeCount,
  parseStickerText,
  buildListText,
  compareTrade,
  buildTradeText,
  normalizeText,
  formatPercent
} from "./core.mjs?v=9";

const $ = (selector) => document.querySelector(selector);
const app = {
  state: loadState(),
  view: "album",
  deferredInstall: null,
  lastTrade: { iCanGive: [], iCanReceive: [] }
};

const elements = {
  installButton: $("#installButton"),
  progressCircle: $("#progressCircle"),
  progressPercent: $("#progressPercent"),
  ownedCount: $("#ownedCount"),
  missingCount: $("#missingCount"),
  duplicateCount: $("#duplicateCount"),
  totalCount: $("#totalCount"),
  quickMode: $("#quickMode"),
  quickInput: $("#quickInput"),
  quickAddButton: $("#quickAddButton"),
  pasteListButton: $("#pasteListButton"),
  voiceInputButton: $("#voiceInputButton"),
  quickResult: $("#quickResult"),
  albumGroups: $("#albumGroups"),
  searchInput: $("#searchInput"),
  confedFilter: $("#confedFilter"),
  teamFilter: $("#teamFilter"),
  statusFilter: $("#statusFilter"),
  missingText: $("#missingText"),
  dupesText: $("#dupesText"),
  friendDupesInput: $("#friendDupesInput"),
  friendMissingInput: $("#friendMissingInput"),
  tradeResult: $("#tradeResult"),
  profileName: $("#profileName"),
  profileCity: $("#profileCity"),
  profileMeetup: $("#profileMeetup"),
  importInput: $("#importInput"),
  toast: $("#toast")
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return sanitizeState(JSON.parse(raw));
  } catch (error) {
    console.warn("Falha ao carregar estado local", error);
    return createInitialState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(app.state)));
  } catch (error) {
    showToast("Não consegui salvar neste aparelho. Exporte um backup antes de fechar.");
    console.error(error);
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 3600);
}

function renderStats() {
  const stats = computeStats(app.state);
  elements.ownedCount.textContent = stats.owned;
  elements.missingCount.textContent = stats.missing;
  elements.duplicateCount.textContent = stats.duplicateTotal;
  elements.totalCount.textContent = stats.total;
  elements.progressPercent.textContent = formatPercent(stats.percent);
  const circumference = 2 * Math.PI * 52;
  elements.progressCircle.style.strokeDasharray = `${circumference}`;
  elements.progressCircle.style.strokeDashoffset = `${circumference - (circumference * stats.percent) / 100}`;
}

function fillFilters() {
  const confeds = [...new Set(teams.map((team) => team.confed))];
  elements.confedFilter.innerHTML =
    '<option value="all">Todas as regiões</option>' +
    confeds.map((confed) => `<option value="${confed}">${confed}</option>`).join("");
  elements.teamFilter.innerHTML =
    '<option value="all">Todas as seleções</option>' +
    teams.map((team) => `<option value="${team.code}">${team.code} - ${team.name}</option>`).join("");
}

function getFilteredCatalog() {
  const query = normalizeText(elements.searchInput.value);
  const confed = elements.confedFilter.value;
  const team = elements.teamFilter.value;
  const status = elements.statusFilter.value;
  return catalog.filter((item) => {
    const count = app.state.counts[item.code] || 0;
    const haystack = normalizeText(`${item.code} ${item.teamName} ${item.number}`);
    const compactHaystack = haystack.replace(/\s+/g, "");
    const compactQuery = query.replace(/\s+/g, "");
    if (query && !haystack.includes(query.replace(/\s+/g, " ")) && !compactHaystack.includes(compactQuery)) {
      return false;
    }
    if (confed !== "all" && item.confed !== confed) return false;
    if (team !== "all" && item.teamCode !== team) return false;
    if (status === "owned" && count === 0) return false;
    if (status === "missing" && count > 0) return false;
    if (status === "duplicates" && count < 2) return false;
    return true;
  });
}

function renderAlbum() {
  const filtered = getFilteredCatalog();
  const grouped = new Map();
  for (const item of filtered) {
    if (!grouped.has(item.teamCode)) {
      grouped.set(item.teamCode, {
        teamCode: item.teamCode,
        teamName: item.teamName,
        confed: item.confed,
        items: []
      });
    }
    grouped.get(item.teamCode).items.push(item);
  }

  if (!filtered.length) {
    elements.albumGroups.innerHTML = '<p class="empty-state">Nenhuma figurinha encontrada com esses filtros.</p>';
    return;
  }

  elements.albumGroups.innerHTML = [...grouped.values()]
    .map((group) => {
      const owned = group.items.filter((item) => (app.state.counts[item.code] || 0) > 0).length;
      const dupes = group.items.filter((item) => (app.state.counts[item.code] || 0) > 1).length;
      const summary = dupes ? `${owned}/${group.items.length} · ${dupes} rep.` : `${owned}/${group.items.length}`;
      return `
        <article class="album-group">
          <div class="group-header">
            <div>
              <h3>${group.teamCode} - ${group.teamName}</h3>
              <span>${group.confed}</span>
            </div>
            <strong>${summary}</strong>
          </div>
          <div class="sticker-grid">
            ${group.items.map(renderStickerCard).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderStickerCard(item) {
  const count = app.state.counts[item.code] || 0;
  const status = count === 0 ? "missing" : count === 1 ? "owned" : "dupe";
  const label = count === 0 ? "Falta" : count === 1 ? "Tenho" : `${count - 1} rep.`;
  const dupeBadge = count > 1 ? `<span class="dupe-badge">+${count - 1}</span>` : "";
  const checkIcon = count > 0 ? '<span class="check-icon" aria-hidden="true">✓</span>' : "";
  const nextAction = count === 0 ? "marcar como tenho" : "remover do album";
  const ariaStatus = count === 0 ? "falta" : count === 1 ? "tenho uma" : `tenho ${count}, sendo ${count - 1} repetida`;
  return `
    <article class="sticker-card ${status}" data-code="${item.code}">
      ${dupeBadge}
      <button
        class="sticker-main"
        type="button"
        data-action="toggle"
        data-code="${item.code}"
        aria-label="${item.code}, ${ariaStatus}. Toque para ${nextAction}."
        title="${item.code}: toque para ${nextAction}"
      >
        <strong>${item.code}</strong>
        <span>${label}</span>
        ${checkIcon}
      </button>
      <div class="counter">
        <button type="button" data-action="minus" data-code="${item.code}" aria-label="Remover ${item.code}">-</button>
        <output>${count}</output>
        <button type="button" data-action="plus" data-code="${item.code}" aria-label="Adicionar ${item.code}">+</button>
      </div>
    </article>
  `;
}

function renderLists() {
  elements.missingText.value = buildListText(app.state, "missing");
  elements.dupesText.value = buildListText(app.state, "duplicates");
}

function renderProfile() {
  elements.profileName.value = app.state.profile.name;
  elements.profileCity.value = app.state.profile.city;
  elements.profileMeetup.value = app.state.profile.meetup;
}

function renderAll() {
  renderStats();
  renderAlbum();
  renderLists();
  renderProfile();
}

function persistAndRender(message) {
  saveState();
  renderAll();
  if (message) showToast(message);
}

function applyQuickInput() {
  const result = parseStickerText(elements.quickInput.value);
  if (!result.parsed.length) {
    elements.quickResult.textContent = "Digite pelo menos um código válido.";
    return;
  }
  const mode = elements.quickMode.value;
  for (const item of result.parsed) {
    if (mode === "pack") changeCount(app.state, item.code, item.amount);
    if (mode === "owned") setCount(app.state, item.code, Math.max(1, app.state.counts[item.code] || item.amount));
    if (mode === "missing") setCount(app.state, item.code, 0);
  }
  const invalidText = result.invalid.length ? ` Ignorados: ${result.invalid.join(", ")}.` : "";
  elements.quickResult.textContent = `${result.parsed.length} entrada(s) aplicada(s).${invalidText}`;
  elements.quickInput.value = "";
  persistAndRender();
}

function handleStickerAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const code = button.dataset.code;
  const current = app.state.counts[code] || 0;
  if (button.dataset.action === "toggle") setCount(app.state, code, current > 0 ? 0 : 1);
  if (button.dataset.action === "minus") changeCount(app.state, code, -1);
  if (button.dataset.action === "plus") changeCount(app.state, code, 1);
  persistAndRender();
}

function setView(view) {
  app.view = view;
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `view-${view}`);
  });
  $("#albumToolbar").hidden = !["album"].includes(view);
  renderLists();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Texto copiado.");
  } catch {
    showToast("Não consegui copiar automaticamente. Selecione o texto manualmente.");
  }
}

function openWhatsApp(text) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

async function pasteListIntoQuickInput() {
  try {
    const text = await navigator.clipboard.readText();
    if (!text.trim()) {
      showToast("A área de transferência está vazia.");
      return;
    }
    elements.quickInput.value = `${elements.quickInput.value} ${text}`.trim();
    elements.quickInput.focus();
    showToast("Lista colada. Revise e toque em Aplicar.");
  } catch {
    showToast("Não consegui ler a área de transferência. Cole manualmente no campo.");
  }
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Entrada por voz não está disponível neste navegador.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  elements.voiceInputButton.textContent = "Ouvindo...";
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    elements.quickInput.value = `${elements.quickInput.value} ${transcript}`.trim();
    elements.quickInput.focus();
    showToast("Códigos por voz adicionados ao campo.");
  };
  recognition.onerror = () => {
    showToast("Não consegui entender a fala. Tente dizer os códigos com pausas.");
  };
  recognition.onend = () => {
    elements.voiceInputButton.textContent = "Falar códigos";
  };
  recognition.start();
}

function downloadBackup() {
  const data = JSON.stringify(sanitizeState(app.state), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trocafigs-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importBackup(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const imported = sanitizeState(JSON.parse(text));
    app.state = imported;
    persistAndRender("Backup importado.");
  } catch (error) {
    console.error(error);
    showToast("Backup inválido. Confira se o arquivo JSON foi exportado pelo app.");
  } finally {
    elements.importInput.value = "";
  }
}

function updateProfile() {
  app.state.profile = {
    name: elements.profileName.value.trim().slice(0, 40),
    city: elements.profileCity.value.trim().slice(0, 60),
    meetup: elements.profileMeetup.value.trim().slice(0, 120)
  };
  app.state.updatedAt = new Date().toISOString();
  saveState();
  renderLists();
}

function compareNow() {
  app.lastTrade = compareTrade(app.state, elements.friendDupesInput.value, elements.friendMissingInput.value);
  const give = app.lastTrade.iCanGive.length ? app.lastTrade.iCanGive.join(", ") : "Nenhuma por enquanto.";
  const receive = app.lastTrade.iCanReceive.length ? app.lastTrade.iCanReceive.join(", ") : "Nenhuma por enquanto.";
  elements.tradeResult.innerHTML = `
    <article>
      <h3>Você pode entregar</h3>
      <p>${give}</p>
    </article>
    <article>
      <h3>Você pode receber</h3>
      <p>${receive}</p>
    </article>
  `;
}

function bindEvents() {
  elements.quickAddButton.addEventListener("click", applyQuickInput);
  elements.pasteListButton.addEventListener("click", pasteListIntoQuickInput);
  elements.voiceInputButton.addEventListener("click", startVoiceInput);
  elements.quickInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") applyQuickInput();
  });
  elements.albumGroups.addEventListener("click", handleStickerAction);
  [elements.searchInput, elements.confedFilter, elements.teamFilter, elements.statusFilter].forEach((element) => {
    element.addEventListener("input", renderAlbum);
    element.addEventListener("change", renderAlbum);
  });
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  document.querySelectorAll("[data-jump-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.jumpView));
  });
  $("#shareMissingButton").addEventListener("click", () => openWhatsApp(elements.missingText.value));
  $("#shareDupesButton").addEventListener("click", () => openWhatsApp(elements.dupesText.value));
  $("#copyMissingButton").addEventListener("click", () => copyText(elements.missingText.value));
  $("#copyDupesButton").addEventListener("click", () => copyText(elements.dupesText.value));
  $("#compareButton").addEventListener("click", compareNow);
  $("#shareTradeButton").addEventListener("click", () => {
    compareNow();
    openWhatsApp(buildTradeText(app.state, app.lastTrade));
  });
  [elements.profileName, elements.profileCity, elements.profileMeetup].forEach((element) => {
    element.addEventListener("input", updateProfile);
  });
  $("#exportButton").addEventListener("click", downloadBackup);
  elements.importInput.addEventListener("change", (event) => importBackup(event.target.files?.[0]));
  $("#resetButton").addEventListener("click", () => {
    const confirmed = window.confirm("Zerar todas as figurinhas e dados deste aparelho?");
    if (!confirmed) return;
    app.state = createInitialState();
    persistAndRender("Dados zerados.");
  });
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    app.deferredInstall = event;
    elements.installButton.hidden = false;
  });
  elements.installButton.addEventListener("click", async () => {
    if (!app.deferredInstall) return;
    app.deferredInstall.prompt();
    await app.deferredInstall.userChoice;
    app.deferredInstall = null;
    elements.installButton.hidden = true;
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Service worker indisponível", error);
    });
  });
}

fillFilters();
bindEvents();
renderAll();
registerServiceWorker();

window.TrocaFigs = {
  getState: () => sanitizeState(app.state),
  getStats: () => computeStats(app.state),
  catalogSize: catalog.length,
  hasCode: (code) => catalogByCode.has(code)
};
