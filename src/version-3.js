import './version-3.css';

const app = document.getElementById('v3-app');

const sceneModes = ['tko', 'essay', 'market'];
const typeModes = ['serif', 'mono', 'pixel', 'bubble', 'wide', 'display', 'courier', 'xerox'];
const fontModes = [
  'abril',
  'alfa',
  'anton',
  'archivo',
  'archivonarrow',
  'azeret',
  'barlow',
  'bebas',
  'bricolage',
  'bungee2',
  'chivo',
  'cormorant',
  'courierprime',
  'crimson',
  'dmmono',
  'dotgothic',
  'ebgaramond',
  'fira',
  'fragment',
  'fraunces',
  'ibmmono',
  'ibmsans',
  'ibmserif',
  'instrument',
  'intertight',
  'jetbrains',
  'jost',
  'kanit',
  'league',
  'lexend',
  'libre',
  'lilita',
  'manrope',
  'micro',
  'monoton',
  'newsreader',
  'orbitron',
  'oswald',
  'outfit',
  'oxanium',
  'marker',
  'pixelify',
  'playfair',
  'jakarta',
  'pressstart',
  'rubikglitch',
  'rubikmono',
  'silkscreen2',
  'sixcaps',
  'sora',
  'spacegrotesk',
  'spacemono',
  'specialelite',
  'synemono',
  'teko',
  'ultra',
  'unbounded',
  'vt323',
  'worksans',
  'zendots',
];
const imageModes = ['plain', 'poster', 'washed', 'tilted'];
const backdropModes = ['acid', 'chrome', 'wire', 'night', 'paper', 'terminal', 'sunburn'];
const questionModes = ['inline', 'popup95', 'popupGlass', 'banner', 'corner', 'error', 'footer', 'micro', 'line', 'strip', 'loose'];
const replyModes = ['default', 'stacked', 'overlay', 'neon', 'bare'];
const scaleModes = ['tiny', 'compact', 'regular', 'large', 'giant'];
const surfaceModes = ['drift', 'poster', 'flood', 'desktop', 'ticker'];
const recentStoreKey = 'i-find-the-luck-v2';
const giphySessionKey = 'i-find-the-luck-giphy-session';
const requestSeedKey = 'i-find-the-luck-request-seed';
const stickerLabels = [
  'new',
  'soft launch',
  'beta feelings',
  'live soon',
  'hot patch',
  'trust me',
  'public draft',
  'mood sync',
  'click here',
  'prime signal',
  'open tab',
  'urgent maybe',
];

const questionBank = unique(
  [
    q`findet mich das glueck
wenn ich nichts mehr suche`,
    q`findet mich das design
oder finde ich es noch`,
    q`ist das netz wirklich schon tot`,
    q`redet gerade ein bot mit mir`,
    q`kann ich die algorithmische schleife
jemals verlassen`,
    q`kann man noch irgendeiner
online-information vertrauen`,
    q`was hat mein klick
mit dem krieg zu tun`,
    q`wer arbeitet noch
wenn alles arbeitet`,
    q`ist intuition
nur ein schlecht erklaerter prompt`,
    q`wer entscheidet
wenn systeme entscheiden`,
    q`ist kontrolle
eine illusion`,
    q`why does everything load
but nothing arrives`,
    q`is silence
a missing feature`,
    q`am i still choosing
or just confirming`,
    q`can something be meaningful
if it was suggested`,
    q`do i trust a thought
that came too fast`,
    q`is speed
a form of control`,
    q`what happens
to unused ideas`,
    q`do they disappear
or wait`,
    q`what is lost
when everything works
and why does it feel
like nothing happened`,
    q`why does everything feel real
only after it starts`,
    q`is failure
a faster teacher`,
    q`why does everything look better
from the front`,
    q`what happens
behind the house`,
    q`is something unfinished
already something`,
    q`can a mistake
be a beginning`,
    q`why does honesty
look like failure`,
    q`why do i separate
process and result`,
    q`can something stay
in between`,
    q`is waiting
part of making`,
    q`can something exist
without being shown`,
    q`bin ich noch der macher
oder schon der dirigent`,
    q`weiss mein koerper etwas
das der algorithmus niemals lernen kann`,
    q`ertrinken wir bald alle
im meer der gleichheit`,
    q`ist ein prompt
schon ein gedanke`,
    q`wer hat eigentlich
den ersten strich gemacht
ich oder die maschine`,
    q`verlerne ich das traeumen
wenn mir alles sofort vorgerechnet wird`,
    q`ist die halluzination der ki
kreativer als meine eigene wahrheit`,
    q`muss ich von nun an
immer misstrauisch bleiben`,
    q`hat die maschine eigentlich
einen guten geschmack`,
    q`bin ich mitschuldig
wenn der algorithmus vorurteile hat`,
    q`ist ein technisch perfektes bild
ueberhaupt noch interessant`,
    q`kann ein computer wissen
wie sich ein rauer holztisch anfuehlt`,
    q`wird absichtliche fehler machen
bald unser groesstes talent`,
    q`reicht mein bauchgefuehl
um zu beweisen
dass ich ein mensch bin`,
    q`muss ich jetzt lernen
fuer eine maschine zu gestalten
damit sie bei mir einkauft`,
    q`bin ich nur noch
der schiedsrichter meiner eigenen ideen`,
    q`retten wir uns
in den analogen raum
weil es dort so schoen anstrengend ist`,
    q`was passiert
wenn die ki meine kritzeleien
nicht versteht`,
    q`ist das aussortieren von ideen
ploetzlich schwieriger
als das erschaffen`,
    q`erzaehle ich meine geschichten
in zukunft fuer algorithmen
oder fuer herzen`,
    q`produziere ich eigentlich schon slop
ohne es zu merken`,
    q`kann ich den zielraum definieren
wenn ich selbst nicht genau weiss
was ich suche`,
    q`muss ich die welt erst
in daten uebersetzen
bevor ich sie gestalten darf`,
    q`werde ich in zehn jahren
noch fuer das bezahlt
was ich heute so gerne tue`,
    q`ist anpassungsfaehigkeit jetzt
mein wichtigster charakterzug`,
    q`kann ich eine ki so trainieren
dass sie meinen eigenen fingerabdruck
hinterlaesst`,
    q`reicht es aus
einfach nur die besseren fragen zu stellen`,
    q`muessen wir unsere perfekten entwuerfe
zerstoeren um der maschinellen beliebigkeit
zu entkommen`,
    q`ist das werkzeug jetzt
mein partner oder mein konkurrent`,
    q`findet mich der gute einfall noch
wenn die maschine schon tausend vor mir hatte`,
  ].filter(Boolean),
);

const tagMatchers = {
  internet: /(internet|netz|feed|website|tab|browser|online|post|account|social|comment|bot|rss|search)/i,
  labor: /(arbeit|workflow|paid|job|client|schule|teacher|deadline|studio|bezahlt)/i,
  design: /(design|gestaltung|bild|prompt|idee|strich|kritzeleien|taste|style|entwurf|kunst)/i,
  control: /(algorithmus|algorithm|system|kontrolle|control|ki|ai|automation|entscheiden|steuern|surveillance)/i,
  body: /(koerper|bauchgefuehl|mensch|holztisch|herzen|analog|traeumen)/i,
};

const wikiSearchMap = {
  generic: ['internet', 'artificial intelligence', 'design', 'archive'],
  internet: ['world wide web', 'internet archive', 'social media', 'search engine'],
  labor: ['automation', 'labor', 'gig economy', 'creative work'],
  design: ['graphic design', 'net art', 'digital art', 'glitch art'],
  control: ['algorithm', 'surveillance', 'machine learning', 'data center'],
  body: ['touch', 'drawing', 'craft', 'human body'],
};

const commonsSearchMap = {
  generic: ['computer screen', 'internet cafe', 'television static', 'digital archive'],
  internet: ['internet cafe', 'web browser', 'search engine', 'computer terminal'],
  labor: ['office computer', 'creative workspace', 'empty desk', 'control room'],
  design: ['glitch art', 'screen print', 'drawing hand', 'monitor'],
  control: ['surveillance camera', 'control panel', 'circuit board', 'security monitor'],
  body: ['hand drawing', 'wooden table', 'craft workshop', 'shadow silhouette'],
};

const shellMarkup = `
  <div class="net-shell" id="net-shell">
    <section class="question-stream" id="question-stream" aria-live="polite"></section>
    <section class="answer-stream" id="answer-stream" aria-live="polite"></section>
    <aside class="history-stream" id="history-stream"></aside>
    <nav class="soft-nav">
      <button type="button" id="continue-button">continue</button>
      <button type="button" id="listen-button">listen again</button>
      <a href="/">back to index</a>
    </nav>
  </div>
`;

app.innerHTML = shellMarkup;

const questionStream = document.getElementById('question-stream');
const answerStream = document.getElementById('answer-stream');
const historyStream = document.getElementById('history-stream');
const continueButton = document.getElementById('continue-button');
const listenButton = document.getElementById('listen-button');
const netShell = document.getElementById('net-shell');

const state = {
  currentQuestion: '',
  history: [],
  pageCount: 0,
  runId: 0,
  scene: 'tko',
  questionTypeMode: 'serif',
  replyTypeMode: 'mono',
  questionFontMode: 'instrument',
  replyFontMode: 'ibmmono',
  imageMode: 'plain',
  backdropMode: 'acid',
  questionMode: 'inline',
  replyMode: 'default',
  scaleMode: 'regular',
  surfaceMode: 'drift',
  recentImages: [],
  recentGifIds: [],
  recentFragments: [],
  questionPlacementStyle: '',
  questionTextStyle: '',
  replyTextStyle: '',
  replyLayout: null,
  imageMissingMode: 'error',
  imageMissingTone: '',
  questionShellStyle: '',
  questionNodeStyle: '',
  questionLabelStyle: '',
  answerStreamStyle: '',
  questionFrameMode: 'auto',
  mediaFrameMode: 'framed',
};

function getGiphySessionId() {
  const existing = sessionStorage.getItem(giphySessionKey);
  if (existing) return existing;
  const created = `rid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  sessionStorage.setItem(giphySessionKey, created);
  return created;
}

function nextRequestSeed() {
  const next = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
  sessionStorage.setItem(requestSeedKey, next);
  return next;
}

function q(strings, ...values) {
  return normalizeQuestion(String.raw({ raw: strings }, ...values));
}

function normalizeQuestion(value = '') {
  const normalized = value
    .replace(/\uFFFC/g, '')
    .replace(/[“”]/g, '')
    .replace(/\r/g, '')
    .replace(/[.!]+$/g, '')
    .trim()
    .toLowerCase();

  if (!normalized) return '';
  return normalized.endsWith('?') ? normalized : `${normalized}?`;
}

function unique(items = []) {
  return [...new Set(items)];
}

function pick(items = []) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeKey(value = '') {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[?#].*$/g, '')
    .replace(/\s+/g, ' ');
}

function rememberRecent(bucket, value, limit = 12) {
  const key = normalizeKey(value);
  if (!key) return;
  state[bucket] = [key, ...state[bucket].filter((entry) => entry !== key)].slice(0, limit);
  sessionStorage.setItem(
    recentStoreKey,
    JSON.stringify({
      recentImages: state.recentImages,
      recentGifIds: state.recentGifIds,
      recentFragments: state.recentFragments,
    }),
  );
}

function hydrateRecent() {
  try {
    const raw = sessionStorage.getItem(recentStoreKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.recentImages = Array.isArray(parsed.recentImages) ? parsed.recentImages.slice(0, 12) : [];
    state.recentGifIds = Array.isArray(parsed.recentGifIds) ? parsed.recentGifIds.slice(0, 32) : [];
    state.recentFragments = Array.isArray(parsed.recentFragments) ? parsed.recentFragments.slice(0, 18) : [];
  } catch {
    state.recentImages = [];
    state.recentGifIds = [];
    state.recentFragments = [];
  }
}

function pickAvoidingRecent(items = [], keyFn, recentBucket, fallbackItem = null) {
  if (!items.length) return fallbackItem;

  const normalizedRecent = new Set(state[recentBucket] || []);
  const fresh = items.filter((item) => !normalizedRecent.has(normalizeKey(keyFn(item))));
  const candidatePool = fresh.length ? fresh : items;
  return pick(candidatePool) || fallbackItem;
}

function pickScene() {
  const candidates = sceneModes.filter((scene) => scene !== state.scene);
  return pick(candidates.length ? candidates : sceneModes) || 'tko';
}

function pickTypeMode(scene) {
  if (scene === 'essay') return pick(['pixel', 'mono', 'wide', 'xerox']) || 'pixel';
  if (scene === 'market') return pick(['bubble', 'wide', 'display', 'courier']) || 'bubble';
  return pick(['serif', 'mono', 'wide', 'display', 'courier', 'xerox']) || 'serif';
}

function pickFontMode() {
  return pick(fontModes) || 'instrument';
}

function pickImageMode() {
  return pick(imageModes) || 'plain';
}

function pickBackdropMode() {
  const candidates = backdropModes.filter((mode) => mode !== state.backdropMode);
  return pick(candidates.length ? candidates : backdropModes) || 'acid';
}

function pickQuestionMode(scene) {
  if (scene === 'tko') return pick(['line', 'line', 'inline', 'inline', 'loose', 'corner']) || 'line';
  if (scene === 'market') return pick(['line', 'line', 'inline', 'banner', 'strip']) || 'line';
  return pick(['line', 'line', 'inline', 'inline', 'loose', 'strip']) || 'line';
}

function pickReplyMode(scene) {
  if (scene === 'market') return pick(['bare', 'default', 'bare']) || 'bare';
  if (scene === 'essay') return pick(['bare', 'stacked', 'default']) || 'bare';
  return pick(['bare', 'default', 'bare']) || 'bare';
}

function pickScaleMode() {
  return pick(['tiny', 'compact', 'compact', 'regular', 'regular', 'large']) || 'compact';
}

function pickSurfaceMode() {
  return 'drift';
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randInt(min, max) {
  return Math.round(rand(min, max));
}

function hsl(h, s, l, a = 1) {
  return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a})`;
}

function buildBackdropVisuals() {
  const pageNumber = Math.max(1, state.pageCount || 1);
  const wantsGradient = pageNumber % 20 === 0;
  const wantsFlatColor = !wantsGradient && pageNumber % 10 === 0;
  const wantsBackdrop = wantsFlatColor || wantsGradient;

  if (!wantsBackdrop) {
    return {
      bodyBackground: '#ffffff',
      beforeBackground: 'none',
      afterBackground: 'none',
      beforeOpacity: '0',
      afterOpacity: '0',
      beforeBlend: 'normal',
      afterBlend: 'normal',
      ink: '#111111',
      labelInk: 'rgba(0,0,0,0.58)',
      noteInk: 'rgba(0,0,0,0.56)',
      metaStripBg: '#ffffff',
      metaStripBorder: 'rgba(0,0,0,0.1)',
      questionBannerBg: '#ffffff',
      questionBannerInk: '#111111',
      glassPanelBg: 'transparent',
      glassPanelBorder: 'rgba(0,0,0,0.12)',
      glassPanelShadow: 'none',
      errorWindowBg: '#ffffff',
      errorWindowShadow: 'none',
      replyOverlayBg: 'transparent',
      replyNeonBg: 'transparent',
      replyPosterBg: 'transparent',
      replyFloodBg: 'transparent',
      replyDesktopBg: 'transparent',
      tickerInk: '#111111',
      tickerBarBg: '#ffffff',
      replyTextDefault: 'rgba(0,0,0,0.9)',
      noiseOpacity: '0',
      scanlinesOpacity: '0',
      scanlinesBackground: 'none',
      glitchTopOpacity: '0',
      glitchBottomOpacity: '0',
      glitchTopBg: 'none',
      glitchBottomBg: 'none',
    };
  }

  if (wantsFlatColor) {
    const flatPalette = pick([
      { bg: '#ffea00', ink: '#111111' },
      { bg: '#ff3b30', ink: '#ffffff' },
      { bg: '#0057ff', ink: '#ffffff' },
      { bg: '#00c853', ink: '#111111' },
    ]) || { bg: '#ffea00', ink: '#111111' };

    return {
      bodyBackground: flatPalette.bg,
      beforeBackground: 'none',
      afterBackground: 'none',
      beforeOpacity: '0',
      afterOpacity: '0',
      beforeBlend: 'normal',
      afterBlend: 'normal',
      ink: flatPalette.ink,
      labelInk: flatPalette.ink === '#ffffff' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.62)',
      noteInk: flatPalette.ink === '#ffffff' ? 'rgba(255,255,255,0.74)' : 'rgba(0,0,0,0.58)',
      metaStripBg: flatPalette.bg,
      metaStripBorder: flatPalette.ink === '#ffffff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.16)',
      questionBannerBg: flatPalette.bg,
      questionBannerInk: flatPalette.ink,
      glassPanelBg: 'transparent',
      glassPanelBorder: flatPalette.ink === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
      glassPanelShadow: 'none',
      errorWindowBg: flatPalette.bg,
      errorWindowShadow: 'none',
      replyOverlayBg: 'transparent',
      replyNeonBg: 'transparent',
      replyPosterBg: 'transparent',
      replyFloodBg: 'transparent',
      replyDesktopBg: 'transparent',
      tickerInk: flatPalette.ink,
      tickerBarBg: flatPalette.bg,
      replyTextDefault: flatPalette.ink,
      noiseOpacity: '0',
      scanlinesOpacity: '0',
      scanlinesBackground: 'none',
      glitchTopOpacity: '0',
      glitchBottomOpacity: '0',
      glitchTopBg: 'none',
      glitchBottomBg: 'none',
    };
  }

  if (wantsGradient) {
    const gradientBackground =
      pick([
        'linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #0057ff 40%, #0057ff 100%)',
        'linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #ff3b30 42%, #ff3b30 100%)',
        'linear-gradient(135deg, #ffffff 0%, #ffffff 38%, #ffea00 38%, #ffea00 100%)',
      ]) || 'linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #0057ff 40%, #0057ff 100%)';

    return {
      bodyBackground: gradientBackground,
      beforeBackground: 'none',
      afterBackground: 'none',
      beforeOpacity: '0',
      afterOpacity: '0',
      beforeBlend: 'normal',
      afterBlend: 'normal',
      ink: '#111111',
      labelInk: 'rgba(0,0,0,0.58)',
      noteInk: 'rgba(0,0,0,0.56)',
      metaStripBg: '#ffffff',
      metaStripBorder: 'rgba(0,0,0,0.1)',
      questionBannerBg: '#ffffff',
      questionBannerInk: '#111111',
      glassPanelBg: 'transparent',
      glassPanelBorder: 'rgba(0,0,0,0.12)',
      glassPanelShadow: 'none',
      errorWindowBg: '#ffffff',
      errorWindowShadow: 'none',
      replyOverlayBg: 'transparent',
      replyNeonBg: 'transparent',
      replyPosterBg: 'transparent',
      replyFloodBg: 'transparent',
      replyDesktopBg: 'transparent',
      tickerInk: '#111111',
      tickerBarBg: '#ffffff',
      replyTextDefault: 'rgba(0,0,0,0.9)',
      noiseOpacity: '0',
      scanlinesOpacity: '0',
      scanlinesBackground: 'none',
      glitchTopOpacity: '0',
      glitchBottomOpacity: '0',
      glitchTopBg: 'none',
      glitchBottomBg: 'none',
    };
  }

  const paletteName =
    pick([
      'toxic-office',
      'toxic-office',
      'cheap-neon',
      'cheap-neon',
      'broken-print',
      'broken-print',
      'surveillance',
      'alarm-floor',
      'paper-burn',
      'monitor-blue',
    ]) || 'toxic-office';
  const palette = {
    'toxic-office': {
      dark: false,
      ink: '#111111',
      label: 'rgba(0,0,0,0.64)',
      note: 'rgba(0,0,0,0.62)',
      colors: ['#efff1f', '#ff3d00', '#00a5ff', '#f5f0df', '#111111'],
      bg: [
        `linear-gradient(${randInt(90, 170)}deg, #f4efd8 0 18%, #e6ff3b 18% 36%, #111111 36% 44%, #00a5ff 44% 67%, #fffdf6 67% 100%)`,
        `radial-gradient(circle at ${randInt(10, 32)}% ${randInt(10, 24)}%, rgba(239,255,31,0.38), transparent 18%), radial-gradient(circle at ${randInt(
          60,
          86,
        )}% ${randInt(18, 38)}%, rgba(255,61,0,0.26), transparent 20%), linear-gradient(${randInt(120, 210)}deg, #fffdf6, #d7ff53 42%, #00b3ff 72%, #fff4d0)`,
      ],
    },
    'cheap-neon': {
      dark: true,
      ink: '#f7f2e8',
      label: 'rgba(247,242,232,0.74)',
      note: 'rgba(247,242,232,0.68)',
      colors: ['#0f0f12', '#ff00a8', '#00e5ff', '#c4ff00', '#ff5a1f'],
      bg: [
        `linear-gradient(${randInt(110, 220)}deg, #07070a, #1a0030 32%, #00181d 58%, #130505 100%)`,
        `radial-gradient(circle at ${randInt(12, 34)}% ${randInt(8, 26)}%, rgba(255,0,168,0.34), transparent 18%), radial-gradient(circle at ${randInt(
          62,
          88,
        )}% ${randInt(10, 32)}%, rgba(0,229,255,0.3), transparent 18%), radial-gradient(circle at ${randInt(26, 76)}% ${randInt(
          54,
          84,
        )}%, rgba(196,255,0,0.22), transparent 20%), linear-gradient(${randInt(130, 220)}deg, #060607, #14121f 48%, #05060d)`,
      ],
    },
    'broken-print': {
      dark: false,
      ink: '#120d09',
      label: 'rgba(18,13,9,0.72)',
      note: 'rgba(18,13,9,0.66)',
      colors: ['#f2ead6', '#cf2f12', '#002aff', '#18120e', '#f8d400'],
      bg: [
        `linear-gradient(${randInt(80, 150)}deg, #f2ead6 0 42%, #cf2f12 42% 52%, #f8d400 52% 64%, #002aff 64% 74%, #f6f1e2 74% 100%)`,
        `radial-gradient(circle at ${randInt(10, 32)}% ${randInt(10, 34)}%, rgba(207,47,18,0.26), transparent 16%), radial-gradient(circle at ${randInt(
          66,
          90,
        )}% ${randInt(48, 76)}%, rgba(0,42,255,0.18), transparent 18%), linear-gradient(${randInt(100, 190)}deg, #f6f1e2, #e8ddbf 54%, #ffef97 100%)`,
      ],
    },
    surveillance: {
      dark: true,
      ink: '#eef7ef',
      label: 'rgba(238,247,239,0.72)',
      note: 'rgba(238,247,239,0.66)',
      colors: ['#06110a', '#7bff8a', '#0b6bff', '#f94144', '#d5ff2f'],
      bg: [
        `linear-gradient(${randInt(100, 180)}deg, #04110b, #0c2f1b 42%, #091522 72%, #030807)`,
        `radial-gradient(circle at ${randInt(18, 34)}% ${randInt(10, 30)}%, rgba(123,255,138,0.28), transparent 18%), radial-gradient(circle at ${randInt(
          62,
          84,
        )}% ${randInt(14, 36)}%, rgba(11,107,255,0.24), transparent 20%), linear-gradient(${randInt(130, 210)}deg, #030807, #112d1a 52%, #081018)`,
      ],
    },
    'alarm-floor': {
      dark: false,
      ink: '#050505',
      label: 'rgba(5,5,5,0.72)',
      note: 'rgba(5,5,5,0.66)',
      colors: ['#fffef7', '#ffd400', '#ff2d20', '#111111', '#006dff'],
      bg: [
        `linear-gradient(${randInt(0, 180)}deg, #fffef7 0 30%, #ffd400 30% 54%, #111111 54% 60%, #ff2d20 60% 84%, #fff7c6 84% 100%)`,
        `repeating-linear-gradient(${pick([45, 90, 135]) || 45}deg, #fffef7 0 18px, #ffd400 18px 42px, #111111 42px 52px, #ff2d20 52px 82px)`,
      ],
    },
    'paper-burn': {
      dark: false,
      ink: '#18110d',
      label: 'rgba(24,17,13,0.7)',
      note: 'rgba(24,17,13,0.64)',
      colors: ['#f6ebd4', '#ff6a00', '#7a1d00', '#1b1715', '#ffe24f'],
      bg: [
        `linear-gradient(${randInt(100, 180)}deg, #f6ebd4 0 36%, #ff6a00 36% 58%, #7a1d00 58% 70%, #ffe24f 70% 88%, #f9f4e7 88% 100%)`,
        `radial-gradient(circle at ${randInt(16, 36)}% ${randInt(12, 28)}%, rgba(255,106,0,0.24), transparent 16%), radial-gradient(circle at ${randInt(
          60,
          84,
        )}% ${randInt(52, 80)}%, rgba(122,29,0,0.16), transparent 18%), linear-gradient(${randInt(120, 210)}deg, #f8f0df, #ffb120 56%, #f0d7ba)`,
      ],
    },
    'monitor-blue': {
      dark: true,
      ink: '#f3f7ff',
      label: 'rgba(243,247,255,0.74)',
      note: 'rgba(243,247,255,0.68)',
      colors: ['#040817', '#2b6dff', '#00b8ff', '#d7ff34', '#f5f7ff'],
      bg: [
        `linear-gradient(${randInt(120, 220)}deg, #030716, #0d1d48 44%, #08244f 72%, #02050c 100%)`,
        `radial-gradient(circle at ${randInt(18, 36)}% ${randInt(10, 24)}%, rgba(43,109,255,0.3), transparent 16%), radial-gradient(circle at ${randInt(
          62,
          86,
        )}% ${randInt(16, 30)}%, rgba(0,184,255,0.26), transparent 18%), linear-gradient(${randInt(130, 220)}deg, #02050c, #0f1f4c 48%, #04131d)`,
      ],
    },
  }[paletteName];

  const baseHue = randInt(0, 360);
  const accentHue = (baseHue + randInt(70, 180)) % 360;
  const thirdHue = (accentHue + randInt(90, 180)) % 360;
  const darkMood = palette.dark;
  const ink = palette.ink;
  const labelInk = palette.label;
  const noteInk = palette.note;
  const bodyBackground = pick(palette.bg) || palette.bg[0];
  const metaStripBg = darkMood
    ? `linear-gradient(90deg, rgba(8,8,10,0.82), ${hsl(baseHue, 80, 24, 0.62)})`
    : `linear-gradient(90deg, rgba(255,250,232,0.88), ${hsl(accentHue, 98, 52, 0.3)})`;

  const beforeModes = [
    `repeating-linear-gradient(${pick([0, 90, 135]) || 90}deg, rgba(0, 0, 0, ${darkMood ? 0.12 : 0.09}) 0, rgba(0, 0, 0, ${darkMood ? 0.12 : 0.09}) 1px, transparent 1px, transparent ${randInt(6, 18)}px)`,
    `repeating-linear-gradient(90deg, transparent 0, transparent ${randInt(12, 32)}px, rgba(255, 255, 255, ${darkMood ? 0.04 : 0.06}) ${randInt(12, 32)}px, rgba(255, 255, 255, ${darkMood ? 0.04 : 0.06}) ${randInt(13, 33)}px)`,
    `linear-gradient(${randInt(0, 180)}deg, transparent 0 38%, rgba(255,255,255,${darkMood ? 0.03 : 0.08}) 48%, transparent 60%)`,
    'none',
  ];

  const afterModes = [
    `radial-gradient(circle at ${randInt(12, 84)}% ${randInt(12, 84)}%, ${hsl(baseHue, 96, darkMood ? 62 : 48, darkMood ? 0.16 : 0.18)}, transparent ${randInt(10, 22)}%)`,
    `radial-gradient(circle at ${randInt(12, 84)}% ${randInt(12, 84)}%, ${hsl(accentHue, 96, darkMood ? 64 : 46, darkMood ? 0.14 : 0.16)}, transparent ${randInt(10, 22)}%)`,
    `linear-gradient(90deg, transparent 0 35%, ${hsl(thirdHue, 98, darkMood ? 62 : 52, darkMood ? 0.14 : 0.18)} 50%, transparent 65%)`,
    'none',
  ];

  const scanlineModes = [
    'none',
    'none',
    `repeating-linear-gradient(180deg, rgba(255,255,255,${darkMood ? 0.03 : 0.05}) 0, rgba(255,255,255,${darkMood ? 0.03 : 0.05}) 1px, transparent 1px, transparent ${randInt(7, 16)}px)`,
    `repeating-linear-gradient(${pick([0, 90]) || 90}deg, rgba(0,0,0,${darkMood ? 0.08 : 0.06}) 0, rgba(0,0,0,${darkMood ? 0.08 : 0.06}) 1px, transparent 1px, transparent ${randInt(10, 24)}px)`,
  ];
  const glitchModes = [
    'none',
    `linear-gradient(90deg, transparent, ${palette.colors[1]}, transparent)`,
    `linear-gradient(90deg, transparent, ${palette.colors[2]}, transparent)`,
    `linear-gradient(90deg, transparent 0 35%, ${palette.colors[3] || palette.colors[1]} 50%, transparent 65%)`,
  ];
  const scanlineBackground = pick(scanlineModes) || 'none';

  const surfaceByMode = {
    drift: {
      poster: `linear-gradient(${randInt(110, 190)}deg, ${palette.colors[0]}33, ${palette.colors[1]}22), ${darkMood ? 'rgba(10,10,12,0.22)' : 'rgba(255,250,240,0.18)'}`,
      flood: `linear-gradient(90deg, ${palette.colors[1]}66 0 20%, ${palette.colors[2]}55 20% 44%, ${palette.colors[3]}77 44% 66%, ${palette.colors[4]}44 66% 100%)`,
      desktop: darkMood ? 'rgba(12,14,18,0.68)' : 'rgba(255,250,238,0.74)',
      neon: `linear-gradient(${randInt(120, 220)}deg, ${palette.colors[1]}66, ${palette.colors[2]}55), ${darkMood ? '#111' : '#f7f1df'}`,
      overlay: darkMood ? 'rgba(14,14,18,0.34)' : 'rgba(255,248,236,0.24)',
    },
    poster: {
      poster: `linear-gradient(${randInt(80, 160)}deg, ${palette.colors[0]}44, ${palette.colors[1]}22), ${palette.colors[4]}22`,
      flood: `linear-gradient(${randInt(70, 130)}deg, ${palette.colors[1]}66, ${palette.colors[2]}55, ${palette.colors[4]}44)`,
      desktop: darkMood ? 'rgba(16,18,22,0.7)' : 'rgba(249,241,223,0.78)',
      neon: `linear-gradient(${randInt(110, 220)}deg, ${palette.colors[1]}77, ${palette.colors[2]}55), ${darkMood ? '#0f0f12' : '#141414'}`,
      overlay: darkMood ? 'rgba(8,8,10,0.38)' : 'rgba(255,255,255,0.14)',
    },
    flood: {
      poster: `linear-gradient(135deg, ${palette.colors[1]}55, ${palette.colors[2]}44, ${palette.colors[4]}44)`,
      flood: `linear-gradient(90deg, ${palette.colors[1]} 0 22%, ${palette.colors[2]} 22% 44%, ${palette.colors[3]} 44% 66%, ${palette.colors[4]} 66% 100%)`,
      desktop: darkMood ? 'rgba(10,12,18,0.72)' : 'rgba(255,247,221,0.8)',
      neon: `linear-gradient(${randInt(90, 180)}deg, ${palette.colors[1]}77, ${palette.colors[2]}55, ${palette.colors[4]}55), #111`,
      overlay: darkMood ? 'rgba(20,20,20,0.3)' : 'rgba(255,255,255,0.16)',
    },
    desktop: {
      poster: `linear-gradient(135deg, ${palette.colors[0]}44, ${palette.colors[2]}22)`,
      flood: `linear-gradient(90deg, ${palette.colors[1]}55 0 24%, ${palette.colors[2]}44 24% 52%, ${palette.colors[4]}33 52% 100%)`,
      desktop: darkMood ? 'rgba(14,18,25,0.76)' : 'rgba(255,252,239,0.82)',
      neon: `linear-gradient(${randInt(130, 210)}deg, ${palette.colors[1]}55, ${palette.colors[2]}44), ${darkMood ? '#101117' : '#f3ecd5'}`,
      overlay: darkMood ? 'rgba(18,20,28,0.34)' : 'rgba(255,255,255,0.18)',
    },
    ticker: {
      poster: `linear-gradient(135deg, ${palette.colors[0]}44, ${palette.colors[1]}22)`,
      flood: `linear-gradient(90deg, ${palette.colors[1]} 0 24%, ${palette.colors[2]} 24% 48%, ${palette.colors[4]} 48% 72%, ${palette.colors[3]} 72% 100%)`,
      desktop: darkMood ? 'rgba(12,14,20,0.76)' : 'rgba(255,249,232,0.82)',
      neon: `linear-gradient(135deg, ${palette.colors[1]}66, ${palette.colors[2]}55), ${darkMood ? '#0d0c16' : '#141414'}`,
      overlay: darkMood ? 'rgba(10,12,20,0.38)' : 'rgba(255,255,255,0.16)',
    },
  };

  const surfaceVisual = surfaceByMode[state.surfaceMode] || surfaceByMode.drift;

  return {
    bodyBackground,
    beforeBackground: shuffle(beforeModes)
      .slice(0, randInt(0, 1))
      .filter((value) => value !== 'none')
      .join(', '),
    afterBackground: shuffle(afterModes)
      .slice(0, randInt(0, 1))
      .filter((value) => value !== 'none')
      .join(', '),
    beforeOpacity: darkMood ? '0.12' : '0.16',
    afterOpacity: darkMood ? '0.22' : '0.18',
    beforeBlend: darkMood ? 'overlay' : 'multiply',
    afterBlend: darkMood ? 'screen' : pick(['screen', 'overlay', 'soft-light']) || 'screen',
    ink,
    labelInk,
    noteInk,
    metaStripBg,
    metaStripBorder: darkMood ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.14)',
    questionBannerBg: palette.colors[1],
    questionBannerInk: darkMood ? '#111' : '#050505',
    glassPanelBg: darkMood ? 'rgba(18, 20, 30, 0.34)' : `rgba(255,255,255,${rand(0.12, 0.2).toFixed(2)})`,
    glassPanelBorder: darkMood ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.16)',
    glassPanelShadow: darkMood ? '0 16px 42px rgba(0,0,0,0.34)' : '0 16px 42px rgba(0,0,0,0.18)',
    errorWindowBg: darkMood ? '#161616' : palette.colors[4],
    errorWindowShadow: `8px 8px 0 ${palette.colors[1]}55`,
    replyOverlayBg: surfaceVisual.overlay,
    replyNeonBg: surfaceVisual.neon,
    replyPosterBg: surfaceVisual.poster,
    replyFloodBg: surfaceVisual.flood,
    replyDesktopBg: surfaceVisual.desktop,
    tickerInk: darkMood ? 'rgba(246,241,232,0.88)' : '#111111',
    tickerBarBg: `linear-gradient(90deg, ${palette.colors[1]}, ${palette.colors[2]}, ${palette.colors[4]})`,
    replyTextDefault: darkMood ? 'rgba(246,241,232,0.92)' : 'rgba(0,0,0,0.9)',
    noiseOpacity: rand(darkMood ? 0.04 : 0.03, darkMood ? 0.14 : 0.09).toFixed(2),
    scanlinesOpacity: scanlineBackground === 'none' ? '0' : rand(0.03, 0.12).toFixed(2),
    scanlinesBackground: scanlineBackground,
    glitchTopOpacity: Math.random() > 0.58 ? rand(0.18, 0.74).toFixed(2) : '0',
    glitchBottomOpacity: Math.random() > 0.66 ? rand(0.12, 0.54).toFixed(2) : '0',
    glitchTopBg: pick(glitchModes) || 'none',
    glitchBottomBg: pick(glitchModes) || 'none',
  };
}

function applyBackdropVisuals() {
  const visuals = buildBackdropVisuals();
  const root = document.body;

  root.style.setProperty('--body-background', visuals.bodyBackground);
  root.style.setProperty('--body-before-bg', visuals.beforeBackground);
  root.style.setProperty('--body-after-bg', visuals.afterBackground);
  root.style.setProperty('--body-before-opacity', visuals.beforeOpacity);
  root.style.setProperty('--body-after-opacity', visuals.afterOpacity);
  root.style.setProperty('--body-before-blend', visuals.beforeBlend);
  root.style.setProperty('--body-after-blend', visuals.afterBlend);
  root.style.setProperty('--ink-active', visuals.ink);
  root.style.setProperty('--meta-strip-bg', visuals.metaStripBg);
  root.style.setProperty('--meta-strip-border', visuals.metaStripBorder);
  root.style.setProperty('--meta-strip-note', visuals.noteInk);
  root.style.setProperty('--label-ink', visuals.labelInk);
  root.style.setProperty('--question-banner-bg', visuals.questionBannerBg);
  root.style.setProperty('--question-banner-ink', visuals.questionBannerInk);
  root.style.setProperty('--glass-panel-bg', visuals.glassPanelBg);
  root.style.setProperty('--glass-panel-border', visuals.glassPanelBorder);
  root.style.setProperty('--glass-panel-shadow', visuals.glassPanelShadow);
  root.style.setProperty('--error-window-bg', visuals.errorWindowBg);
  root.style.setProperty('--error-window-shadow', visuals.errorWindowShadow);
  root.style.setProperty('--reply-overlay-bg', visuals.replyOverlayBg);
  root.style.setProperty('--reply-neon-bg', visuals.replyNeonBg);
  root.style.setProperty('--reply-poster-bg', visuals.replyPosterBg);
  root.style.setProperty('--reply-flood-bg', visuals.replyFloodBg);
  root.style.setProperty('--reply-desktop-bg', visuals.replyDesktopBg);
  root.style.setProperty('--ticker-ink', visuals.tickerInk);
  root.style.setProperty('--ticker-bar-bg', visuals.tickerBarBg);
  root.style.setProperty('--reply-text-default', visuals.replyTextDefault);
  root.style.setProperty('--noise-opacity', visuals.noiseOpacity);
  root.style.setProperty('--scanlines-opacity', visuals.scanlinesOpacity);
  root.style.setProperty('--scanlines-bg', visuals.scanlinesBackground);
  root.style.setProperty('--glitch-top-opacity', visuals.glitchTopOpacity);
  root.style.setProperty('--glitch-bottom-opacity', visuals.glitchBottomOpacity);
  root.style.setProperty('--glitch-top-bg', visuals.glitchTopBg);
  root.style.setProperty('--glitch-bottom-bg', visuals.glitchBottomBg);
}

function shuffle(items = []) {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
}

function escapeHtml(value = '') {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return character;
    }
  });
}

function formatMultiline(value = '') {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function excerpt(value = '', maxLength = 220) {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}...`;
}

function questionFragments(question = '') {
  return unique(
    String(question || '')
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter(Boolean),
  );
}

function detectTags(question) {
  const matches = Object.entries(tagMatchers)
    .filter(([, matcher]) => matcher.test(question))
    .map(([tag]) => tag);

  return matches.length ? matches : ['generic'];
}

function buildSearchTerm(question, tags, map) {
  const pool = unique([
    ...tags.flatMap((tag) => map[tag] || []),
    ...(map.generic || []),
  ]);

  const directHints = [];

  if (/krieg|war|iran|israel|missile|gas/i.test(question)) directHints.push('war');
  if (/website|netz|internet|feed|bot|browser/i.test(question)) directHints.push('internet');
  if (/gestaltung|design|bild|style|art|kunst/i.test(question)) directHints.push('design');
  if (/koerper|mensch|hand|holz|analog/i.test(question)) directHints.push('craft');
  if (/ki|ai|algorithm|system|surveillance|prompt/i.test(question)) directHints.push('artificial intelligence');

  return pick(unique([...directHints, ...pool])) || 'internet';
}

function extractQuestionTokens(question) {
  return unique(
    question
      .toLowerCase()
      .replace(/[?.,]/g, '')
      .split(/\s+/)
      .filter((token) => token.length > 5),
  ).slice(0, 8);
}

function buildSearchTerms(question, tags, map) {
  const tokens = extractQuestionTokens(question);
  const primary = buildSearchTerm(question, tags, map);
  const secondary = pick(unique([...tokens, ...tags.flatMap((tag) => map[tag] || [])]));
  return unique([primary, secondary].filter(Boolean)).slice(0, 2);
}

async function fetchWikipediaTrace(term) {
  const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrlimit=6&prop=extracts|pageimages|description&exintro=1&explaintext=1&exchars=420&pithumbsize=1200`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`wikipedia trace failed with ${response.status}`);
  }

  const payload = await response.json();
  const pages = Object.values(payload.query?.pages || {})
    .map((page) => ({
      title: page.title || '',
      description: page.description || '',
      extract: page.extract || '',
      image: page.thumbnail?.source || '',
      url: page.title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/\s+/g, '_'))}` : '',
    }))
    .filter((page) => page.title || page.extract || page.image);

  return shuffle(pages);
}

async function fetchInternetVoice(question) {
  const requestSeed = nextRequestSeed();
  const response = await fetch(
    `/.netlify/functions/internet-voice?q=${encodeURIComponent(question)}&rid=${encodeURIComponent(getGiphySessionId())}&rv=${encodeURIComponent(
      requestSeed,
    )}&t=${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  if (!response.ok) {
    throw new Error(`internet voice failed with ${response.status}`);
  }

  const payload = await response.json();
  if (payload?.status !== 'ok') {
    throw new Error(payload?.error || 'internet voice returned invalid payload');
  }

  return payload;
}

async function fetchCommonsImages(term) {
  const url = `https://commons.wikimedia.org/w/api.php?origin=*&action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(term)}&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=1200`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`commons image fetch failed with ${response.status}`);
  }

  const payload = await response.json();
  const pages = Object.values(payload.query?.pages || {})
    .map((page) => ({
      title: (page.title || '').replace(/^File:/, ''),
      url: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url || '',
    }))
    .filter((page) => page.url);

  return shuffle(pages);
}

function buildInternetFragments(question, pages = []) {
  const sourceText = unique(
    pages.flatMap((page) => [
      page.title || '',
      page.description || '',
      ...(page.extract || '')
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean),
    ]),
  )
    .map((line) => line.toLowerCase())
    .filter((line) => line.length > 24);

  if (!sourceText.length) return [];

  const modes = [
    () => shuffle(sourceText).slice(0, 3),
    () =>
      shuffle(sourceText)
        .slice(0, 2)
        .map((line) => line.replace(/^[a-z]/, (char) => char.toUpperCase())),
    () => [
      excerpt(pick(sourceText) || '', 120),
      question.replace(/\n/g, ' ').toLowerCase(),
      excerpt(pick(sourceText) || '', 110),
    ],
  ];

  return (pick(modes) || modes[0])();
}

function buildMediaCandidates(voiceImages = [], pages = [], commonsImages = []) {
  const wikiCandidates = pages
    .filter((page) => page.image)
    .map((page) => ({
      url: page.image,
      title: page.title || '',
      source: page.url || '',
      label: 'wikipedia',
    }));
  const commonsCandidates = commonsImages.map((page) => ({
    url: page.url,
    title: page.title || '',
    source: page.url || '',
    label: 'wikimedia commons',
  }));

  const deduped = [];
  const seen = new Set();

  [...voiceImages, ...wikiCandidates, ...commonsCandidates].forEach((item) => {
    const key = normalizeKey(item.url);
    if (!item.url || seen.has(key)) return;
    seen.add(key);
    deduped.push(item);
  });

  return shuffle(deduped);
}

function pickReplyMedia(voiceImages, pages, commonsImages) {
  const mediaCandidates = buildMediaCandidates(voiceImages, pages, commonsImages);
  const mainImage = pickAvoidingRecent(mediaCandidates, (item) => item.url, 'recentImages', mediaCandidates[0]);
  if (!mainImage) return { mainImage: null, popupImage: null };

  rememberRecent('recentImages', mainImage.url, 14);

  const popupCandidates = mediaCandidates.filter((item) => item.url !== mainImage.url);
  const popupImage =
    Math.random() > 0.38
      ? pickAvoidingRecent(popupCandidates, (item) => item.url, 'recentImages', popupCandidates[0] || null)
      : null;

  if (popupImage) rememberRecent('recentImages', popupImage.url, 14);

  return { mainImage, popupImage };
}

function buildWhispers(question, pages = []) {
  const titleFragments = pages
    .map((page) => page.title?.toLowerCase())
    .filter(Boolean)
    .slice(0, 2);

  const echoes = [question.split(/\n/)[0], ...titleFragments].filter(Boolean);

  return shuffle(unique(echoes)).slice(0, 5);
}

function resolveGifEmbed(gif) {
  if (!gif) return '';
  if (gif.embedUrl?.includes('giphy.com/embed/')) return gif.embedUrl;
  if (gif.id && gif.href?.includes('giphy.com')) return `https://giphy.com/embed/${gif.id}`;
  return gif.embedUrl || '';
}

function buildGifLayout(gifs = []) {
  const presets = shuffle([
    { x: 3, y: -2, width: 18, rotation: 5 },
    { x: 11, y: 62, width: 22, rotation: -6 },
    { x: 68, y: 6, width: 20, rotation: 4 },
    { x: 74, y: 56, width: 17, rotation: -4 },
    { x: 38, y: 2, width: 15, rotation: 3 },
    { x: 48, y: 58, width: 19, rotation: -7 },
  ]);

  return gifs.map((gif, index) => {
    const preset = presets[index % presets.length];
    const width = Math.max(12, Math.min(28, preset.width + Math.round((Math.random() - 0.5) * 8)));
    const x = Math.max(1, Math.min(82, preset.x + Math.round((Math.random() - 0.5) * 10)));
    const y = Math.max(-3, Math.min(72, preset.y + Math.round((Math.random() - 0.5) * 10)));
    const rotation = preset.rotation + Math.round((Math.random() - 0.5) * 8);

    return {
      gif,
      style: `left:${x}%; top:${y}%; width:min(${width}vw, ${Math.round(width * 11)}px); transform:rotate(${rotation}deg);`,
    };
  });
}

function remixFragments(question, voiceFragments = [], pages = []) {
  const internetFragments = buildInternetFragments(question, pages);
  const pool = unique([...voiceFragments, ...internetFragments])
    .map((line) => excerpt(String(line || '').trim(), 220))
    .filter((line) => line.length > 16);

  if (!pool.length) return questionFragments(question).slice(0, 3);

  const freshPool = pool.filter((line) => !state.recentFragments.includes(normalizeKey(line)));
  const candidatePool = freshPool.length >= 3 ? freshPool : pool;
  const modes = [
    () => shuffle(candidatePool).slice(0, 3),
    () => [pick(candidatePool), pick(candidatePool), pick(candidatePool)].filter(Boolean),
    () => [excerpt(pick(candidatePool) || '', 110), excerpt(pick(candidatePool) || '', 140), excerpt(pick(candidatePool) || '', 95)],
    () => shuffle(candidatePool).slice(0, 2).concat(question.replace(/\n/g, ' ').toLowerCase()),
  ];
  const selected = unique((pick(modes) || modes[0])().filter(Boolean)).slice(0, Math.random() > 0.5 ? 3 : 4);
  selected.forEach((line) => rememberRecent('recentFragments', line, 18));
  return selected;
}

function buildQuestionDisplay(question, scene) {
  const mode = state.questionTypeMode;
  const inlineText = question.replace(/\n+/g, ' ').trim();

  if (state.questionMode === 'line' || state.questionMode === 'strip') {
    return `<span class="question-thread__text question-thread__text--${mode} question-thread__text--single">${escapeHtml(inlineText)}</span>`;
  }

  if (scene === 'essay') {
    const lines = question.split('\n').filter(Boolean).slice(0, 4);
    return `
      <span class="question-thread__text question-thread__text--pixel question-thread__text--${mode}">
        ${lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}
      </span>
    `;
  }

  if (scene === 'market') {
    return `
      <span class="question-thread__text question-thread__text--bubble question-thread__text--${mode}">
        ${formatMultiline(question)}
      </span>
    `;
  }

  return `<span class="question-thread__text question-thread__text--${mode}">${formatMultiline(question)}</span>`;
}

function buildQuestionShell(question) {
  const content = buildQuestionDisplay(question, state.scene);
  const mode = state.questionMode;
  const shellStyle = state.questionShellStyle || '';
  const nodeStyle = state.questionNodeStyle || '';
  const frameMode = state.questionFrameMode || 'framed';

  if (frameMode === 'none') {
    return `
      <div class="question-shell question-shell--${mode} question-shell--bare" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  if (mode === 'popup95') {
    return `
      <div class="question-shell question-shell--popup95" style="${shellStyle}">
        <div class="question-window question-window--win95 ${frameMode === 'soft' ? 'question-window--soft' : ''}">
          <div class="question-window__bar">system question</div>
          <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
        </div>
      </div>
    `;
  }

  if (mode === 'popupGlass') {
    return `
      <div class="question-shell question-shell--popupGlass" style="${shellStyle}">
        <div class="question-window question-window--glass ${frameMode === 'soft' ? 'question-window--soft' : ''}">
          <div class="question-window__bar">live prompt</div>
          <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
        </div>
      </div>
    `;
  }

  if (mode === 'banner') {
    return `
      <div class="question-shell question-shell--banner" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  if (mode === 'corner') {
    return `
      <div class="question-shell question-shell--corner" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  if (mode === 'footer') {
    return `
      <div class="question-shell question-shell--footer" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  if (mode === 'micro') {
    return `
      <div class="question-shell question-shell--micro" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  if (mode === 'error') {
    return `
      <div class="question-shell question-shell--error" style="${shellStyle}">
        <div class="question-window question-window--error ${frameMode === 'soft' ? 'question-window--soft' : ''}">
          <div class="question-window__bar">fatal prompt exception</div>
          <p class="question-window__msg">question overflow detected</p>
          <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
        </div>
      </div>
    `;
  }

  if (mode === 'line') {
    return `
      <div class="question-shell question-shell--line" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  if (mode === 'strip') {
    return `
      <div class="question-shell question-shell--strip" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  if (mode === 'loose') {
    return `
      <div class="question-shell question-shell--loose" style="${shellStyle}">
        <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
      </div>
    `;
  }

  return `
    <div class="question-shell question-shell--inline" style="${shellStyle}">
      <button type="button" class="question-thread__node" id="question-node" style="${nodeStyle}">${content}</button>
    </div>
  `;
}

function getViewportInfo() {
  const width =
    typeof window !== 'undefined' ? window.innerWidth || document.documentElement?.clientWidth || 1280 : 1280;
  return {
    width,
    isTablet: width <= 960,
    isMobile: width <= 720,
    isSmall: width <= 560,
  };
}

function buildQuestionPlacement() {
  const mode = state.questionMode;
  const viewport = getViewportInfo();

  if (viewport.isMobile) {
    const top = randInt(0, 10);
    const left = randInt(0, 8);
    const width = viewport.isSmall ? randInt(84, 98) : randInt(68, 94);
    const rotation = mode === 'loose' ? randInt(-6, 6) : randInt(-3, 3);
    return `position:relative; top:${top * 0.08}rem; left:${left * 0.18}%; width:min(${width}vw, calc(100vw - 1.2rem)); max-width:100%; transform:rotate(${rotation}deg);`;
  }

  if (viewport.isTablet) {
    if (mode === 'strip' || mode === 'line') {
      return `position:absolute; top:${randInt(2, 68)}%; left:${randInt(0, 16)}%; width:min(${randInt(62, 92)}vw, calc(100vw - 2rem)); transform:rotate(${randInt(-4, 4)}deg);`;
    }
    if (mode === 'popup95' || mode === 'popupGlass' || mode === 'error') {
      return `position:absolute; top:${randInt(0, 18)}%; left:${randInt(0, 26)}%; width:min(${randInt(42, 72)}vw, calc(100vw - 2rem)); transform:rotate(${randInt(-5, 5)}deg);`;
    }
  }

  if (mode === 'strip') {
    const top = randInt(2, 78);
    const left = randInt(0, 4);
    const width = randInt(86, 100);
    return `position:absolute; top:${top}%; left:${left}%; width:min(${width}%, 88rem); transform:none;`;
  }

  if (mode === 'line') {
    const top = randInt(4, 84);
    const left = randInt(0, 34);
    return `position:absolute; top:${top}%; left:${left}%; width:min(92vw, 46rem); max-width:92vw; transform:none;`;
  }

  if (mode === 'loose') {
    const top = randInt(6, 84);
    const left = randInt(0, 42);
    const rotation = randInt(-14, 14);
    return `position:absolute; top:${top}%; left:${left}%; width:min(78vw, 34rem); max-width:92vw; transform:rotate(${rotation}deg);`;
  }

  if (mode === 'banner') {
    const top = Math.round(Math.random() * 26);
    const left = Math.round(Math.random() * 6);
    const width = 88 + Math.round(Math.random() * 10);
    const rotation = Math.round((Math.random() - 0.5) * 3);
    return `position:absolute; top:${top}%; left:${left}%; width:min(${width}%, 72rem); transform:rotate(${rotation}deg);`;
  }

  if (mode === 'corner') {
    const top = Math.round(Math.random() * 18);
    const left = 48 + Math.round(Math.random() * 18);
    const width = 20 + Math.round(Math.random() * 12);
    const rotation = -8 + Math.round(Math.random() * 14);
    return `position:absolute; top:${top}%; left:${left}%; width:min(${width}vw, 28rem); transform:rotate(${rotation}deg);`;
  }

  if (mode === 'footer') {
    const bottom = Math.round(Math.random() * 10);
    const left = Math.round(Math.random() * 42);
    const width = 18 + Math.round(Math.random() * 18);
    const rotation = -5 + Math.round(Math.random() * 10);
    return `position:absolute; bottom:${bottom}%; left:${left}%; width:min(${width}vw, 24rem); transform:rotate(${rotation}deg);`;
  }

  if (mode === 'micro') {
    const top = Math.round(Math.random() * 34);
    const left = Math.round(Math.random() * 60);
    const width = 12 + Math.round(Math.random() * 12);
    const rotation = -12 + Math.round(Math.random() * 24);
    return `position:absolute; top:${top}%; left:${left}%; width:min(${width}vw, 14rem); transform:rotate(${rotation}deg);`;
  }

  if (mode === 'popup95' || mode === 'popupGlass' || mode === 'error') {
    const top = Math.round(Math.random() * 26);
    const left = Math.round(Math.random() * 26);
    const width = 34 + Math.round(Math.random() * 18);
    const rotation = -6 + Math.round(Math.random() * 12);
    return `position:absolute; top:${top}%; left:${left}%; width:min(${width}vw, 42rem); transform:rotate(${rotation}deg);`;
  }

  const top = 8 + Math.round(Math.random() * 26);
  const left = Math.round(Math.random() * 22);
  const width = 36 + Math.round(Math.random() * 24);
  const rotation = -4 + Math.round(Math.random() * 8);
  return `position:absolute; top:${top}%; left:${left}%; width:min(${width}vw, 46rem); transform:rotate(${rotation}deg);`;
}

function buildReplyLayout() {
  const viewport = getViewportInfo();
  const articleRotation = -2 + Math.round(Math.random() * 4);
  const copyWidth = viewport.isMobile ? 84 + Math.round(Math.random() * 10) : 42 + Math.round(Math.random() * 26);
  const copyOffset = Math.round(rand(-4, 8));
  const copyTop = Math.round(Math.random() * 8);
  const imageWidth = viewport.isMobile ? 72 + Math.round(Math.random() * 16) : 22 + Math.round(Math.random() * 18);
  const imageOffset = Math.round(rand(-4, 8));

  return {
    articleStyle: `transform:rotate(${articleRotation}deg); ${Math.random() > 0.55 ? 'background:none; box-shadow:none; border:0;' : ''}`,
    copyStyle: `position:relative; top:${viewport.isMobile ? rand(0, 1.2).toFixed(2) : copyTop}rem; left:${viewport.isMobile ? randInt(-2, 2) : copyOffset}%; width:min(${copyWidth}vw, ${viewport.isMobile ? '100%' : '42rem'}); max-width:min(100%, 92vw);`,
    imageStyle: `position:relative; top:${viewport.isMobile ? rand(0, 1).toFixed(2) : Math.round(Math.random() * 4)}rem; left:${viewport.isMobile ? randInt(-2, 2) : imageOffset}%; width:min(${imageWidth}vw, ${viewport.isMobile ? '100%' : '30rem'}); max-width:min(100%, 92vw);`,
  };
}

function buildQuestionShellStyle() {
  const rotation = randInt(-2, 2);
  const opacity = rand(0.9, 1).toFixed(2);
  const widthMode = Math.random() > 0.78 ? 'width:max-content;' : '';
  const supportWidth = `width:min(${randInt(20, 34)}rem, calc(100vw - 1.5rem));`;
  const supportPadding = `padding:${rand(0.18, 0.5).toFixed(2)}rem ${rand(0.24, 0.7).toFixed(2)}rem;`;
  return `${supportWidth} ${supportPadding} background:transparent; border:0; box-shadow:none; backdrop-filter:none; opacity:${opacity}; transform:rotate(${rotation}deg); ${widthMode}`;
}

function buildQuestionNodeStyle() {
  const viewport = getViewportInfo();
  const align = pick(['left', 'left', 'center', 'right']) || 'left';
  const blend = Math.random() > 0.8 ? `mix-blend-mode:${pick(['multiply', 'screen', 'difference']) || 'multiply'};` : '';
  const widthRule = viewport.isMobile ? 'max-width:100%;' : 'max-width:min(100%, 28rem);';
  return `white-space:normal; display:inline-block; ${widthRule} text-align:${align}; ${blend}`;
}

function buildQuestionLabelStyle() {
  const left = randInt(0, 72);
  const top = randInt(-1, 10);
  const rotate = randInt(-10, 10);
  const opacity = rand(0.28, 0.88).toFixed(2);
  return `position:absolute; left:${left}%; top:${top}%; transform:rotate(${rotate}deg); opacity:${opacity};`;
}

function buildAnswerStreamStyle() {
  const padTop = rand(0.2, 2.6).toFixed(2);
  const minHeight = randInt(34, 74);
  return `padding-top:${padTop}rem; min-height:${minHeight}svh;`;
}

function buildReplyLineStyle(baseStyle, index) {
  const left = randInt(-2, 4);
  const top = rand(0, 0.5).toFixed(2);
  const rotate = randInt(-1, 1);
  return `${baseStyle} position:relative; left:${left}%; top:${top}rem; transform:rotate(${rotate}deg); animation-delay:${(index * 0.08).toFixed(2)}s;`;
}

function pickImageMissingMode() {
  return pick(['poster', 'stamp', 'poster']) || 'poster';
}

function buildImageMissingTone() {
  const hue = randInt(0, 360);
  const bg = hsl(hue, randInt(72, 98), randInt(10, 22), 0.88);
  const bar = hsl((hue + randInt(40, 180)) % 360, randInt(70, 100), randInt(42, 62), 0.98);
  const ink = randInt(0, 1) ? '#f5f1e6' : hsl((hue + 180) % 360, randInt(38, 92), randInt(72, 88), 0.98);
  const border = hsl((hue + randInt(15, 120)) % 360, randInt(34, 88), randInt(22, 44), 0.5);
  return `--missing-bg:${bg}; --missing-bar:${bar}; --missing-ink:${ink}; --missing-border:${border};`;
}

function buildMissingImageMarkup(style = '') {
  const labels = [
    '404',
    'image not found',
    'remote image missing',
    'source unavailable',
    'media timeout',
    'no stable image',
    'asset missing',
  ];
  const sublines = [
    'the wire returned only text',
    'public image could not be negotiated',
    'no visual proof was attached',
    'trace exists without picture',
    'this answer arrived imageless',
    'source refused thumbnail generation',
  ];
  const stickers = ['new', 'broken', 'not now', 'retry', 'void', 'cached no'];
  const tilt = -7 + Math.round(Math.random() * 14);
  const mode = state.imageMissingMode || 'error';
  const tone = state.imageMissingTone || buildImageMissingTone();

  return `
    <figure class="reply-image-missing reply-image-missing--${mode}" style="${style} transform:rotate(${tilt}deg); ${tone}">
      <div class="reply-image-missing__bar">${escapeHtml(pick(stickers) || '404')}</div>
      <div class="reply-image-missing__body">
        <strong>${escapeHtml(pick(labels) || 'image not found')}</strong>
        <p>${escapeHtml(pick(sublines) || 'the wire returned only text')}</p>
      </div>
    </figure>
  `;
}

function buildTypeColor(target = 'question') {
  const strongDark = ['#111111', '#ff3b30', '#0057ff', '#008a2e'];
  return pick(strongDark) || '#111111';
}

function buildTypeStyle(target = 'question') {
  const sizeProfiles =
    target === 'question'
      ? [
          { min: 0.72, max: 1.7, line: 0.98 },
          { min: 1.0, max: 2.5, line: 0.94 },
          { min: 1.5, max: 4.1, line: 0.88 },
          { min: 2.5, max: 7.6, line: 0.82 },
        ]
      : [
          { min: 0.9, max: 1.45, line: 1.05 },
          { min: 1.0, max: 1.8, line: 1.0 },
          { min: 1.2, max: 2.4, line: 0.96 },
        ];
  const profile = pick(sizeProfiles) || sizeProfiles[0];
  const fontSizeMin = profile.min + Math.random() * (target === 'question' ? 0.85 : 0.45);
  const fontSizeMax = profile.max + Math.random() * (target === 'question' ? 1.6 : 0.55);
  const lineHeight = profile.line + Math.random() * (target === 'question' ? 0.18 : 0.16);
  const letterSpacing = -0.12 + Math.random() * 0.24;
  const maxWidth = target === 'question' ? 10 + Math.round(Math.random() * 12) : 16 + Math.round(Math.random() * 20);
  const color = buildTypeColor(target);
  const textTransform = Math.random() > 0.82 ? 'uppercase' : 'none';
  const fontMode = target === 'question' ? state.questionFontMode : state.replyFontMode;

  return `font-size:clamp(${fontSizeMin.toFixed(2)}rem, ${fontSizeMax.toFixed(2)}vw, ${(fontSizeMax * 1.12).toFixed(
    2,
  )}rem); line-height:${lineHeight.toFixed(2)}; letter-spacing:${letterSpacing.toFixed(
    3,
  )}em; max-width:${maxWidth}ch; color:${color}; text-transform:${textTransform}; font-family:var(--font-${fontMode}); text-shadow:none;`;
}

function buildSourceStyle() {
  const sourceColors = ['#111111', '#ff3b30', '#0057ff'];
  return `position:relative; left:${randInt(-4, 18)}%; top:${rand(-0.1, 1.2).toFixed(2)}rem; display:inline-block; color:${pick(
    sourceColors,
  )}; font-size:${rand(0.62, 0.96).toFixed(2)}rem; letter-spacing:${rand(-0.01, 0.14).toFixed(3)}em; transform:rotate(${randInt(
    -8,
    8,
  )}deg);`;
}

function buildReplyImageStyle(baseStyle = '') {
  const rotation = randInt(-2, 2);
  const opacity = rand(0.94, 1).toFixed(2);
  return `${baseStyle} transform:rotate(${rotation}deg); opacity:${opacity}; --reply-image-border:none; --reply-image-shadow:none; --reply-image-overlay-opacity:0; --reply-image-caption-opacity:0.86;`;
}

function buildReplyImagePopStyle(side = 'left') {
  const viewport = getViewportInfo();
  const left = side === 'left' ? randInt(-2, 24) : randInt(58, 84);
  const top = randInt(2, 68);
  const width = viewport.isMobile ? randInt(34, 54) : randInt(10, 24);
  const rotation = randInt(-4, 4);
  const z = randInt(1, 4);
  return `left:${left}%; top:${top}%; width:min(${width}vw, ${randInt(140, 280)}px); transform:rotate(${rotation}deg); z-index:${z}; --reply-pop-border:none; --reply-pop-shadow:none;`;
}

function buildWhisperMarkup(whispers = []) {
  return whispers
    .map((whisper, index) => {
      const left = randInt(0, 84);
      const top = randInt(2, 88);
      const fontSize = rand(0.52, 1.04).toFixed(2);
      const opacity = rand(0.22, 0.74).toFixed(2);
      const rotate = randInt(-18, 18);
      const width = randInt(7, 18);
      const color = hsl(randInt(0, 360), randInt(14, 88), randInt(24, 72), rand(0.3, 0.7));
      return `<span class="reply-whisper reply-whisper--${index + 1}" style="left:${left}%; top:${top}%; max-width:${width}rem; font-size:${fontSize}rem; opacity:${opacity}; transform:rotate(${rotate}deg); color:${color};">${escapeHtml(
        whisper.toLowerCase(),
      )}</span>`;
    })
    .join('');
}

function buildFloatWindowStyle() {
  const left = randInt(4, 72);
  const top = randInt(-2, 32);
  const width = randInt(14, 30);
  const rotation = randInt(-8, 8);
  const hue = randInt(0, 360);
  return `left:${left}%; top:${top}%; width:min(${width}vw, ${randInt(180, 340)}px); transform:rotate(${rotation}deg); background:${hsl(
    hue,
    randInt(42, 88),
    randInt(10, 24),
    0.92,
  )}; border-color:${hsl((hue + 100) % 360, randInt(28, 72), randInt(28, 54), 0.58)}; color:${hsl((hue + 180) % 360, randInt(22, 72), randInt(74, 88), 0.96)};`;
}

function buildFloatBarStyle() {
  const hue = randInt(0, 360);
  return `background:linear-gradient(90deg, ${hsl(hue, randInt(42, 88), randInt(34, 52))}, ${hsl(
    (hue + randInt(20, 90)) % 360,
    randInt(58, 96),
    randInt(72, 86),
  )});`;
}

function buildCloudStyle() {
  const left = randInt(-4, 82);
  const top = randInt(-2, 18);
  const width = randInt(5, 16);
  const height = randInt(2, 6);
  const opacity = rand(0.28, 0.92).toFixed(2);
  return `left:${left}%; top:${top}%; width:${width}rem; height:${height}rem; opacity:${opacity}; transform:rotate(${randInt(-8, 8)}deg);`;
}

function buildStageStyle() {
  const modes = ['none', 'plain', 'checker', 'dots', 'bars', 'slab'];
  const mode = pick(modes) || 'plain';
  const hue = randInt(0, 360);
  const opacity = rand(0.16, 0.48).toFixed(2);
  const base = `opacity:${opacity}; transform:rotate(${randInt(-3, 3)}deg);`;

  if (mode === 'none') return 'display:none;';

  if (mode === 'checker') {
    const size = randInt(24, 64);
    return `${base} background:
      linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0.18) 100%),
      linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111),
      linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111);
      background-size:100% 100%, ${size}px ${size}px, ${size}px ${size}px;
      background-position:0 0, 0 0, ${Math.round(size / 2)}px ${Math.round(size / 2)}px;`;
  }

  if (mode === 'dots') {
    return `${base} background:
      radial-gradient(circle at 12px 12px, rgba(0,0,0,0.35) 0 3px, transparent 4px),
      linear-gradient(180deg, transparent, rgba(255,255,255,0.16));
      background-size:${randInt(18, 38)}px ${randInt(18, 38)}px, 100% 100%;`;
  }

  if (mode === 'bars') {
    return `${base} background:
      repeating-linear-gradient(90deg, ${hsl(hue, 92, 52)} 0 ${randInt(12, 24)}px, ${hsl((hue + 120) % 360, 92, 62)} ${randInt(12, 24)}px ${randInt(26, 42)}px, ${hsl((hue + 240) % 360, 24, 12)} ${randInt(26, 42)}px ${randInt(44, 68)}px);`;
  }

  if (mode === 'slab') {
    return `${base} background:${hsl(hue, randInt(24, 72), randInt(18, 84), 0.46)}; border-top:1px solid ${hsl((hue + 180) % 360, 40, 18, 0.4)};`;
  }

  return `${base} background:
    linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.18) 100%),
    ${hsl(hue, randInt(28, 78), randInt(18, 84), 0.24)};`;
}

function buildMarketStripStyle() {
  const mode = pick(['none', 'footer', 'tape', 'label', 'side']) || 'footer';
  const hue = randInt(0, 360);
  const top = randInt(68, 94);
  const rotate = randInt(-10, 10);
  const fontSize = rand(0.62, 1.02).toFixed(2);
  if (mode === 'none') return 'display:none;';
  if (mode === 'side') {
    return `left:auto; right:${randInt(-4, 6)}%; top:${randInt(12, 68)}%; bottom:auto; width:min(${randInt(12, 22)}vw, ${randInt(
      140,
      240,
    )}px); transform:rotate(${rotate}deg); writing-mode:vertical-rl; text-orientation:mixed; background:${hsl(
      hue,
      randInt(82, 100),
      randInt(54, 74),
    )}; color:${hsl((hue + 180) % 360, randInt(16, 60), randInt(8, 18))}; font-size:${fontSize}rem;`;
  }
  if (mode === 'label') {
    return `left:${randInt(4, 42)}%; right:auto; top:${randInt(8, 22)}%; bottom:auto; width:max-content; transform:rotate(${rotate}deg); border-radius:${randInt(
      0,
      18,
    )}px; background:${hsl(hue, randInt(82, 100), randInt(34, 58))}; color:${hsl((hue + 180) % 360, randInt(16, 60), randInt(
      8,
      90,
    ))}; font-size:${fontSize}rem;`;
  }
  return `left:${randInt(-2, 2)}%; right:${randInt(-2, 2)}%; top:${top}%; bottom:auto; transform:rotate(${rotate}deg); background:${hsl(
    hue,
    randInt(82, 100),
    randInt(34, 58),
  )}; color:${hsl((hue + 180) % 360, randInt(16, 60), randInt(88, 96))}; font-size:${fontSize}rem;`;
}

function buildSceneDecor(scene, question, fragments, image) {
  return '';
}

function buildRandomStickers(count = 3) {
  const variants = ['pill', 'ticket', 'burst', 'note', 'stamp'];
  const palette = ['yellow', 'pink', 'blue', 'lime', 'cream'];
  const fontModes = ['pixel', 'courier', 'display', 'bubble'];

  return Array.from({ length: count }, (_, index) => {
    const left = Math.round(Math.random() * 78);
    const top = -2 + Math.round(Math.random() * 28);
    const rotation = -18 + Math.round(Math.random() * 36);
    const width = 5 + Math.round(Math.random() * 5);
    const variant = pick(variants) || 'pill';
    const tone = pick(palette) || 'yellow';
    const fontMode = pick(fontModes) || 'pixel';
    const label = pick(stickerLabels) || 'new';
    const hue = randInt(0, 360);
    const stickerStyle = `left:${left}%; top:${top}%; min-width:${width}rem; transform:rotate(${rotation}deg); background:${hsl(
      hue,
      randInt(74, 100),
      randInt(62, 82),
    )}; color:${hsl((hue + 180) % 360, randInt(16, 60), randInt(8, 18))}; font-size:${rand(0.58, 0.96).toFixed(
      2,
    )}rem; border:${Math.random() > 0.5 ? '1px dashed' : '1px solid'} ${hsl((hue + 90) % 360, randInt(20, 70), randInt(16, 32), 0.38)};`;

    return `
      <div class="market-badge market-badge--${variant} market-badge--${tone} market-badge--${fontMode}" style="${stickerStyle}">
        ${escapeHtml(label)}
      </div>
    `;
  }).join('');
}

function buildRandomErrorPops(question, fragments = [], image = {}, count = 2) {
  return '';
}

function buildFailureFragments(question) {
  const pool = questionFragments(question);

  return shuffle(pool.length ? pool : [question.replace(/\n/g, ' ').toLowerCase()]).slice(0, 3);
}

function renderFailureReply(question, reason = 'network drift') {
  const fragments = buildFailureFragments(question);
  const questionPlacement = state.questionPlacementStyle || buildQuestionPlacement();
  const questionStyle = state.questionTextStyle || buildTypeStyle('question');
  const replyTextStyle = state.replyTextStyle || buildTypeStyle('reply');

  questionStream.innerHTML = `
    <div class="question-thread question-thread--${state.questionMode} question-thread--${state.scaleMode}">
      <p class="question-thread__label" style="${state.questionLabelStyle || ''}">i find the luck 2.0</p>
      <div class="question-placement" style="${questionPlacement}">${buildQuestionShell(question)}</div>
    </div>
  `;

  answerStream.innerHTML = `
    <article class="reply-thread reply-thread--failure reply-thread--${state.replyMode} reply-thread--${state.scaleMode} reply-thread--${state.surfaceMode}" style="${state.answerStreamStyle || ''}">
      <div class="scene-decor scene-decor--failure">
        ${buildRandomErrorPops(question, fragments, {}, 4)}
      </div>
      <p class="reply-thread__status">${escapeHtml(reason)}</p>
      <div class="reply-thread__copy">
        ${fragments
          .map((line, index) => `<p class="reply-line reply-line--${index + 1} reply-line--${state.replyTypeMode}" style="${buildReplyLineStyle(replyTextStyle, index)}">${escapeHtml(line)}</p>`)
          .join('')}
      </div>
    </article>
  `;

  const node = questionStream.querySelector('.question-thread__text');
  if (node) node.setAttribute('style', questionStyle);
}

function updateHistory(question) {
  if (state.currentQuestion) {
    state.history = [state.currentQuestion, ...state.history].slice(0, 6);
  }

  state.currentQuestion = question;

  historyStream.innerHTML = state.history.length
    ? state.history
        .map(
          (entry, index) => `
            <button type="button" class="history-link" data-history-index="${index}">
              ${formatMultiline(entry)}
            </button>
          `,
        )
        .join('')
    : '<span class="history-empty"></span>';
}

function pickNextQuestion() {
  const recent = new Set([state.currentQuestion, ...state.history.slice(0, 4)]);
  const candidates = questionBank.filter((question) => !recent.has(question));
  return pick(candidates.length ? candidates : questionBank);
}

function renderLoading(question) {
  const questionPlacement = state.questionPlacementStyle || buildQuestionPlacement();
  const questionStyle = state.questionTextStyle || buildTypeStyle('question');
  const replyTextStyle = state.replyTextStyle || buildTypeStyle('reply');
  answerStream.setAttribute('style', state.answerStreamStyle || '');
  questionStream.innerHTML = `
    <div class="question-thread question-thread--${state.questionMode} question-thread--${state.scaleMode}">
      <p class="question-thread__label" style="${state.questionLabelStyle || ''}">i find the luck 2.0</p>
      <div class="question-placement" style="${questionPlacement}">${buildQuestionShell(question)}</div>
    </div>
  `;

  answerStream.innerHTML = `
    <article class="reply-thread reply-thread--loading reply-thread--${state.replyMode} reply-thread--${state.scaleMode} reply-thread--${state.surfaceMode}">
      <p class="reply-thread__status">searching the wire...</p>
      <div class="reply-thread__copy" style="${replyTextStyle}">
        ${questionFragments(question)
          .slice(0, 2)
          .map(
            (line, index) =>
              `<p class="reply-line reply-line--${index + 1} reply-line--${state.replyTypeMode}" style="${buildReplyLineStyle(replyTextStyle, index)}">${escapeHtml(
                line,
              )}</p>`,
          )
          .join('')}
      </div>
    </article>
  `;

  const node = questionStream.querySelector('.question-thread__text');
  if (node) node.setAttribute('style', questionStyle);
}

function renderReply(question, pages, media, fragments, tags) {
  const whispers = buildWhispers(question, pages);
  const leadSource = pages[0];
  const imageShift = Math.random() > 0.5 ? 'reply-thread--image-left' : 'reply-thread--image-right';
  const gifSet = (media?.gifs && media.gifs.length ? media.gifs : []) || [];
  const gifLayout = buildGifLayout(gifSet);
  const questionPlacement = state.questionPlacementStyle || buildQuestionPlacement();
  const replyLayout = state.replyLayout || buildReplyLayout();
  const questionStyle = state.questionTextStyle || buildTypeStyle('question');
  const replyTextStyle = state.replyTextStyle || buildTypeStyle('reply');
  const image = media?.mainImage || null;
  const popupImage = media?.popupImage || null;
  const popupSide = Math.random() > 0.5 ? 'left' : 'right';
  const sourceStyle = buildSourceStyle();
  answerStream.setAttribute('style', state.answerStreamStyle || '');

  questionStream.innerHTML = `
    <div class="question-thread question-thread--${state.questionMode} question-thread--${state.scaleMode}">
      <p class="question-thread__label" style="${state.questionLabelStyle || ''}">i find the luck 2.0</p>
      <div class="question-placement" style="${questionPlacement}">${buildQuestionShell(question)}</div>
    </div>
  `;

  answerStream.innerHTML = `
    <article class="reply-thread ${imageShift} reply-thread--${state.replyMode} reply-thread--${state.scaleMode} reply-thread--${state.surfaceMode}" style="${replyLayout.articleStyle}">
      ${buildSceneDecor(state.scene, question, fragments, image)}
      <div class="reply-thread__copy" style="${replyLayout.copyStyle}">
        ${fragments
          .map(
            (line, index) =>
              `<p class="reply-line reply-line--${index + 1} reply-line--${state.replyTypeMode}" style="${buildReplyLineStyle(replyTextStyle, index)}">${escapeHtml(
                excerpt(line, 220),
              )}</p>`,
          )
          .join('')}
        ${
          leadSource?.url
            ? `<a class="reply-thread__source" style="${sourceStyle}" href="${leadSource.url}" target="_blank" rel="noreferrer">${escapeHtml(
                (leadSource.title || leadSource.url || '').toLowerCase(),
              )}</a>`
            : ''
        }
      </div>

      ${
        image
          ? `
            <figure class="reply-image reply-image--${state.imageMode}" style="${buildReplyImageStyle(replyLayout.imageStyle)}">
              <img src="${image.url}" alt="${escapeHtml(image.title || '')}" loading="eager" referrerpolicy="no-referrer" />
              ${
                image.label || image.title || image.source
                  ? `
                    <figcaption>
                      ${image.label ? `<span>${escapeHtml(image.label.toLowerCase())}</span>` : ''}
                      ${image.source ? `<a href="${image.source}" target="_blank" rel="noreferrer">${escapeHtml((image.title || image.source).toLowerCase())}</a>` : image.title ? `<span>${escapeHtml(image.title.toLowerCase())}</span>` : ''}
                    </figcaption>
                  `
                  : ''
              }
            </figure>
          `
          : buildMissingImageMarkup(replyLayout.imageStyle)
      }

      ${
        popupImage
          ? `
            <figure class="reply-image-pop reply-image-pop--${popupSide} reply-image-pop--${state.imageMode}" style="${buildReplyImagePopStyle(popupSide)}">
              <img src="${popupImage.url}" alt="${escapeHtml(popupImage.title || '')}" loading="lazy" referrerpolicy="no-referrer" />
              ${popupImage.title ? `<figcaption># ${escapeHtml(popupImage.title.toLowerCase())}</figcaption>` : ''}
            </figure>
          `
          : ''
      }

      ${
        gifLayout.length
          ? `
            <div class="gif-cloud">
              ${gifLayout
                .map(
                  ({ gif, style }, index) => `
                    <figure class="gif-fragment gif-fragment--${index + 1}" style="${style}">
                      <iframe
                        src="${resolveGifEmbed(gif)}"
                        title="${escapeHtml(gif.title)}"
                        loading="lazy"
                        allowfullscreen
                      ></iframe>
                      <figcaption><a href="${gif.href}" target="_blank" rel="noreferrer">${escapeHtml(gif.title)}</a></figcaption>
                    </figure>
                  `,
                )
                .join('')}
            </div>
          `
          : ''
      }

      <div class="reply-whispers">
        ${buildWhisperMarkup(whispers)}
      </div>
    </article>
  `;

  const node = questionStream.querySelector('.question-thread__text');
  if (node) node.setAttribute('style', questionStyle);
}

async function loadQuestion(forcedQuestion) {
  const nextQuestion = forcedQuestion || pickNextQuestion();
  const tags = detectTags(nextQuestion);
  const wikiTerms = buildSearchTerms(nextQuestion, tags, wikiSearchMap);
  const commonsTerms = buildSearchTerms(nextQuestion, tags, commonsSearchMap);
  const currentRun = ++state.runId;
  state.pageCount += 1;
  state.scene = pickScene();
  state.questionTypeMode = pickTypeMode(state.scene);
  state.replyTypeMode = pickTypeMode(pick(sceneModes) || state.scene);
  state.questionFontMode = pickFontMode();
  state.replyFontMode = pickFontMode();
  state.imageMode = pickImageMode();
  state.backdropMode = pickBackdropMode();
  state.questionMode = pickQuestionMode(state.scene);
  state.replyMode = pickReplyMode(state.scene);
  state.scaleMode = pickScaleMode();
  state.surfaceMode = pickSurfaceMode();
  state.questionPlacementStyle = buildQuestionPlacement();
  state.questionTextStyle = buildTypeStyle('question');
  state.replyTextStyle = buildTypeStyle('reply');
  state.replyLayout = buildReplyLayout();
  state.imageMissingMode = pickImageMissingMode();
  state.imageMissingTone = buildImageMissingTone();
  state.questionShellStyle = buildQuestionShellStyle();
  state.questionNodeStyle = buildQuestionNodeStyle();
  state.questionLabelStyle = buildQuestionLabelStyle();
  state.answerStreamStyle = buildAnswerStreamStyle();
  state.questionFrameMode = 'none';
  state.mediaFrameMode = 'none';
  applyBackdropVisuals();

  updateHistory(nextQuestion);
  renderLoading(nextQuestion);

  const [internetVoiceResult, wikiTraceResultA, wikiTraceResultB, commonsImageResultA, commonsImageResultB] = await Promise.allSettled([
    fetchInternetVoice(nextQuestion),
    fetchWikipediaTrace(wikiTerms[0] || 'internet'),
    fetchWikipediaTrace(wikiTerms[1] || wikiTerms[0] || 'design'),
    fetchCommonsImages(commonsTerms[0] || 'internet cafe'),
    fetchCommonsImages(commonsTerms[1] || commonsTerms[0] || 'glitch art'),
  ]);

  if (currentRun !== state.runId) return;

  const voicePages = internetVoiceResult.status === 'fulfilled' ? internetVoiceResult.value.pages || [] : [];
  const wikiPages = shuffle([
    ...voicePages,
    ...(wikiTraceResultA.status === 'fulfilled' ? wikiTraceResultA.value : []),
    ...(wikiTraceResultB.status === 'fulfilled' ? wikiTraceResultB.value : []),
  ]);
  const commonsImages = shuffle([
    ...(commonsImageResultA.status === 'fulfilled' ? commonsImageResultA.value : []),
    ...(commonsImageResultB.status === 'fulfilled' ? commonsImageResultB.value : []),
  ]);
  const voiceFragments =
    internetVoiceResult.status === 'fulfilled' && Array.isArray(internetVoiceResult.value.fragments) ? internetVoiceResult.value.fragments : [];
  const voiceImages =
    internetVoiceResult.status === 'fulfilled' && Array.isArray(internetVoiceResult.value.images)
      ? internetVoiceResult.value.images
      : internetVoiceResult.status === 'fulfilled' && internetVoiceResult.value.image?.url
        ? [internetVoiceResult.value.image]
        : [];
  const voiceGifs =
    internetVoiceResult.status === 'fulfilled' && Array.isArray(internetVoiceResult.value.gifs)
      ? internetVoiceResult.value.gifs
      : [];
  const hasInternetSubstance = Boolean(voiceFragments.length || voiceImages.length || voiceGifs.length || wikiPages.length || commonsImages.length);
  if (!hasInternetSubstance) {
    renderFailureReply(nextQuestion, internetVoiceResult.status === 'rejected' ? 'network request failed' : 'internet returned no stable trace');
    return;
  }
  const fragments = remixFragments(nextQuestion, voiceFragments, wikiPages);
  const media = pickReplyMedia(voiceImages, wikiPages, commonsImages);
  const freshVoiceGifs = shuffle(voiceGifs).filter((gif) => !state.recentGifIds.includes(normalizeKey(gif.id || gif.href || gif.embedUrl)));
  const voicePool = freshVoiceGifs.length >= 2 ? freshVoiceGifs : shuffle(voiceGifs);
  media.gifs = voicePool.slice(0, Math.min(voicePool.length, Math.random() > 0.45 ? 2 : 3));
  if (media.gifs.length && Math.random() > 0.72) {
    media.gifs.push(pick(media.gifs));
  }
  media.gifs.forEach((gif) => rememberRecent('recentGifIds', gif.id || gif.href || gif.embedUrl, 54));

  renderReply(nextQuestion, wikiPages, media, fragments, tags);
}

async function loadQuestionSafely(forcedQuestion) {
  const requestedQuestion = forcedQuestion || pickNextQuestion() || state.currentQuestion || questionBank[0];

  try {
    await loadQuestion(requestedQuestion);
  } catch (error) {
    console.error('version 3 runtime drift', error);
    const errorReason = error instanceof Error && error.message ? excerpt(error.message.toLowerCase(), 120) : 'runtime mismatch';

    if (!state.questionPlacementStyle) {
      state.scene = pickScene();
      state.questionTypeMode = pickTypeMode(state.scene);
      state.replyTypeMode = pickTypeMode(pick(sceneModes) || state.scene);
      state.questionFontMode = pickFontMode();
      state.replyFontMode = pickFontMode();
      state.imageMode = pickImageMode();
      state.backdropMode = pickBackdropMode();
      state.questionMode = pickQuestionMode(state.scene);
      state.replyMode = pickReplyMode(state.scene);
      state.scaleMode = pickScaleMode();
      state.surfaceMode = pickSurfaceMode();
      state.questionPlacementStyle = buildQuestionPlacement();
      state.questionTextStyle = buildTypeStyle('question');
      state.replyTextStyle = buildTypeStyle('reply');
      state.replyLayout = buildReplyLayout();
      state.imageMissingMode = pickImageMissingMode();
      state.imageMissingTone = buildImageMissingTone();
      state.questionShellStyle = buildQuestionShellStyle();
      state.questionNodeStyle = buildQuestionNodeStyle();
      state.questionLabelStyle = buildQuestionLabelStyle();
      state.answerStreamStyle = buildAnswerStreamStyle();
      state.questionFrameMode = 'none';
      state.mediaFrameMode = 'none';
      applyBackdropVisuals();
      updateHistory(requestedQuestion);
    }

    renderFailureReply(requestedQuestion, errorReason);
  }
}

continueButton.addEventListener('click', () => {
  loadQuestionSafely();
});

listenButton.addEventListener('click', () => {
  loadQuestionSafely(state.currentQuestion || pick(questionBank));
});

historyStream.addEventListener('click', (event) => {
  const target = event.target.closest('[data-history-index]');
  if (!target) return;

  const index = Number(target.getAttribute('data-history-index'));
  const question = state.history[index];
  if (question) loadQuestionSafely(question);
});

questionStream.addEventListener('click', (event) => {
  if (event.target.closest('a, button')) {
    const button = event.target.closest('#question-node');
    if (button) loadQuestionSafely();
    return;
  }
  loadQuestionSafely();
});

answerStream.addEventListener('click', (event) => {
  if (event.target.closest('a, button')) return;
  loadQuestionSafely();
});

netShell.addEventListener('click', (event) => {
  if (event.target.closest('a, button')) return;
  loadQuestionSafely();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    loadQuestionSafely();
  }
});

hydrateRecent();
loadQuestionSafely(pick(questionBank));
