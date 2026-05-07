/* main.js — boot, nav, counters, table, timeline */

let appData = null;
let sortState = { col: null, dir: 1 };

// ── Flag images ───────────────────────────────────────────────────────────────

function flagImg(c) {
  if (!c.code || c.code === 'ship') {
    return `<span style="font-size:1.1em">🚢</span>`;
  }
  return `<img src="https://flagcdn.com/20x15/${c.code}.png"
               srcset="https://flagcdn.com/40x30/${c.code}.png 2x"
               width="20" height="15"
               alt="${c.name}"
               style="vertical-align:middle;border-radius:2px;margin-right:2px">`;
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function loadData() {
  const res = await fetch('data.json?_=' + Date.now());
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

// ── Boot ──────────────────────────────────────────────────────────────────────

async function boot() {
  try {
    appData = await loadData();
  } catch (e) {
    console.error('[Dashboard] Could not load data.json:', e);
    return;
  }

  applyMeta(appData.meta);
  buildCountryListOverview(appData);
  buildFacts(appData.facts);
  buildTimeline(appData);
  buildCountriesTable(appData);
  initChart(appData);
  animateCounters(appData.totals);
  updateClock();
  initNav();

  // Leaflet needs a rendered container with pixel dimensions
  setTimeout(() => initMap(appData), 60);

  // News loads in background — ready when user clicks the tab
  initNews(appData);

  // Auto-refresh all data every 5 minutes
  setInterval(refreshData, 5 * 60 * 1000);
}

// ── Refresh (re-fetches data.json + re-renders everything) ────────────────────

async function refreshData() {
  const btn = document.getElementById('news-refresh-btn');
  if (btn) { btn.disabled = true; btn.textContent = '↺ Cargando…'; }

  try {
    appData = await loadData();
  } catch (e) {
    console.error('[Dashboard] Refresh failed:', e);
    if (btn) { btn.disabled = false; btn.textContent = '↺ Actualizar'; }
    return;
  }

  applyMeta(appData.meta);
  buildCountryListOverview(appData);
  buildFacts(appData.facts);
  buildTimeline(appData);
  buildCountriesTable(appData);
  initChart(appData);
  animateCounters(appData.totals);
  updateClock();

  // Re-init map (handles its own cleanup internally)
  setTimeout(() => initMap(appData), 60);

  // Reset and reload news
  newsLoaded = false;
  allArticles = [];
  initNews(appData);

  if (btn) { btn.disabled = false; btn.textContent = '↺ Actualizar'; }
}

// ── Meta / banner ─────────────────────────────────────────────────────────────

function applyMeta(meta) {
  const banner = document.getElementById('risk-banner');
  if (!banner) return;
  banner.className = `risk-banner ${meta.alertColor}`;
  const icon  = banner.querySelector('.risk-icon');
  const text  = banner.querySelector('.risk-text');
  if (icon) icon.textContent = 'OMS';
  if (text) text.innerHTML = `<strong>Riesgo para población general: ${meta.alertLevel}</strong><br>${meta.alertText}`;
}

// ── Animated counters ─────────────────────────────────────────────────────────

function animateCounters(totals) {
  const plain = { 'm-deaths': totals.deaths, 'm-confirmed': totals.confirmed, 'm-suspected': totals.suspected, 'm-countries': totals.countries };
  const duration = 1300;

  Object.entries(plain).forEach(([id, target]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    (function tick(now) {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  });

  // Quarantine has tilde prefix
  const qEl = document.getElementById('m-quarantine');
  if (qEl) {
    const start = performance.now();
    (function tick(now) {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      qEl.textContent = '~' + Math.round(eased * totals.quarantine);
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }
}

// ── Overview sidebar ──────────────────────────────────────────────────────────

function buildCountryListOverview(data) {
  const list = document.getElementById('country-list-overview');
  if (!list) return;
  list.innerHTML = '';

  data.countries.forEach((c, i) => {
    const badgeClass = { high: 'badge-red', med: 'badge-amber', low: 'badge-blue', none: 'badge-gray' }[c.status] || 'badge-gray';

    let badgeText;
    if (c.confirmed > 0)        badgeText = `${c.confirmed} caso${c.confirmed !== 1 ? 's' : ''}`;
    else if (c.status === 'low') badgeText = 'Vigilancia';
    else                         badgeText = '0 casos';

    const el = document.createElement('div');
    el.className = `country-item${i === 0 ? ' selected' : ''}`;
    el.innerHTML = `
      <div>
        <div class="country-name">${flagImg(c)} ${c.name}</div>
        <div class="country-status">${c.statusText}</div>
      </div>
      <span class="country-badge ${badgeClass}">${badgeText}</span>
    `;
    list.appendChild(el);
  });
}

// ── Key facts panel ───────────────────────────────────────────────────────────

function buildFacts(facts) {
  const container = document.getElementById('facts-panel');
  if (!container) return;
  container.innerHTML = '';
  const colorMap = { amber: 'var(--amber)', red: 'var(--red)', blue: 'var(--blue)', green: 'var(--green)' };
  facts.forEach(f => {
    const valColor = f.color ? `style="color:${colorMap[f.color] || f.color}"` : '';
    const row = document.createElement('div');
    row.className = 'fact-row';
    row.innerHTML = `<span class="fact-label">${f.label}</span><span class="fact-value" ${valColor}>${f.value}</span>`;
    container.appendChild(row);
  });
}

// ── Timeline ──────────────────────────────────────────────────────────────────

function buildTimeline(data) {
  const list = document.getElementById('timeline-list');
  if (!list) return;
  list.innerHTML = '';
  data.timeline.forEach(item => {
    const el = document.createElement('div');
    el.className = 'tl-item';
    el.innerHTML = `
      <div class="tl-date">${item.date}</div>
      <div class="tl-dot ${item.dot}"></div>
      <div class="tl-text">${item.text}</div>
    `;
    list.appendChild(el);
  });
}

// ── Countries table (sortable) ────────────────────────────────────────────────

function buildCountriesTable(data) {
  const tbody = document.getElementById('countries-table-body');
  if (!tbody) return;

  const statusRank = { high: 3, med: 2, low: 1, none: 0 };

  const sorted = [...data.countries].sort((a, b) => {
    if (!sortState.col) return 0;
    let av = a[sortState.col];
    let bv = b[sortState.col];

    if (sortState.col === 'status') {
      av = statusRank[av] ?? 0;
      bv = statusRank[bv] ?? 0;
    }

    if (typeof av === 'number') return (av - bv) * sortState.dir;
    return String(av).localeCompare(String(bv)) * sortState.dir;
  });

  tbody.innerHTML = '';

  sorted.forEach(c => {
    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid var(--border)';
    row.innerHTML = `
      <td style="padding:14px 20px;color:var(--text);font-weight:500">${flagImg(c)} ${c.name}</td>
      <td style="padding:14px 20px;text-align:right;font-family:'IBM Plex Mono',monospace;color:${c.deaths > 0 ? 'var(--red)' : 'var(--text3)'};font-weight:600">${c.deaths}</td>
      <td style="padding:14px 20px;text-align:right;font-family:'IBM Plex Mono',monospace;color:${c.confirmed > 0 ? 'var(--amber)' : 'var(--text3)'};font-weight:600">${c.confirmed}</td>
      <td style="padding:14px 20px;text-align:right;font-family:'IBM Plex Mono',monospace;color:var(--text2)">${c.suspected}</td>
      <td style="padding:14px 20px"><span class="status-badge status-${c.status}">${c.statusText}</span></td>
      <td style="padding:14px 20px;color:var(--text2);font-size:12px">${c.notes}</td>
    `;
    tbody.appendChild(row);
  });

  refreshSortHeaders();
}

function refreshSortHeaders() {
  document.querySelectorAll('.th-sort').forEach(th => {
    const col = th.dataset.col;
    th.classList.toggle('sort-active', col === sortState.col);
    const ind = th.querySelector('.sort-indicator');
    if (!ind) return;
    ind.textContent = col === sortState.col ? (sortState.dir === 1 ? ' ↑' : ' ↓') : '';
  });
}

// ── Navigation ────────────────────────────────────────────────────────────────

function initNav() {
  const refreshBtn = document.getElementById('news-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshData);
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('view-' + btn.dataset.view).classList.add('active');

      if (btn.dataset.view === 'overview' && window._dashMap) {
        setTimeout(() => window._dashMap.invalidateSize(), 50);
      }
    });
  });

  document.querySelectorAll('.th-sort').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortState.col === col) sortState.dir *= -1;
      else { sortState.col = col; sortState.dir = 1; }
      buildCountriesTable(appData);
    });
  });
}

// ── Clock ─────────────────────────────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const el  = document.getElementById('last-update');
  if (el) el.textContent = `Comprobado: ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', boot);
setInterval(updateClock, 60000);
window.addEventListener('resize', () => { if (window._dashMap) window._dashMap.invalidateSize(); });
