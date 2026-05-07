/* news.js — RSS news feed via rss2json */

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

let newsLoaded = false;
let allArticles = [];

async function initNews(data) {
  if (newsLoaded) return;

  const grid    = document.getElementById('news-grid');
  const filters = document.getElementById('news-filters');
  const count   = document.getElementById('news-count');
  if (!grid) return;

  showSkeletons(grid);

  const sources = data.newsSources || [];
  const results = await Promise.allSettled(sources.map(fetchFeed));

  allArticles = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      r.value.forEach(a => allArticles.push({ ...a, _source: sources[i] }));
    }
  });

  allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  newsLoaded = true;

  buildFilters(filters, sources);
  renderArticles(grid, allArticles);

  if (count) count.textContent = allArticles.length + ' artículos';

  const badge = document.getElementById('news-badge');
  if (badge) {
    badge.textContent = allArticles.length;
    badge.style.display = allArticles.length ? 'inline-block' : 'none';
  }
}

async function fetchFeed(source) {
  const url = RSS2JSON + encodeURIComponent(source.url);
  const res  = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const json = await res.json();
  if (json.status !== 'ok') return [];
  return json.items || [];
}

// ── Filters ───────────────────────────────────────────────────────────────────

function buildFilters(bar, sources) {
  if (!bar) return;
  bar.innerHTML = '';

  const allBtn = makeBtn('Todas', null, true);
  allBtn.addEventListener('click', () => {
    activateBtn(bar, allBtn, null);
    renderArticles(document.getElementById('news-grid'), allArticles);
  });
  bar.appendChild(allBtn);

  sources.forEach(src => {
    const btn = makeBtn(src.name, src.color, false);
    btn.addEventListener('click', () => {
      activateBtn(bar, btn, src.color);
      renderArticles(
        document.getElementById('news-grid'),
        allArticles.filter(a => a._source.name === src.name)
      );
    });
    bar.appendChild(btn);
  });
}

function makeBtn(label, color, active) {
  const btn = document.createElement('button');
  btn.className = 'news-filter-btn' + (active ? ' active' : '');
  btn.textContent = label;
  btn._color = color;
  return btn;
}

function activateBtn(bar, activeBtn, color) {
  bar.querySelectorAll('.news-filter-btn').forEach(b => {
    b.classList.remove('active');
    b.style.cssText = '';
  });
  activeBtn.classList.add('active');
  if (color) {
    activeBtn.style.borderColor = color;
    activeBtn.style.color       = color;
    activeBtn.style.background  = color + '1a';
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderArticles(grid, articles) {
  if (!grid) return;

  if (!articles.length) {
    grid.innerHTML = '<div class="news-empty">No hay artículos disponibles.<br>Comprueba la conexión o inténtalo más tarde.</div>';
    return;
  }

  grid.innerHTML = '';
  articles.forEach(a => {
    const card = document.createElement('article');
    card.className = 'news-card';

    const src     = a._source;
    const date    = formatDate(a.pubDate);
    const excerpt = stripHtml(a.description || a.content || '').slice(0, 155);

    card.innerHTML = `
      <div class="news-card-meta">
        <span class="news-source-badge"
          style="color:${src.color};background:${src.color}1a;border-color:${src.color}44">
          ${src.name}
        </span>
        <span class="news-date">${date}</span>
      </div>
      <h3 class="news-title">
        <a href="${escHtml(a.link)}" target="_blank" rel="noopener noreferrer">${escHtml(a.title)}</a>
      </h3>
      <p class="news-excerpt">${escHtml(excerpt)}${excerpt.length >= 155 ? '…' : ''}</p>
      <a class="news-read-more" href="${escHtml(a.link)}" target="_blank" rel="noopener noreferrer">
        Leer artículo →
      </a>
    `;
    grid.appendChild(card);
  });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function showSkeletons(grid) {
  grid.innerHTML = Array(6).fill(`
    <div class="news-card news-skeleton" aria-hidden="true">
      <div class="skeleton-line short"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line body1"></div>
      <div class="skeleton-line body2"></div>
    </div>
  `).join('');
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d)) return str.slice(0, 10);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
