import './version-5.css';
import { initConceptLayer } from './concept-layer.js';

const app = document.getElementById('v5-app');
const proxyUrl = '/.netlify/functions/gemini-proxy';

const baseTools = [
  {
    id: 'swarm-gen',
    label: 'tool 01',
    title: 'Swarm Gen',
    type: 'live tool',
    href: '/swarm-gen.html',
    color: 'var(--melon)',
    text:
      'Ein Partikelschwarm-Tool, bei dem erst die visuelle Konfiguration entsteht und daraus anschliessend ein exportierbarer Standalone-Code generiert wird.',
    tags: ['canvas', 'particles', 'export'],
  },
  {
    id: 'slop-o-matic',
    label: 'tool 02',
    title: 'Slop-O-Matic',
    type: 'ad machine',
    href: '/slop-o-matic.html',
    color: 'var(--lime)',
    text:
      'Ein Generator fuer bewusst schlechtes KI-Marketing, der Plattformsprache, Ueberreizung und Werbeversprechen zu kontrolliertem AI Slop verdichtet.',
    tags: ['slop', 'spam', 'campaign'],
  },
  {
    id: 'copy-machine',
    label: 'tool 03',
    title: 'Copy Machine',
    type: 'image engine',
    href: '/copy-machine.html',
    color: 'var(--sky)',
    text:
      'Ein Bildtool fuer Verzerrung, Noise und mediale Abnutzung, das Oberflaechen nicht verschoenert, sondern absichtlich unter Druck setzt.',
    tags: ['distortion', 'print', 'noise'],
  },
  {
    id: 'flexible-visual-systems',
    label: 'tool 04',
    title: 'Flexible Visual Systems',
    type: 'shape tool',
    href: '/flexible-visual-systems.html',
    color: 'var(--violet)',
    text:
      'Ein Grid-Drawer fuer variable Formen, Container und Masken, die nicht als starres Asset, sondern jedes Mal neu aus dem Layout entwickelt werden.',
    tags: ['grid', 'shapes', 'systems'],
  },
  {
    id: 'blob-builder',
    label: 'tool 05',
    title: 'Blob Builder',
    type: 'mask tool',
    href: '/grid-blob.html',
    color: 'var(--cream)',
    text:
      'Ein punktbasiertes Tool fuer organische Masken und Verbindungskorper, mit denen sich Beziehungen, Gegenueberstellungen und Spannungen sichtbar machen lassen.',
    tags: ['blob', 'mask', 'relations'],
  },
  {
    id: 'i-find-the-luck',
    label: 'tool 06',
    title: 'I find the Luck 2.0',
    type: 'question machine',
    href: '/version-3.html',
    color: 'var(--coral)',
    text:
      'Ein Tool nach der Logik von Fischli und Weiss: Es stellt dem Internet fortlaufend kurze, eigensinnige Fragen und laesst sie automatisch durch Suchtreffer, Text- und Bildfragmente beantworten.',
    tags: ['questions', 'internet', 'answers'],
  },
  {
    id: 'logo-generator',
    label: 'tool 07',
    title: 'Generative Logo',
    type: 'logo tool',
    href: '/logo-generator.html',
    color: 'var(--lime)',
    text:
      'Ein Generator fuer flexible visuelle Logos und Muster, der modulare Zeichen, Farbsysteme und manuelle Eingriffe zu variablen Markenformen kombiniert.',
    tags: ['logo', 'identity', 'generator'],
  },
  {
    id: 'x-font-lab',
    label: 'tool 08',
    title: 'X-Font Lab',
    type: 'font tool',
    href: '/x-font-lab.html',
    color: 'var(--melon)',
    text:
      'Ein webbasiertes Schriftlabor, das aus mathematischen Skeletten und generativen Algorithmen in Echtzeit neue OpenType-Fonts erzeugt und direkt als .otf exportiert.',
    tags: ['font', 'otf', 'generator'],
  },
];

const defaultState = {
  prompt: '',
  status: 'Standardansicht aktiv.',
  diagnostic: '',
  source: 'default',
  isLoading: false,
  spec: {
    title: 'Tool Gallery',
    kicker: 'dynamic tool overview',
    intro:
      'Diese Startseite kann per Prompt neu art-directed werden. Die Struktur bleibt stabil, die visuelle Haltung verschiebt sich ueber Typografie, Raster und Oberflaechen.',
    layoutMode: 'editorial',
    surfaceMode: 'index',
    paletteMode: 'paper',
    fontMode: 'display',
    emphasisIds: ['swarm-gen', 'i-find-the-luck'],
    order: baseTools.map((tool) => tool.id),
    cardText: {},
    cardTags: {},
  },
};

const state = { ...defaultState };

initConceptLayer('toolgallery');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractJson(text = '') {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Keine JSON-Antwort erhalten.');
  }
  return raw.slice(start, end + 1);
}

function normalizeSpec(input = {}) {
  const fallbackOrder = baseTools.map((tool) => tool.id);
  const safeOrder = Array.isArray(input.order)
    ? [...new Set(input.order.filter((id) => fallbackOrder.includes(id)))]
    : [];
  const missingIds = fallbackOrder.filter((id) => !safeOrder.includes(id));
  const layoutModes = ['editorial', 'ledger', 'atlas'];
  const surfaceModes = ['index', 'stack', 'dense'];
  const paletteModes = ['paper', 'mono', 'signal', 'cold', 'warm'];
  const fontModes = ['display', 'mono', 'editorial', 'poster'];

  return {
    title: input.title || defaultState.spec.title,
    kicker: input.kicker || defaultState.spec.kicker,
    intro: input.intro || defaultState.spec.intro,
    layoutMode: layoutModes.includes(input.layoutMode) ? input.layoutMode : defaultState.spec.layoutMode,
    surfaceMode: surfaceModes.includes(input.surfaceMode) ? input.surfaceMode : defaultState.spec.surfaceMode,
    paletteMode: paletteModes.includes(input.paletteMode) ? input.paletteMode : defaultState.spec.paletteMode,
    fontMode: fontModes.includes(input.fontMode) ? input.fontMode : defaultState.spec.fontMode,
    emphasisIds: Array.isArray(input.emphasisIds)
      ? input.emphasisIds.filter((id) => fallbackOrder.includes(id))
      : defaultState.spec.emphasisIds,
    order: [...safeOrder, ...missingIds],
    cardText: typeof input.cardText === 'object' && input.cardText ? input.cardText : {},
    cardTags: typeof input.cardTags === 'object' && input.cardTags ? input.cardTags : {},
  };
}

function scoreMatches(text, entries) {
  return entries.reduce((total, entry) => {
    const keywords = Array.isArray(entry.keywords) ? entry.keywords : [];
    const hitCount = keywords.reduce((hits, keyword) => hits + (text.includes(keyword) ? 1 : 0), 0);
    return total + hitCount * (entry.weight || 1);
  }, 0);
}

function pickBestMode(text, candidates, fallbackKey) {
  let bestKey = fallbackKey;
  let bestScore = -1;

  Object.entries(candidates).forEach(([key, config]) => {
    const score = scoreMatches(text, config);
    if (score > bestScore) {
      bestKey = key;
      bestScore = score;
    }
  });

  return bestKey;
}

function derivePromptSpec(prompt = '') {
  const text = prompt.toLowerCase();
  const spec = structuredClone(defaultState.spec);

  spec.layoutMode = pickBestMode(
    text,
    {
      atlas: [
        { keywords: ['catalog', 'katalog', 'verzeichnis', 'index', 'sammlung'], weight: 3 },
        { keywords: ['ruhig', 'ordentlich', 'html', 'editor'], weight: 2 },
      ],
      ledger: [
        { keywords: ['technisch', 'systemisch', 'sachlich', 'nuechtern', 'tool'], weight: 3 },
        { keywords: ['interface', 'kontrollraum', 'cold'], weight: 2 },
      ],
      editorial: [
        { keywords: ['editorial', 'magazin', 'typografisch', 'essay'], weight: 3 },
        { keywords: ['papier', 'textlastig', 'ruhig'], weight: 2 },
      ],
    },
    defaultState.spec.layoutMode,
  );

  spec.surfaceMode = pickBestMode(
    text,
    {
      dense: [
        { keywords: ['dicht', 'kompakt', 'viel', 'eng'], weight: 2 },
        { keywords: ['index', 'liste', 'tabellarisch'], weight: 2 },
      ],
      stack: [
        { keywords: ['gross', 'headline', 'poster', 'plakat'], weight: 3 },
        { keywords: ['markant', 'hero'], weight: 2 },
      ],
      index: [
        { keywords: ['html', 'ruhig', 'schlank', 'wenig', 'einfach'], weight: 2 },
        { keywords: ['editorial', 'sachlich'], weight: 1 },
      ],
    },
    defaultState.spec.surfaceMode,
  );

  spec.paletteMode = pickBestMode(
    text,
    {
      mono: [
        { keywords: ['mono', 'schwarzweiss', 'grau', 'roh'], weight: 3 },
        { keywords: ['html', 'plain'], weight: 2 },
      ],
      signal: [
        { keywords: ['signal', 'acid', 'grell', 'leuchtend'], weight: 3 },
        { keywords: ['highlight', 'marker'], weight: 2 },
      ],
      cold: [
        { keywords: ['kalt', 'technisch', 'blau'], weight: 3 },
        { keywords: ['klinisch', 'clean'], weight: 2 },
      ],
      warm: [
        { keywords: ['warm', 'beige', 'papier', 'weich'], weight: 3 },
        { keywords: ['editorial', 'ruhig'], weight: 2 },
      ],
      paper: [{ keywords: ['hell', 'weiss', 'minimal'], weight: 1 }],
    },
    defaultState.spec.paletteMode,
  );

  spec.fontMode = pickBestMode(
    text,
    {
      mono: [
        { keywords: ['mono', 'terminal', 'code', 'html'], weight: 3 },
        { keywords: ['nuechtern', 'technisch'], weight: 2 },
      ],
      editorial: [
        { keywords: ['editorial', 'serif', 'magazin', 'essay'], weight: 3 },
        { keywords: ['ruhig', 'text'], weight: 2 },
      ],
      poster: [
        { keywords: ['poster', 'headline', 'gross'], weight: 3 },
        { keywords: ['markant', 'plakat'], weight: 2 },
      ],
      display: [{ keywords: ['grafisch', 'expressiv'], weight: 2 }],
    },
    defaultState.spec.fontMode,
  );

  spec.intro = prompt || spec.intro;

  if (text.includes('technisch') || text.includes('sachlich')) {
    spec.title = 'Tool Index';
    spec.kicker = 'system overview';
  } else if (text.includes('editorial') || text.includes('papier')) {
    spec.title = 'Tool Reader';
    spec.kicker = 'editorial front';
  } else if (text.includes('html') || text.includes('plain')) {
    spec.title = 'Tool Directory';
    spec.kicker = 'slim html front';
  }

  const emphasis = [];
  if (text.includes('partikel') || text.includes('schwarm') || text.includes('canvas')) emphasis.push('swarm-gen');
  if (text.includes('internet') || text.includes('frage') || text.includes('antwort')) emphasis.push('i-find-the-luck');
  if (text.includes('bild') || text.includes('noise')) emphasis.push('copy-machine');
  if (text.includes('logo') || text.includes('marke')) emphasis.push('logo-generator');
  if (text.includes('schrift') || text.includes('font') || text.includes('typografie')) emphasis.push('x-font-lab');
  if (text.includes('system') || text.includes('grid') || text.includes('form')) emphasis.push('flexible-visual-systems');
  spec.emphasisIds = emphasis.length ? [...new Set(emphasis)] : defaultState.spec.emphasisIds;

  const prioritized = [...spec.emphasisIds];
  spec.order = [...prioritized, ...baseTools.map((tool) => tool.id).filter((id) => !prioritized.includes(id))];

  spec.cardText = text.includes('sachlich')
    ? {
        'swarm-gen': 'Partikelsystem mit Exportpfad.',
        'slop-o-matic': 'Generator fuer kontrollierten Werbelaerm.',
        'copy-machine': 'Bildstoerung und Oberflaechenverschleiss.',
        'flexible-visual-systems': 'Variables Form- und Rastersystem.',
        'blob-builder': 'Organische Masken und Verbindungskoerper.',
        'i-find-the-luck': 'Frage-Antwort-Maschine fuer Internetfragmente.',
        'logo-generator': 'Variables Logosystem.',
        'x-font-lab': 'Generatives Fontlabor mit OTF-Export.',
      }
    : {};

  spec.cardTags = text.includes('html')
    ? Object.fromEntries(baseTools.map((tool) => [tool.id, [tool.id, tool.type.replace(/\s+/g, '-'), 'open']]))
    : {};

  return spec;
}

function localPromptFallback(prompt = '') {
  return derivePromptSpec(prompt);
}

async function diagnoseProxy() {
  try {
    const response = await fetch(proxyUrl);
    const result = await response.json();
    if (!response.ok) {
      state.diagnostic = 'KI-Server nicht erreichbar.';
      return;
    }
    state.diagnostic = result?.hasApiKey
      ? 'KI-Art-Direction online.'
      : 'KI-Server online, aber ohne API-Key. Lokaler Fallback aktiv.';
  } catch {
    state.diagnostic = 'Netlify Function nicht erreichbar. Lokaler Fallback aktiv.';
  }
}

async function requestArtDirection(prompt) {
  const systemInstruction = `Du bist Art Director fuer die Startseite einer Tool Gallery. Antworte nur als JSON.
Schema:
{
  "title": "kurzer Titel",
  "kicker": "kurzer Kicker",
  "intro": "promptnah, knapp, sachlich",
  "layoutMode": "editorial|ledger|atlas",
  "surfaceMode": "index|stack|dense",
  "paletteMode": "paper|mono|signal|cold|warm",
  "fontMode": "display|mono|editorial|poster",
  "emphasisIds": ["swarm-gen"],
  "order": ["swarm-gen","slop-o-matic","copy-machine","flexible-visual-systems","blob-builder","i-find-the-luck","logo-generator","x-font-lab"],
  "cardText": {
    "swarm-gen": "kurzer Text"
  },
  "cardTags": {
    "swarm-gen": ["tag1","tag2","tag3"]
  }
}
Regeln:
- Nur IDs aus dieser Liste verwenden: swarm-gen, slop-o-matic, copy-machine, flexible-visual-systems, blob-builder, i-find-the-luck, logo-generator, x-font-lab
- Keine neuen Tools erfinden
- HTML-Struktur bleibt schlank. Variiere ueber Typografie, Dichte, Rhythmus, Hervorhebung und Ton.
- Nicht wie eine App mit Kacheln denken, eher wie Startseite, Index, Reader oder Directory.
- Keine Erklaerungen ausserhalb des JSON`;

  const toolSummary = baseTools
    .map((tool) => `${tool.id}: ${tool.title} / ${tool.type} / ${tool.text}`)
    .join('\n');

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `Prompt des Users: ${prompt}\n\nVerfuegbare Tools:\n${toolSummary}`,
      systemInstruction,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.error || 'KI-Anfrage fehlgeschlagen.');
  }

  return normalizeSpec(JSON.parse(extractJson(result?.text || '')));
}

function getToolsFromSpec(spec) {
  const byId = new Map(baseTools.map((tool) => [tool.id, tool]));
  return spec.order.map((id) => {
    const base = byId.get(id);
    const overrideTags = Array.isArray(spec.cardTags?.[id]) && spec.cardTags[id].length ? spec.cardTags[id] : base.tags;
    return {
      ...base,
      text: spec.cardText?.[id] || base.text,
      tags: overrideTags,
      emphasized: spec.emphasisIds.includes(id),
    };
  });
}

function extractPromptTokens(prompt = '') {
  return [...new Set(
    String(prompt)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .split(/\s+/)
      .filter((part) => part.length > 3),
  )].slice(0, 6);
}

function buildPromptContext(spec, prompt = '') {
  const tokens = extractPromptTokens(prompt);
  return {
    short: prompt || 'default view',
    tokenMarkup: tokens.map((token) => `<span>${escapeHtml(token)}</span>`).join(''),
    modeLabel: `${spec.layoutMode} / ${spec.surfaceMode} / ${spec.paletteMode} / ${spec.fontMode}`,
  };
}

function renderToolEntry(tool, index) {
  const tagMarkup = tool.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  return `
    <a class="tool-entry tool-entry--${(index % 6) + 1}${tool.emphasized ? ' is-emphasized' : ''}" style="--tool-accent:${tool.color};" href="${escapeHtml(tool.href)}">
      <div class="tool-entry__index">
        <span>${escapeHtml(tool.label)}</span>
      </div>
      <div class="tool-entry__main">
        <p class="tool-entry__type">${escapeHtml(tool.type)}</p>
        <h2>${escapeHtml(tool.title)}</h2>
        <p class="tool-entry__text">${escapeHtml(tool.text)}</p>
      </div>
      <div class="tool-entry__meta">
        <div class="tool-entry__tags">${tagMarkup}</div>
        <span class="tool-entry__cta">open app</span>
      </div>
    </a>
  `;
}

function renderGallery(spec, tools, context) {
  return `
    <section class="v5-stage">
      <div class="v5-index">
        <div class="v5-index__head">
          <strong>prompt relation</strong>
          <p>${escapeHtml(context.short)}</p>
          <small>${escapeHtml(context.modeLabel)}</small>
          <div class="v5-prompt-tags">${context.tokenMarkup}</div>
        </div>
        <div class="v5-index__list">
          ${tools.map((tool, index) => renderToolEntry(tool, index)).join('')}
        </div>
      </div>
    </section>
  `;
}

function render() {
  const spec = state.spec;
  const tools = getToolsFromSpec(spec);
  const context = buildPromptContext(spec, state.prompt);
  const statusClass = state.isLoading ? 'is-loading' : '';
  const introText = state.prompt || spec.intro;

  app.className = `v5-shell layout-${spec.layoutMode} surface-${spec.surfaceMode} palette-${spec.paletteMode} font-${spec.fontMode} ${statusClass}`;
  app.innerHTML = `
    <section class="v5-hero">
      <div class="v5-hero__copy">
        <p class="v5-kicker">${escapeHtml(spec.kicker)}</p>
        <h1>${escapeHtml(spec.title)}</h1>
        <p class="v5-intro">${escapeHtml(introText)}</p>
        <div class="v5-status">
          <p>${escapeHtml(state.status)}</p>
          <p>${escapeHtml(state.diagnostic)}</p>
        </div>
      </div>

      <form class="v5-form" id="v5-ai-form">
        <label for="v5-prompt">Prompt</label>
        <textarea id="v5-prompt" name="prompt" rows="4" placeholder="z.B. ruhig, html-artig, technischer, editoriale Startseite, weniger App, mehr Directory">${escapeHtml(state.prompt)}</textarea>
        <div class="v5-form__actions">
          <button type="submit">${state.isLoading ? 'thinking...' : 'apply prompt'}</button>
          <button type="button" id="v5-reset">reset</button>
        </div>
        <p class="v5-form__meta">source: ${escapeHtml(state.source)} / ${escapeHtml(spec.layoutMode)} / ${escapeHtml(spec.surfaceMode)} / ${escapeHtml(spec.fontMode)} / ${escapeHtml(spec.paletteMode)}</p>
      </form>
    </section>

    ${renderGallery(spec, tools, context)}
  `;

  const form = document.getElementById('v5-ai-form');
  const resetBtn = document.getElementById('v5-reset');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const prompt = String(formData.get('prompt') || '').trim();
    if (!prompt) return;

    state.prompt = prompt;
    state.isLoading = true;
    state.status = 'Neuberechnung laeuft.';
    render();

    try {
      state.spec = await requestArtDirection(prompt);
      state.status = 'Prompt angewendet.';
      state.source = 'gemini';
    } catch (error) {
      state.spec = normalizeSpec(localPromptFallback(prompt));
      state.status = `${error.message} Fallback aktiv.`;
      state.source = 'fallback';
    } finally {
      state.isLoading = false;
      render();
    }
  });

  resetBtn?.addEventListener('click', () => {
    state.prompt = '';
    state.spec = structuredClone(defaultState.spec);
    state.status = 'Standardansicht aktiv.';
    state.source = 'default';
    render();
  });
}

async function initGallery() {
  await diagnoseProxy();
  render();
}

initGallery().catch(() => {
  state.diagnostic = 'KI-Initialisierung fehlgeschlagen. Lokaler Fallback aktiv.';
  render();
});
