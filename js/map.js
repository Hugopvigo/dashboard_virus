/* map.js — Leaflet interactive map */

function initMap(data) {
  const container = document.getElementById('map');
  if (!container) return;

  if (window._dashMap) {
    window._dashMap.remove();
    window._dashMap = null;
  }

  const map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
    minZoom: 2,
    maxZoom: 10
  }).setView([15, -20], 3);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Ship route polyline
  const routeCoords = data.shipRoute.map(p => [p.lat, p.lng]);
  L.polyline(routeCoords, {
    color: 'rgba(255, 68, 68, 0.45)',
    weight: 1.5,
    dashArray: '6 4'
  }).addTo(map);

  // Waypoint labels on route (small dots)
  data.shipRoute.forEach(p => {
    L.circleMarker([p.lat, p.lng], {
      radius: 3,
      fillColor: 'rgba(255,68,68,0.5)',
      color: 'transparent',
      fillOpacity: 1
    }).bindTooltip(p.label, {
      className: 'route-tooltip',
      direction: 'top',
      offset: [0, -4]
    }).addTo(map);
  });

  // Country markers
  const markerClass = { high: 'marker-red', med: 'marker-amber', low: 'marker-blue', none: 'marker-gray' };
  const statusColor  = { high: '#ff4444',    med: '#ffaa00',       low: '#4488ff',    none: 'rgba(255,255,255,0.3)' };

  data.countries.forEach(c => {
    const isShip = c.name === 'MV Hondius';
    const cls    = isShip ? 'marker-ship' : (markerClass[c.status] || 'marker-gray');
    const col    = statusColor[c.status] || statusColor.none;

    const icon = L.divIcon({
      className: 'map-icon-wrapper',
      html: `<span class="map-dot ${cls}"></span>`,
      iconSize:   [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });

    const content = `
      <div class="popup-title">${flagImg(c)} ${c.name}</div>
      <div class="popup-status" style="color:${col}">${c.statusText}</div>
      <div class="popup-row">
        <span class="popup-label">Fallecidos</span>
        <span style="color:#ff4444;font-family:'IBM Plex Mono',monospace;font-weight:600">${c.deaths}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">Confirmados</span>
        <span style="color:#ffaa00;font-family:'IBM Plex Mono',monospace;font-weight:600">${c.confirmed}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">Sospechosos</span>
        <span style="font-family:'IBM Plex Mono',monospace">${c.suspected}</span>
      </div>
      <div class="popup-notes">${c.notes}</div>
    `;

    L.marker([c.lat, c.lng], { icon })
      .bindPopup(content, { className: 'dash-popup', maxWidth: 260 })
      .addTo(map);
  });

  window._dashMap = map;
}
