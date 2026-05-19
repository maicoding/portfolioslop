import './social-generator.css';

const canvas = document.getElementById('poster-canvas');
const ctx = canvas.getContext('2d');
const previewFrame = document.getElementById('preview-frame');
const safeOverlay = document.getElementById('safe-overlay');
const statusMsg = document.getElementById('status-msg');

const formatSelect = document.getElementById('project-format');
const themeSelect = document.getElementById('project-theme');
const safeToggle = document.getElementById('toggle-safe-zones');
const sceneList = document.getElementById('scene-list');
const themePills = document.getElementById('theme-pills');

const formatDefinitions = {
  'instagram-reel': {
    label: 'Instagram Reel / Story',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    safeTop: 180,
    safeBottom: 250,
    recommendation: 'Reel / Story',
    captionHint: 'Kurz, hook-first, CTA in den ersten 120 Zeichen.'
  },
  'tiktok-video': {
    label: 'TikTok Video',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    safeTop: 170,
    safeBottom: 300,
    recommendation: 'TikTok',
    captionHint: 'Direkter Hook, maximal klarer CTA, wenig Fluff.'
  },
  'instagram-post': {
    label: 'Instagram Feed',
    width: 1080,
    height: 1350,
    ratio: '4:5',
    safeTop: 100,
    safeBottom: 120,
    recommendation: 'Feed Post',
    captionHint: 'Mehr Kontext moeglich, CTA in Caption oder Slide 2.'
  },
  'square-post': {
    label: 'Square Post',
    width: 1080,
    height: 1080,
    ratio: '1:1',
    safeTop: 90,
    safeBottom: 90,
    recommendation: 'Carousel / LinkedIn Tile',
    captionHint: 'Headline zentral halten, CTA kompakt und praezise.'
  },
  'linkedin-landscape': {
    label: 'LinkedIn Landscape',
    width: 1200,
    height: 627,
    ratio: '1.91:1',
    safeTop: 48,
    safeBottom: 48,
    recommendation: 'Link Preview / Sponsored',
    captionHint: 'Breite Headlines, weniger Zeilenumbrueche, klares Value Statement.'
  },
  'youtube-short-cover': {
    label: 'YouTube Short Cover',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    safeTop: 160,
    safeBottom: 260,
    recommendation: 'Shorts Cover',
    captionHint: 'Wenige Worte, hohe Kontraste, ultra scanbar.'
  }
};

const themeDefinitions = {
  signal: {
    label: 'Signal Red',
    displayFont: 'Syne',
    bodyFont: 'Inter',
    bgMode: 'gradient',
    bgColor: '#0f1117',
    gradientStart: '#0f1117',
    gradientEnd: '#ff6138',
    gradientAngle: 135,
    textColor: '#f4efe8',
    bodyColor: '#f7cabd',
    accentColor: '#ff6138',
    panelStyle: 'frame'
  },
  acid: {
    label: 'Acid Lime',
    displayFont: 'Archivo Black',
    bodyFont: 'Space Grotesk',
    bgMode: 'gradient',
    bgColor: '#091013',
    gradientStart: '#091013',
    gradientEnd: '#bcff3b',
    gradientAngle: 160,
    textColor: '#f5f9e6',
    bodyColor: '#d7efb9',
    accentColor: '#bcff3b',
    panelStyle: 'split'
  },
  ocean: {
    label: 'Blue Current',
    displayFont: 'Space Grotesk',
    bodyFont: 'Inter',
    bgMode: 'gradient',
    bgColor: '#071420',
    gradientStart: '#071420',
    gradientEnd: '#1570ef',
    gradientAngle: 145,
    textColor: '#ecf6ff',
    bodyColor: '#c9deff',
    accentColor: '#7cf6ff',
    panelStyle: 'glow'
  },
  sand: {
    label: 'Sand Luxe',
    displayFont: 'Bebas Neue',
    bodyFont: 'Inter',
    bgMode: 'gradient',
    bgColor: '#efe4d2',
    gradientStart: '#f6ecd8',
    gradientEnd: '#b88a4b',
    gradientAngle: 135,
    textColor: '#221912',
    bodyColor: '#4d3d31',
    accentColor: '#b88a4b',
    panelStyle: 'badge'
  }
};

const project = {
  format: 'instagram-reel',
  theme: 'signal',
  name: 'Motion Drop April',
  handle: '@claudiamai',
  caption: 'Kinetic Type trifft Social-first Formatlogik. Ein Tool fuer schnelle Variationen, klare Hooks und exportierbare Motion-Assets.',
  hashtags: '#motiondesign #socialmedia #kinetictype #designsystem'
};

let scenes = [
  createScene({
    name: 'Hook',
    brand: 'Claudia Mai',
    kicker: 'Social Motion Toolkit',
    title: 'MOVE\nLOUDER',
    body: 'Baue Reels, Storys und Feed-Assets aus einer einzigen visuellen Engine.',
    cta: 'Speichern und teilen',
    animType: 'slide-up',
    duration: 1300
  }),
  createScene({
    name: 'Proof',
    brand: 'Studio System',
    kicker: 'Format aware',
    title: 'ONE IDEA\nMANY FORMATS',
    body: 'Safe Zones, Typo-Layout und Export-Setup bleiben auch beim Formatwechsel unter Kontrolle.',
    cta: 'Fuer TikTok, IG und LinkedIn',
    animType: 'reveal',
    duration: 1500
  }),
  createScene({
    name: 'CTA',
    brand: 'Deploy Ready',
    kicker: 'Netlify',
    title: 'SHIP\nTHE TOOL',
    body: 'Eigenstaendige Seite, saubere Route, Build-fertig fuer Deployment.',
    cta: 'Jetzt live stellen',
    animType: 'snap',
    duration: 1100
  })
];

let currentSceneIndex = 0;
let isPlaying = false;
let rafId = 0;

const inputs = {
  name: document.getElementById('input-name'),
  brand: document.getElementById('input-brand'),
  kicker: document.getElementById('input-kicker'),
  title: document.getElementById('input-title'),
  body: document.getElementById('input-body'),
  cta: document.getElementById('input-cta'),
  animType: document.getElementById('input-anim-type'),
  panelStyle: document.getElementById('input-panel-style'),
  animDuration: document.getElementById('input-anim-duration'),
  duration: document.getElementById('input-duration'),
  displayFont: document.getElementById('input-display-font'),
  bodyFont: document.getElementById('input-body-font'),
  align: document.getElementById('input-align'),
  strokeWidth: document.getElementById('input-stroke-width'),
  size: document.getElementById('input-size'),
  bodySize: document.getElementById('input-body-size'),
  lineHeight: document.getElementById('input-line-height'),
  letterSpacing: document.getElementById('input-letter-spacing'),
  rotation: document.getElementById('input-rotation'),
  x: document.getElementById('input-x'),
  y: document.getElementById('input-y'),
  imageScale: document.getElementById('input-image-scale'),
  imageX: document.getElementById('input-image-x'),
  imageY: document.getElementById('input-image-y'),
  bgMode: document.getElementById('input-bg-mode'),
  gradientAngle: document.getElementById('input-gradient-angle'),
  textColor: document.getElementById('input-text-color'),
  accentColor: document.getElementById('input-accent-color'),
  bodyColor: document.getElementById('input-body-color'),
  bgColor: document.getElementById('input-bg-color'),
  gradientStart: document.getElementById('input-gradient-start'),
  gradientEnd: document.getElementById('input-gradient-end'),
  imageOpacity: document.getElementById('input-image-opacity'),
  overlayOpacity: document.getElementById('input-overlay-opacity'),
  image: document.getElementById('input-image')
};

const rangeOutputs = {
  size: document.getElementById('value-size'),
  bodySize: document.getElementById('value-body-size'),
  lineHeight: document.getElementById('value-line-height'),
  letterSpacing: document.getElementById('value-letter-spacing'),
  rotation: document.getElementById('value-rotation'),
  x: document.getElementById('value-x'),
  y: document.getElementById('value-y'),
  imageScale: document.getElementById('value-image-scale'),
  imageX: document.getElementById('value-image-x'),
  imageY: document.getElementById('value-image-y'),
  imageOpacity: document.getElementById('value-image-opacity'),
  overlayOpacity: document.getElementById('value-overlay-opacity')
};

function createScene(overrides = {}) {
  const theme = themeDefinitions[project.theme];
  return {
    id: `scene-${Math.random().toString(36).slice(2, 9)}`,
    name: 'Neue Szene',
    brand: 'Brand',
    kicker: 'Campaign',
    title: 'NEW\nDROP',
    body: 'Schreibe hier deine kurze Social-Media-Botschaft, Value Proposition oder Hook.',
    cta: 'Mehr sehen',
    displayFont: theme.displayFont,
    bodyFont: theme.bodyFont,
    align: 'left',
    size: 178,
    bodySize: 46,
    lineHeight: 0.88,
    letterSpacing: 0,
    rotation: 0,
    x: 0,
    y: 0,
    strokeWidth: 0,
    bgMode: theme.bgMode,
    bgColor: theme.bgColor,
    gradientStart: theme.gradientStart,
    gradientEnd: theme.gradientEnd,
    gradientAngle: theme.gradientAngle,
    textColor: theme.textColor,
    bodyColor: theme.bodyColor,
    accentColor: theme.accentColor,
    imageSrc: '',
    imageElement: null,
    imageOpacity: 0.42,
    imageScale: 1,
    imageX: 0,
    imageY: 0,
    overlayOpacity: 0.22,
    panelStyle: theme.panelStyle,
    animType: 'slide-up',
    animDuration: 420,
    duration: 1200,
    ...overrides
  };
}

function setStatus(message) {
  statusMsg.textContent = message;
}

function populateProjectControls() {
  formatSelect.innerHTML = Object.entries(formatDefinitions)
    .map(([value, config]) => `<option value="${value}">${config.label}</option>`)
    .join('');

  themeSelect.innerHTML = Object.entries(themeDefinitions)
    .map(([value, config]) => `<option value="${value}">${config.label}</option>`)
    .join('');

  formatSelect.value = project.format;
  themeSelect.value = project.theme;
  safeToggle.checked = true;
}

function createThemePills() {
  themePills.innerHTML = '';

  Object.entries(themeDefinitions).forEach(([key, theme]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `theme-pill ${project.theme === key ? 'active' : ''}`;
    button.textContent = theme.label;
    button.addEventListener('click', () => {
      project.theme = key;
      themeSelect.value = key;
      applyThemeToScene(scenes[currentSceneIndex], key);
      updateUI();
      updateThemePills();
      setStatus(`Theme "${theme.label}" auf aktuelle Szene angewendet.`);
    });
    themePills.appendChild(button);
  });
}

function updateThemePills() {
  [...themePills.children].forEach((pill, index) => {
    const key = Object.keys(themeDefinitions)[index];
    pill.classList.toggle('active', project.theme === key);
  });
}

function applyThemeToScene(scene, themeKey) {
  const theme = themeDefinitions[themeKey];
  Object.assign(scene, {
    displayFont: theme.displayFont,
    bodyFont: theme.bodyFont,
    bgMode: theme.bgMode,
    bgColor: theme.bgColor,
    gradientStart: theme.gradientStart,
    gradientEnd: theme.gradientEnd,
    gradientAngle: theme.gradientAngle,
    textColor: theme.textColor,
    bodyColor: theme.bodyColor,
    accentColor: theme.accentColor,
    panelStyle: theme.panelStyle
  });
}

function currentFormat() {
  return formatDefinitions[project.format];
}

function setCanvasFormat() {
  const format = currentFormat();
  canvas.width = format.width;
  canvas.height = format.height;
  previewFrame.style.aspectRatio = `${format.width} / ${format.height}`;

  safeOverlay.style.display = safeToggle.checked ? 'block' : 'none';
  safeOverlay.style.setProperty('--safe-top', `${(format.safeTop / format.height) * 100}%`);
  safeOverlay.style.setProperty('--safe-bottom', `${(format.safeBottom / format.height) * 100}%`);

  document.getElementById('meta-dimensions').textContent = `${format.width} x ${format.height}`;
  document.getElementById('meta-ratio').textContent = format.ratio;
  document.getElementById('meta-hint').textContent = format.recommendation;
}

function updateProjectSummary() {
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  document.getElementById('meta-duration').textContent = `${(totalDuration / 1000).toFixed(1)}s`;
}

function updateSceneList() {
  sceneList.innerHTML = '';

  scenes.forEach((scene, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `scene-card ${index === currentSceneIndex ? 'active' : ''}`;
    card.innerHTML = `
      <div class="scene-card-head">
        <strong>${escapeHtml(scene.name || `Szene ${index + 1}`)}</strong>
        <span class="scene-chip">${scene.animType}</span>
      </div>
      <p>${escapeHtml(scene.title.replace(/\n/g, ' / '))}</p>
      <p>${scene.duration} ms</p>
    `;
    card.addEventListener('click', () => {
      currentSceneIndex = index;
      updateUI();
    });
    sceneList.appendChild(card);
  });
}

function updateEditor() {
  const scene = scenes[currentSceneIndex];
  if (!scene) return;

  inputs.name.value = scene.name;
  inputs.brand.value = scene.brand;
  inputs.kicker.value = scene.kicker;
  inputs.title.value = scene.title;
  inputs.body.value = scene.body;
  inputs.cta.value = scene.cta;
  inputs.animType.value = scene.animType;
  inputs.panelStyle.value = scene.panelStyle;
  inputs.animDuration.value = scene.animDuration;
  inputs.duration.value = scene.duration;
  inputs.displayFont.value = scene.displayFont;
  inputs.bodyFont.value = scene.bodyFont;
  inputs.align.value = scene.align;
  inputs.strokeWidth.value = scene.strokeWidth;
  inputs.size.value = scene.size;
  inputs.bodySize.value = scene.bodySize;
  inputs.lineHeight.value = scene.lineHeight;
  inputs.letterSpacing.value = scene.letterSpacing;
  inputs.rotation.value = scene.rotation;
  inputs.x.value = scene.x;
  inputs.y.value = scene.y;
  inputs.imageScale.value = scene.imageScale;
  inputs.imageX.value = scene.imageX;
  inputs.imageY.value = scene.imageY;
  inputs.bgMode.value = scene.bgMode;
  inputs.gradientAngle.value = scene.gradientAngle;
  inputs.textColor.value = scene.textColor;
  inputs.accentColor.value = scene.accentColor;
  inputs.bodyColor.value = scene.bodyColor;
  inputs.bgColor.value = scene.bgColor;
  inputs.gradientStart.value = scene.gradientStart;
  inputs.gradientEnd.value = scene.gradientEnd;
  inputs.imageOpacity.value = scene.imageOpacity;
  inputs.overlayOpacity.value = scene.overlayOpacity;

  Object.entries(rangeOutputs).forEach(([key, output]) => {
    output.textContent = scene[key];
  });
}

function updateCaptionOutput() {
  const format = currentFormat();
  const scene = scenes[currentSceneIndex];
  const headline = scene.title.replace(/\n/g, ' ').trim();
  const post = [
    `${project.name} / ${format.label}`,
    '',
    `${headline}. ${project.caption}`,
    '',
    `${scene.cta} ${project.handle}`.trim(),
    '',
    project.hashtags,
    '',
    `Hinweis: ${format.captionHint}`
  ].join('\n');

  document.getElementById('caption-output').value = post.trim();
}

function updateUI() {
  setCanvasFormat();
  updateProjectSummary();
  updateSceneList();
  updateEditor();
  updateCaptionOutput();
  renderCurrentScene(1);
}

function renderCurrentScene(progress = 1) {
  const scene = scenes[currentSceneIndex];
  if (!scene) return;
  renderScene(scene, progress);
}

function renderScene(scene, progress = 1) {
  const { width, height, safeTop, safeBottom } = currentFormat();

  ctx.clearRect(0, 0, width, height);

  drawBackground(scene, width, height);
  drawPanelStyle(scene, width, height);

  const introProgress = scene.animDuration > 0
    ? Math.min(1, (progress * scene.duration) / scene.animDuration)
    : 1;
  const ease = 1 - Math.pow(1 - introProgress, 3);
  const motion = getMotionState(scene, ease, width, height);

  const alignMap = {
    left: { x: width * 0.12, align: 'left' },
    center: { x: width * 0.5, align: 'center' },
    right: { x: width * 0.88, align: 'right' }
  };

  const anchor = alignMap[scene.align] || alignMap.left;
  const safeContentTop = safeTop + 72;
  const ctaY = height - safeBottom - 80;
  const contentX = anchor.x + scene.x + motion.x;
  const baseY = height * 0.43 + scene.y + motion.y;
  const titleLines = scene.title.toUpperCase().split('\n');
  const titleLineHeight = scene.size * scene.lineHeight;
  const titleHeight = titleLines.length * titleLineHeight;
  const titleStartY = -titleHeight * 0.45;

  ctx.save();
  ctx.globalAlpha = motion.alpha;
  drawBadge(scene.brand, contentX, safeContentTop, scene, anchor.align);
  drawKicker(scene.kicker, contentX, baseY + titleStartY - 80, scene, anchor.align);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = motion.alpha;
  ctx.translate(contentX, baseY);
  ctx.rotate(((scene.rotation + motion.rotation) * Math.PI) / 180);
  ctx.scale(motion.scale, motion.scale);
  ctx.textAlign = anchor.align;
  ctx.textBaseline = 'alphabetic';

  ctx.font = `900 ${scene.size}px "${scene.displayFont}"`;
  ctx.fillStyle = scene.textColor;
  ctx.strokeStyle = scene.textColor;
  ctx.lineWidth = scene.strokeWidth;

  titleLines.forEach((line, index) => {
    const y = titleStartY + index * titleLineHeight;

    if (scene.animType === 'reveal' && introProgress < 1) {
      ctx.save();
      const revealHeight = Math.max(0, titleLineHeight * (introProgress * titleLines.length - index));
      ctx.beginPath();
      ctx.rect(-width, y - titleLineHeight, width * 2, revealHeight * 1.4);
      ctx.clip();
      drawTrackedText(ctx, line, 0, y, scene.letterSpacing, anchor.align, scene.strokeWidth > 0);
      ctx.restore();
      return;
    }

    drawTrackedText(ctx, line, 0, y, scene.letterSpacing, anchor.align, scene.strokeWidth > 0);
  });

  const bodyLines = wrapText(scene.body, scene.bodyFont, scene.bodySize, width * 0.7);
  ctx.font = `600 ${scene.bodySize}px "${scene.bodyFont}"`;
  ctx.fillStyle = scene.bodyColor;

  const bodyLineHeight = scene.bodySize * 1.28;
  const bodyStartY = titleStartY + titleHeight + scene.bodySize * 0.6;
  bodyLines.forEach((line, index) => {
    const y = bodyStartY + index * bodyLineHeight;
    ctx.globalAlpha = motion.alpha * (scene.animType === 'flicker' ? (Math.random() > 0.18 ? 1 : 0.35) : 1);
    drawTrackedText(ctx, line, 0, y, 0, anchor.align, false);
  });

  ctx.globalAlpha = motion.alpha;
  drawCTA(scene.cta, 0, ctaY - baseY, scene, anchor.align);
  ctx.restore();

  ctx.globalAlpha = 1;
}

function drawBackground(scene, width, height) {
  if (scene.bgMode === 'solid') {
    ctx.fillStyle = scene.bgColor;
    ctx.fillRect(0, 0, width, height);
  } else {
    const angle = (scene.gradientAngle * Math.PI) / 180;
    const x1 = width / 2 - Math.cos(angle) * width;
    const y1 = height / 2 - Math.sin(angle) * height;
    const x2 = width / 2 + Math.cos(angle) * width;
    const y2 = height / 2 + Math.sin(angle) * height;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, scene.gradientStart);
    gradient.addColorStop(1, scene.gradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  if (scene.imageElement) {
    const image = scene.imageElement;
    const coverScale = Math.max(width / image.width, height / image.height) * scene.imageScale;
    const renderWidth = image.width * coverScale;
    const renderHeight = image.height * coverScale;

    ctx.save();
    ctx.globalAlpha = scene.imageOpacity;
    ctx.drawImage(
      image,
      (width - renderWidth) / 2 + scene.imageX,
      (height - renderHeight) / 2 + scene.imageY,
      renderWidth,
      renderHeight
    );
    ctx.restore();
  }

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.12,
    width * 0.5,
    height * 0.5,
    width * 0.8
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, `rgba(0,0,0,${scene.overlayOpacity})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawPanelStyle(scene, width, height) {
  ctx.save();

  if (scene.panelStyle === 'frame') {
    ctx.strokeStyle = `${scene.accentColor}66`;
    ctx.lineWidth = Math.max(4, width * 0.005);
    roundRectPath(ctx, width * 0.06, height * 0.05, width * 0.88, height * 0.9, width * 0.04);
    ctx.stroke();
  }

  if (scene.panelStyle === 'split') {
    ctx.fillStyle = `${scene.accentColor}25`;
    ctx.fillRect(width * 0.07, 0, width * 0.1, height);
    ctx.fillStyle = `${scene.accentColor}70`;
    ctx.fillRect(width * 0.11, height * 0.06, width * 0.012, height * 0.88);
  }

  if (scene.panelStyle === 'badge') {
    ctx.fillStyle = `${scene.accentColor}30`;
    ctx.beginPath();
    ctx.arc(width * 0.82, height * 0.18, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  if (scene.panelStyle === 'glow') {
    const glow = ctx.createRadialGradient(width * 0.82, height * 0.18, 0, width * 0.82, height * 0.18, width * 0.3);
    glow.addColorStop(0, `${scene.accentColor}90`);
    glow.addColorStop(1, `${scene.accentColor}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

function drawBadge(text, x, y, scene, align) {
  if (!text.trim()) return;

  ctx.save();
  ctx.font = `700 ${Math.max(24, scene.bodySize * 0.5)}px "${scene.bodyFont}"`;
  const metrics = ctx.measureText(text.toUpperCase());
  const paddingX = 24;
  const paddingY = 16;
  const width = metrics.width + paddingX * 2;
  const height = Math.max(54, scene.bodySize * 0.95);
  const originX = align === 'center'
    ? x - width / 2
    : align === 'right'
      ? x - width
      : x;

  ctx.fillStyle = scene.accentColor;
  roundRect(ctx, originX, y, width, height, height / 2);
  ctx.fill();

  ctx.fillStyle = scene.bgColor.toLowerCase() === '#efe4d2' ? '#1b130f' : '#0a0c10';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  drawTrackedText(ctx, text.toUpperCase(), align === 'center' ? x : align === 'right' ? x - paddingX : x + paddingX, y + height / 2, 1, align, false);
  ctx.restore();
}

function drawKicker(text, x, y, scene, align) {
  if (!text.trim()) return;

  ctx.save();
  ctx.font = `700 ${Math.max(18, scene.bodySize * 0.42)}px "${scene.bodyFont}"`;
  ctx.fillStyle = scene.accentColor;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  drawTrackedText(ctx, text.toUpperCase(), x, y, 3, align, false);
  ctx.restore();
}

function drawCTA(text, x, y, scene, align) {
  if (!text.trim()) return;

  ctx.save();
  ctx.font = `700 ${Math.max(24, scene.bodySize * 0.6)}px "${scene.bodyFont}"`;
  const display = text.toUpperCase();
  const metrics = ctx.measureText(display);
  const paddingX = 24;
  const height = Math.max(58, scene.bodySize * 1.2);
  let originX = x;

  if (align === 'center') originX = x - metrics.width / 2 - paddingX;
  if (align === 'right') originX = x - metrics.width - paddingX * 2;

  ctx.fillStyle = `${scene.accentColor}22`;
  roundRect(ctx, originX, y - height + 12, metrics.width + paddingX * 2, height, height / 2);
  ctx.fill();

  ctx.strokeStyle = `${scene.accentColor}88`;
  ctx.lineWidth = 2;
  roundRect(ctx, originX, y - height + 12, metrics.width + paddingX * 2, height, height / 2);
  ctx.stroke();

  ctx.fillStyle = scene.textColor;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  drawTrackedText(ctx, display, x, y - 18, 1, align, false);
  ctx.restore();
}

function getMotionState(scene, ease, width, height) {
  const state = {
    x: 0,
    y: 0,
    alpha: 1,
    scale: 1,
    rotation: 0
  };

  if (ease >= 1 || scene.animType === 'none') return state;

  if (scene.animType === 'slide-up') {
    state.y = (1 - ease) * height * 0.12;
    state.alpha = 0.2 + ease * 0.8;
  }

  if (scene.animType === 'slide-right') {
    state.x = (1 - ease) * -width * 0.18;
    state.alpha = 0.2 + ease * 0.8;
  }

  if (scene.animType === 'snap') {
    state.scale = 0.78 + ease * 0.22;
    state.alpha = ease;
  }

  if (scene.animType === 'flicker') {
    state.alpha = Math.random() > 0.3 ? 1 : 0.25;
    state.x = (Math.random() - 0.5) * width * 0.015;
    state.rotation = (Math.random() - 0.5) * 2.5;
  }

  if (scene.animType === 'reveal') {
    state.alpha = 0.4 + ease * 0.6;
  }

  if (scene.animType === 'drift') {
    state.y = (1 - ease) * -height * 0.06;
    state.scale = 1.06 - ease * 0.06;
    state.alpha = 0.25 + ease * 0.75;
  }

  return state;
}

function wrapText(text, fontFamily, fontSize, maxWidth) {
  ctx.save();
  ctx.font = `600 ${fontSize}px "${fontFamily}"`;

  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  });

  if (line) lines.push(line);
  ctx.restore();
  return lines;
}

function drawTrackedText(context, text, x, y, letterSpacing, align, strokeOnly) {
  if (!letterSpacing) {
    if (strokeOnly) {
      context.strokeText(text, x, y);
    } else {
      context.fillText(text, x, y);
    }
    return;
  }

  const chars = [...text];
  const widths = chars.map((char) => context.measureText(char).width);
  const textWidth = widths.reduce((sum, width) => sum + width, 0) + letterSpacing * Math.max(0, chars.length - 1);
  let drawX = x;

  if (align === 'center') drawX = x - textWidth / 2;
  if (align === 'right') drawX = x - textWidth;

  chars.forEach((char, index) => {
    if (strokeOnly) {
      context.strokeText(char, drawX, y);
    } else {
      context.fillText(char, drawX, y);
    }
    drawX += widths[index] + letterSpacing;
  });
}

function roundRect(context, x, y, width, height, radius) {
  roundRectPath(context, x, y, width, height, radius);
}

function roundRectPath(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function downloadDataUrl(filename, url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

function fileSafeName(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'scene';
}

async function loadSceneImage(scene, source) {
  if (!source) {
    scene.imageSrc = '';
    scene.imageElement = null;
    return;
  }

  const image = new Image();
  image.decoding = 'async';
  image.src = source;
  await image.decode();
  scene.imageSrc = source;
  scene.imageElement = image;
}

function serializeProject() {
  return {
    project,
    scenes: scenes.map((scene) => ({
      ...scene,
      imageElement: undefined
    }))
  };
}

async function hydrateScenes(items) {
  return Promise.all(items.map(async (scene) => {
    const nextScene = createScene(scene);
    if (scene.imageSrc) {
      await loadSceneImage(nextScene, scene.imageSrc);
    }
    return nextScene;
  }));
}

async function playPreview() {
  if (isPlaying) return;
  isPlaying = true;
  setStatus('Preview laeuft...');

  for (let index = 0; index < scenes.length; index += 1) {
    currentSceneIndex = index;
    updateSceneList();
    updateCaptionOutput();

    const scene = scenes[index];
    const start = performance.now();

    await new Promise((resolve) => {
      const frame = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(1, elapsed / scene.duration);
        renderScene(scene, progress);

        if (progress < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };

      rafId = requestAnimationFrame(frame);
    });
  }

  isPlaying = false;
  setStatus('Preview beendet.');
}

function bindProjectFields() {
  document.getElementById('project-name').addEventListener('input', (event) => {
    project.name = event.target.value;
    updateCaptionOutput();
  });

  document.getElementById('project-handle').addEventListener('input', (event) => {
    project.handle = event.target.value;
    updateCaptionOutput();
  });

  document.getElementById('project-caption').addEventListener('input', (event) => {
    project.caption = event.target.value;
    updateCaptionOutput();
  });

  document.getElementById('project-hashtags').addEventListener('input', (event) => {
    project.hashtags = event.target.value;
    updateCaptionOutput();
  });

  formatSelect.addEventListener('change', (event) => {
    project.format = event.target.value;
    updateUI();
  });

  themeSelect.addEventListener('change', (event) => {
    project.theme = event.target.value;
    applyThemeToScene(scenes[currentSceneIndex], project.theme);
    updateThemePills();
    updateUI();
  });

  safeToggle.addEventListener('change', updateUI);
}

function bindSceneInputs() {
  const numericKeys = new Set([
    'animDuration',
    'duration',
    'strokeWidth',
    'size',
    'bodySize',
    'rotation',
    'x',
    'y',
    'imageX',
    'imageY',
    'gradientAngle'
  ]);

  const floatKeys = new Set([
    'lineHeight',
    'letterSpacing',
    'imageScale',
    'imageOpacity',
    'overlayOpacity'
  ]);

  let renderDebounceTimer;
  Object.entries(inputs).forEach(([key, element]) => {
    if (key === 'image') return;

    element.addEventListener('input', () => {
      const scene = scenes[currentSceneIndex];
      if (!scene) return;

      let value = element.value;
      if (numericKeys.has(key)) value = Number.parseInt(value, 10) || 0;
      if (floatKeys.has(key)) value = Number.parseFloat(value) || 0;

      scene[key] = value;

      if (rangeOutputs[key]) {
        rangeOutputs[key].textContent = value;
      }

      clearTimeout(renderDebounceTimer);
      renderDebounceTimer = setTimeout(() => {
        updateSceneList();
        updateCaptionOutput();
        renderCurrentScene(1);
      }, 70);
    });
  });

  inputs.image.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await loadSceneImage(scenes[currentSceneIndex], reader.result);
        updateUI();
        setStatus('Bild geladen.');
      } catch {
        setStatus('Bild konnte nicht verarbeitet werden.');
      }
    };
    reader.readAsDataURL(file);
  });
}

function bindSceneActions() {
  document.getElementById('add-scene').addEventListener('click', () => {
    scenes.push(createScene({ name: `Szene ${scenes.length + 1}` }));
    currentSceneIndex = scenes.length - 1;
    updateUI();
    setStatus('Neue Szene angelegt.');
  });

  document.getElementById('duplicate-scene').addEventListener('click', async () => {
    const source = scenes[currentSceneIndex];
    const duplicate = createScene({ ...source, id: `scene-${Math.random().toString(36).slice(2, 9)}` });
    if (source.imageSrc) {
      await loadSceneImage(duplicate, source.imageSrc);
    }
    scenes.splice(currentSceneIndex + 1, 0, duplicate);
    currentSceneIndex += 1;
    updateUI();
    setStatus('Szene dupliziert.');
  });

  document.getElementById('delete-scene').addEventListener('click', () => {
    if (scenes.length === 1) {
      setStatus('Mindestens eine Szene muss bleiben.');
      return;
    }

    scenes.splice(currentSceneIndex, 1);
    currentSceneIndex = Math.max(0, currentSceneIndex - 1);
    updateUI();
    setStatus('Szene geloescht.');
  });

  document.getElementById('move-scene-up').addEventListener('click', () => {
    if (currentSceneIndex === 0) return;
    [scenes[currentSceneIndex - 1], scenes[currentSceneIndex]] = [scenes[currentSceneIndex], scenes[currentSceneIndex - 1]];
    currentSceneIndex -= 1;
    updateUI();
  });

  document.getElementById('move-scene-down').addEventListener('click', () => {
    if (currentSceneIndex >= scenes.length - 1) return;
    [scenes[currentSceneIndex + 1], scenes[currentSceneIndex]] = [scenes[currentSceneIndex], scenes[currentSceneIndex + 1]];
    currentSceneIndex += 1;
    updateUI();
  });

  document.getElementById('clear-image').addEventListener('click', () => {
    scenes[currentSceneIndex].imageSrc = '';
    scenes[currentSceneIndex].imageElement = null;
    updateUI();
    setStatus('Bild entfernt.');
  });

  document.getElementById('apply-theme-all').addEventListener('click', () => {
    scenes.forEach((scene) => applyThemeToScene(scene, project.theme));
    updateUI();
    setStatus(`Theme "${themeDefinitions[project.theme].label}" auf alle Szenen angewendet.`);
  });
}

function bindExports() {
  document.getElementById('play-btn').addEventListener('click', playPreview);

  document.getElementById('export-current').addEventListener('click', () => {
    renderCurrentScene(1);
    const scene = scenes[currentSceneIndex];
    downloadDataUrl(`${fileSafeName(scene.name)}.png`, canvas.toDataURL('image/png'));
    setStatus('Aktuelle Szene als PNG exportiert.');
  });

  document.getElementById('export-all').addEventListener('click', async () => {
    for (let index = 0; index < scenes.length; index += 1) {
      currentSceneIndex = index;
      renderCurrentScene(1);
      const scene = scenes[index];
      downloadDataUrl(`${String(index + 1).padStart(2, '0')}-${fileSafeName(scene.name)}.png`, canvas.toDataURL('image/png'));
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
    updateUI();
    setStatus('Alle PNGs exportiert.');
  });

  document.getElementById('export-video').addEventListener('click', async () => {
    if (typeof MediaRecorder === 'undefined') {
      setStatus('WebM Export wird im aktuellen Browser nicht unterstuetzt.');
      return;
    }

    const stream = canvas.captureStream(60);
    const chunks = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 8_000_000
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      downloadDataUrl(`${fileSafeName(project.name)}.webm`, url);
      setStatus('WebM Export abgeschlossen.');
      URL.revokeObjectURL(url);
    };

    recorder.start();
    await playPreview();
    recorder.stop();
  });

  document.getElementById('save-project').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(serializeProject(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(`${fileSafeName(project.name)}.json`, url);
    setStatus('Projekt gespeichert.');
    URL.revokeObjectURL(url);
  });

  const importInput = document.getElementById('project-import');
  document.getElementById('load-project').addEventListener('click', () => importInput.click());

  importInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);
    Object.assign(project, data.project);
    scenes = await hydrateScenes(data.scenes);
    currentSceneIndex = 0;

    document.getElementById('project-name').value = project.name;
    document.getElementById('project-handle').value = project.handle;
    document.getElementById('project-caption').value = project.caption;
    document.getElementById('project-hashtags').value = project.hashtags;
    formatSelect.value = project.format;
    themeSelect.value = project.theme;
    updateThemePills();
    updateUI();
    setStatus('Projekt geladen.');
  });

  document.getElementById('copy-caption').addEventListener('click', async () => {
    const content = document.getElementById('caption-output').value;
    try {
      await navigator.clipboard.writeText(content);
      setStatus('Caption in die Zwischenablage kopiert.');
    } catch {
      setStatus('Zwischenablage nicht verfuegbar.');
    }
  });
}

function init() {
  populateProjectControls();
  createThemePills();
  bindProjectFields();
  bindSceneInputs();
  bindSceneActions();
  bindExports();
  updateUI();
  setStatus('Generator bereit.');
}

init();
