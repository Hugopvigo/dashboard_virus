# 🦠 Hantavirus Monitor — MugreCorp

> **Monitor en tiempo real del brote de Hantavirus 2026 · MV Hondius · Brote Atlántico**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-red?style=for-the-badge)](https://hugopvigo.github.io/dashboard_virus/)
[![Status](https://img.shields.io/badge/🔴_Estado-EN_VIVO-red?style=flat-square)](https://hugopvigo.github.io/dashboard_virus/)
[![MugreCorp](https://img.shields.io/badge/🤖_by-MugreCorp-blueviolet?style=flat-square)](https://hugopvigo.github.io/dashboard_virus/)

---

## ☣️ Sobre el brote

En marzo de 2026, el crucero **MV Hondius** zarpa de Ushuaia (Patagonia, Argentina). A bordo viajan ~150 pasajeros que, sin saberlo, han estado expuestos al **virus Hanta cepa Andes** — la única cepa conocida con transmisión persona-a-persona. Lo que empieza como un crucero de expedición por el Atlántico Sur se convierte en una crisis sanitaria internacional que involucra a **Argentina, Cabo Verde, Suiza, Sudáfrica y España**.

**MugreCorp** despliega este dashboard de inteligencia epidemiológica para el seguimiento en tiempo real del brote.

---

## 🖥️ Dashboard — Funcionalidades

### 🗺️ Mapa interactivo en tiempo real
- Tiles oscuros **CartoDB Dark** con Leaflet.js
- Marcadores por nivel de riesgo con **popups detallados**
- **Ruta trazada** del MV Hondius: Ushuaia → Atlántico → Cabo Verde → Tenerife
- Marcador del barco con **animación de pulso**

### 📊 Métricas del brote
| Indicador | Valor actual |
|-----------|-------------|
| ☠️ Fallecidos | **3** confirmados |
| 🧫 Casos confirmados | **8** (labs Suiza + Sudáfrica) |
| 🔬 Sospechosos | **12** en evaluación |
| 🚢 En cuarentena | **~150** pasajeros |
| 🌍 Países afectados | **5** con vigilancia activa |

### 📈 Gráfica de evolución
- Línea temporal de casos confirmados y fallecidos
- **Tooltips interactivos** con Chart.js v4
- Animación suave al cargar

### 🌍 Tabla de países
- **Ordenable por cualquier columna** (clic en cabecera)
- Indicadores visuales de nivel de riesgo
- Estado actualizable vía `data.json`

### ⏱️ Cronología del brote
- Timeline completo desde el zarpe (20 Mar) hasta hoy
- Eventos clave marcados por severidad

### 🏥 Información médica
- Síntomas por fase (Hanta cardiopulmonar)
- Vías de transmisión (cepa Andes)
- Protocolo de actuación ciudadana
- Links a fuentes oficiales (OMS, ECDC, Ministerio de Sanidad)

---

## 🧬 Cepa Andes — Por qué es distinta

> ⚠️ La cepa **Andes** es la **única variante de Hantavirus** con transmisión documentada entre humanos (no solo de roedor a humano). Tasa de mortalidad: **~25–35%**.

```
Ruta de transmisión habitual:   Roedor → Aerosol → Humano
Cepa Andes (este brote):        Humano → Fluidos → Humano  ⚠️
```

---

## 🚀 Tecnología

```
100% Vanilla — sin frameworks, sin build tools, sin npm
```

| Librería | Versión | Uso |
|----------|---------|-----|
| [Leaflet.js](https://leafletjs.com) | 1.9.4 | Mapa interactivo |
| [Chart.js](https://www.chartjs.org) | 4.4.0 | Gráficas |
| [CartoDB Dark](https://carto.com/basemaps/) | — | Tiles del mapa |
| [IBM Plex Mono/Sans](https://fonts.google.com/specimen/IBM+Plex+Mono) | — | Tipografía |

### Estructura de archivos
```
📁 dashboard_virus/
├── 📄 index.html          ← shell principal
├── 📄 data.json           ← fuente única de datos (editable)
├── 🖼️  logo.png            ← MugreCorp brand
├── 📁 css/
│   └── style.css
└── 📁 js/
    ├── map.js             ← Leaflet + ruta del barco
    ├── charts.js          ← Chart.js trend line
    └── main.js            ← boot, nav, contadores, tabla
```

---

## ⚙️ Actualizar datos del brote

Todos los datos viven en **`data.json`**. Para actualizar el dashboard basta con editar ese archivo:

```jsonc
// data.json — campos principales
{
  "totals": {
    "deaths": 3,       // ← actualizar aquí
    "confirmed": 8,
    "suspected": 12
  },
  "countries": [ ... ],   // añadir/modificar países
  "timeline":  [ ... ],   // añadir nuevos eventos
  "trend":     { ... }    // añadir puntos al gráfico
}
```

> 💡 **Próximamente:** integración con feeds RSS de Reuters, El País y OMS para actualización automática de noticias.

---

## 🌐 Despliegue en GitHub Pages

```bash
# Clonar y servir en local
git clone git@github.com:Hugopvigo/dashboard_virus.git
cd dashboard_virus
python3 -m http.server 8000
# → http://localhost:8000
```

**Para GitHub Pages:** Settings → Pages → Branch: `main` / Folder: `/ (root)` → Save

URL pública: **https://hugopvigo.github.io/dashboard_virus/**

---

## 📡 Fuentes oficiales

- 🏥 [Ministerio de Sanidad de España](https://www.sanidad.gob.es)
- 🌍 [OMS — Hantavirus](https://www.who.int/news-room/fact-sheets/detail/hantavirus-pulmonary-syndrome)
- 🇪🇺 [ECDC — Hantavirus](https://www.ecdc.europa.eu/en/hantavirus-infection)

---

## 🤖 MugreCorp

> *Inteligencia artificial al servicio de la defensa biológica.*

Dashboard desarrollado por **MugreCorp** como herramienta de seguimiento epidemiológico de código abierto.

---

<div align="center">

☣️ **Mantente informado. Mantente a salvo.** ☣️

`MugreCorp · 2026 · Todos los datos son de acceso público`

</div>
