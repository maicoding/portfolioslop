import './slop-o-matic.css';
import { getRandomAiImageUrl } from './ai-images.js';
import {
  getRandomOutputImageUrl,
  getRandomOutputScreenshotUrl,
} from './output-media.js';

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const platformSelect = document.getElementById('platform-select');
const assetSelect = document.getElementById('asset-select');
const promptInput = document.getElementById('prompt-input');
const headlineInput = document.getElementById('headline-input');
const captionInput = document.getElementById('caption-input');
const fullAutoBtn = document.getElementById('full-auto-btn');
const manualGenBtn = document.getElementById('manual-gen-btn');
const exportBtn = document.getElementById('export-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const metaSize = document.getElementById('meta-size');

const presets = {
  carousel: { label: 'Instagram Carousel (4:5)', w: 1080, h: 1350 },
  instagram: { label: 'Instagram Square (1:1)', w: 1080, h: 1080 },
  tiktok: { label: 'TikTok Fullscreen (9:16)', w: 1080, h: 1920 },
  linkedin: { label: 'LinkedIn Update', w: 1200, h: 627 },
  google: { label: 'Google Search Screenshot', w: 1200, h: 450 },
  apple: { label: 'Apple Minimal', w: 1920, h: 1080 },
  luxury: { label: 'Luxury Gold', w: 1080, h: 1350 },
  neon: { label: 'Cyber Neon', w: 1080, h: 1080 },
  poster: { label: 'Poster A3 Style', w: 1000, h: 1414 },
  minimal: { label: 'Ultra Minimal', w: 1000, h: 1000 },
  pitch: { label: 'Pitch Deck Slide', w: 1920, h: 1080 },
  canva: { label: 'Canva Editor', w: 1920, h: 1080 },
  midjourney: { label: 'Midjourney /imagine', w: 1200, h: 1200 },
  dribbble: { label: 'Dribbble Shot', w: 1600, h: 1200 },
  dashboard: { label: 'SaaS Dashboard', w: 1920, h: 1200 },
};

const headlineBank = [
  'UNLEASH 10K DESIGNS PER MINUTE',
  'ACHIEVE MORE. SELL MORE.',
  'AUTOMATE THE TASTE GAP',
  'TOTAL SATIATION FOR YOUR BRAND',
  'NO TEAM. JUST THROUGHPUT.',
  'HYPERSCALE YOUR MOODBOARD',
];

const captionBank = [
  '10,000 designs. 0 certainty. Infinite output.',
  'Replace judgement with volume and call it strategy.',
  'From premium keynote to cursed carousel in under a minute.',
  'More variants, more confusion, more conversion theatre.',
  'Designed for feeds that forgot how to stop scrolling.',
];

const promptBank = [
  'hypercommercial ad collage, impossible productivity dashboard, oversaturated luxury metal, glossy plastic optimism',
  'net art meets startup deck, cursed UI screenshot, synthetic glow, post-human marketing theatre',
  'editorial brutality, cyber retail hallucination, performance metrics as religion, screaming typography',
  'imagined dribbble shot, synthetic fashion render, funnel arrows, fake KPI success aura',
  'google ad meets ai prophecy, smooth gradients fighting sharp serif, content factory tension',
];

let currentImage = null;

Object.entries(presets).forEach(([value, preset]) => {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = preset.label;
  platformSelect.appendChild(option);
});

platformSelect.value = 'carousel';

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const loadImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const getAssetUrl = () => {
  if (assetSelect.value === 'archive') return getRandomAiImageUrl();
  if (assetSelect.value === 'output') return getRandomOutputImageUrl() || getRandomOutputScreenshotUrl();

  return (
    getRandomAiImageUrl() ||
    getRandomOutputImageUrl() ||
    getRandomOutputScreenshotUrl()
  );
};

const setLoading = (isLoading, text = 'Optimiere Sinnlosigkeit...') => {
  loadingText.textContent = text;
  loadingOverlay.classList.toggle('hidden', !isLoading);
};

const autoFill = async () => {
  setLoading(true, 'Synthesizing empty desire...');
  await wait(220);

  promptInput.value = pick(promptBank);
  headlineInput.value = pick(headlineBank);
  captionInput.value = pick(captionBank);
  currentImage = await loadImage(getAssetUrl());

  drawCanvas();
  setLoading(false);
};

const manualRender = async () => {
  setLoading(true, 'Rendering controlled slop...');
  await wait(160);
  currentImage = await loadImage(getAssetUrl());
  drawCanvas();
  setLoading(false);
};

const drawBackgroundAsset = (w, h) => {
  if (!currentImage) return;

  const scale = Math.max(w / currentImage.width, h / currentImage.height);
  const width = currentImage.width * scale;
  const height = currentImage.height * scale;
  const x = (w - width) / 2;
  const y = (h - height) / 2;

  ctx.save();
  ctx.filter = 'grayscale(100%) contrast(120%) saturate(85%)';
  ctx.drawImage(currentImage, x, y, width, height);
  ctx.restore();
};

const drawTexture = (w, h) => {
  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 28; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#ff3e00' : '#00f0ff';
    ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 160 + 40, 2);
  }
  ctx.restore();
};

const wrapText = (context, text, x, y, maxWidth, lineHeight, align = 'left') => {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  context.textAlign = align;
  context.textBaseline = 'top';

  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    if (context.measureText(testLine).width > maxWidth && index > 0) {
      lines.push(line.trim());
      line = `${word} `;
    } else {
      line = testLine;
    }
  });

  lines.push(line.trim());

  lines.forEach((entry, index) => {
    context.fillText(entry, x, y + index * lineHeight);
  });

  return lines.length * lineHeight;
};

const drawCanvas = () => {
  const preset = presets[platformSelect.value];
  const head = headlineInput.value || pick(headlineBank);
  const copy = captionInput.value || pick(captionBank);
  const prompt = promptInput.value || pick(promptBank);

  canvas.width = preset.w;
  canvas.height = preset.h;
  metaSize.textContent = `${preset.w} x ${preset.h}`;

  ctx.clearRect(0, 0, preset.w, preset.h);

  const darkPlatforms = new Set(['carousel', 'instagram', 'tiktok', 'neon', 'midjourney', 'pitch', 'dashboard']);
  ctx.fillStyle = darkPlatforms.has(platformSelect.value) ? '#050505' : '#f6f2eb';
  ctx.fillRect(0, 0, preset.w, preset.h);

  drawBackgroundAsset(preset.w, preset.h);

  ctx.save();
  ctx.fillStyle = darkPlatforms.has(platformSelect.value) ? 'rgba(0,0,0,0.54)' : 'rgba(255,255,255,0.36)';
  ctx.fillRect(0, 0, preset.w, preset.h);
  ctx.restore();

  drawTexture(preset.w, preset.h);

  switch (platformSelect.value) {
    case 'carousel':
      drawCarousel(preset, head, copy);
      break;
    case 'instagram':
      drawInstagram(preset, head, copy);
      break;
    case 'tiktok':
      drawTikTok(preset, head, copy);
      break;
    case 'linkedin':
      drawLinkedIn(preset, head, copy);
      break;
    case 'google':
      drawGoogle(preset, head, copy);
      break;
    case 'apple':
      drawApple(preset, head, copy);
      break;
    case 'luxury':
      drawLuxury(preset, head, copy);
      break;
    case 'neon':
      drawNeon(preset, head, copy);
      break;
    case 'poster':
      drawPoster(preset, head, copy);
      break;
    case 'minimal':
      drawMinimal(preset, head, copy);
      break;
    case 'pitch':
      drawPitch(preset, head, copy);
      break;
    case 'canva':
      drawCanva(preset, head, copy);
      break;
    case 'midjourney':
      drawMidjourney(preset, head, prompt);
      break;
    case 'dribbble':
      drawDribbble(preset, head, copy);
      break;
    case 'dashboard':
      drawDashboard(preset, head, copy);
      break;
    default:
      drawPoster(preset, head, copy);
      break;
  }
};

const drawCarousel = ({ w, h }, head, copy) => {
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, h - 360, w, 360);
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.fillRect(w - 60, 0, 60, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 66px "Space Grotesk", sans-serif';
  const offset = wrapText(ctx, head, 52, h - 320, w - 150, 70);
  ctx.font = '400 28px Inter, sans-serif';
  wrapText(ctx, copy, 52, h - 320 + offset + 16, w - 150, 34);
};

const drawInstagram = ({ w, h }, head, copy) => {
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(40, 40, w - 80, h - 80);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px Inter, sans-serif';
  const offset = wrapText(ctx, head, 70, h - 260, w - 140, 66);
  ctx.font = '400 24px Inter, sans-serif';
  wrapText(ctx, copy, 70, h - 260 + offset + 18, w - 140, 30);
};

const drawTikTok = ({ w, h }, head, copy) => {
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 94px "Space Grotesk", sans-serif';
  const offset = wrapText(ctx, head, 60, h * 0.48, w - 120, 98);
  ctx.font = '700 30px "IBM Plex Mono", monospace';
  ctx.fillText('SYSTEM_OVERFLOW', 60, h * 0.48 - 60);
  ctx.font = '400 32px Inter, sans-serif';
  wrapText(ctx, copy, 60, h * 0.48 + offset + 26, w - 170, 42);
};

const drawLinkedIn = ({ w, h }, head, copy) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, 110);
  ctx.fillStyle = '#111111';
  ctx.font = '700 26px Inter, sans-serif';
  ctx.fillText('AI Slop Solutions / Promoted', 28, 35);
  ctx.font = '400 18px Inter, sans-serif';
  ctx.fillText('replaced 5,000 moods before lunch', 28, 68);
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, h - 150, w, 150);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 38px Inter, sans-serif';
  wrapText(ctx, head, 30, h - 118, w - 280, 42);
  ctx.fillStyle = '#0a66c2';
  ctx.fillRect(w - 240, h - 92, 210, 54);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCALE NOW', w - 135, h - 76);
  ctx.textAlign = 'left';
};

const drawGoogle = ({ w, h }, head, copy) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#70757a';
  ctx.font = '14px Arial, sans-serif';
  ctx.fillText('Gesponsert • https://totalsatiation.ai', 40, 42);
  ctx.fillStyle = '#1a0dab';
  ctx.font = '34px Arial, sans-serif';
  const offset = wrapText(ctx, head, 40, 74, w - 80, 40);
  ctx.fillStyle = '#3c4043';
  ctx.font = '18px Arial, sans-serif';
  wrapText(ctx, copy, 40, 74 + offset + 18, w - 100, 26);
};

const drawApple = ({ w, h }, head, copy) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, 240);
  ctx.fillStyle = '#111111';
  ctx.font = '800 84px Inter, sans-serif';
  const offset = wrapText(ctx, head, w / 2, h - 290, w - 260, 88, 'center');
  ctx.font = '300 30px Inter, sans-serif';
  wrapText(ctx, copy, w / 2, h - 290 + offset + 18, w - 340, 38, 'center');
};

const drawLuxury = ({ w, h }, head, copy) => {
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 20;
  ctx.strokeRect(60, 60, w - 120, h - 120);
  ctx.fillStyle = '#d4af37';
  ctx.font = '700 62px "Space Grotesk", sans-serif';
  const offset = wrapText(ctx, head, w / 2, h - 320, w - 240, 70, 'center');
  ctx.font = '400 22px "IBM Plex Mono", monospace';
  wrapText(ctx, copy.toUpperCase(), w / 2, h - 320 + offset + 28, w - 300, 30, 'center');
};

const drawNeon = ({ w, h }, head, copy) => {
  ctx.shadowBlur = 28;
  ctx.shadowColor = '#00f0ff';
  ctx.fillStyle = '#00f0ff';
  ctx.font = '900 90px "Space Grotesk", sans-serif';
  const offset = wrapText(ctx, head, 64, 86, w - 128, 96);
  ctx.shadowColor = '#ff00f0';
  ctx.fillStyle = '#ff00f0';
  ctx.font = '700 34px "IBM Plex Mono", monospace';
  wrapText(ctx, copy, 64, 96 + offset + 40, w - 180, 40);
  ctx.shadowBlur = 0;
};

const drawPoster = ({ w, h }, head, copy) => {
  ctx.fillStyle = '#f4eee4';
  ctx.fillRect(0, h - 500, w, 500);
  ctx.fillStyle = '#050505';
  ctx.font = '900 120px "Space Grotesk", sans-serif';
  const offset = wrapText(ctx, head, 54, h - 454, w - 100, 126);
  ctx.font = '700 30px Inter, sans-serif';
  wrapText(ctx, copy, 54, h - 454 + offset + 26, w - 120, 38);
};

const drawMinimal = ({ w, h }, head) => {
  ctx.fillStyle = '#111111';
  ctx.font = '700 16px "IBM Plex Mono", monospace';
  wrapText(ctx, head.toUpperCase(), w / 2, h / 2 - 20, w - 100, 34, 'center');
};

const drawPitch = ({ w, h }, head, copy) => {
  ctx.fillStyle = 'rgba(0,0,0,0.88)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 118px Inter, sans-serif';
  const offset = wrapText(ctx, head, 100, h - 340, w - 220, 124);
  ctx.font = '400 36px Inter, sans-serif';
  ctx.globalAlpha = 0.65;
  wrapText(ctx, copy, 100, h - 340 + offset + 20, w - 260, 46);
  ctx.globalAlpha = 1;
};

const drawCanva = ({ w, h }, head) => {
  ctx.fillStyle = '#00c4cc';
  ctx.fillRect(0, 0, w, 70);
  ctx.fillStyle = '#2e3135';
  ctx.fillRect(0, 70, 280, h - 70);
  ctx.strokeStyle = '#00c4cc';
  ctx.lineWidth = 10;
  ctx.strokeRect(340, 130, w - 680, h - 320);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px Inter, sans-serif';
  ctx.fillText('SLOP_FACTORY_V9', 82, 42);
  ctx.font = '800 56px "Space Grotesk", sans-serif';
  wrapText(ctx, head, 390, 180, w - 760, 62);
};

const drawMidjourney = ({ w, h }, head, prompt) => {
  ctx.fillStyle = 'rgba(0,0,0,0.86)';
  ctx.fillRect(0, h - 140, w, 140);
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px "IBM Plex Mono", monospace';
  wrapText(
    ctx,
    `> /imagine prompt: ${head.toLowerCase().replace(/ /g, '_')} // ${prompt} --v 9 --slop 1000`,
    32,
    h - 102,
    w - 64,
    28,
  );
};

const drawDribbble = ({ w, h }, head, copy) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, h - 110, w, 110);
  ctx.fillStyle = '#333333';
  ctx.font = '700 28px Inter, sans-serif';
  wrapText(ctx, head, 40, h - 74, w - 250, 32);
  ctx.fillStyle = '#ea4c89';
  ctx.beginPath();
  ctx.arc(w - 72, h - 54, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#444444';
  ctx.font = '400 18px Inter, sans-serif';
  ctx.fillText(copy.slice(0, 46), 40, h - 38);
};

const drawDashboard = ({ w, h }, head) => {
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.fillRect(90, 90, w - 180, h - 180);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#050505';
  ctx.font = '800 44px Inter, sans-serif';
  wrapText(ctx, head, 140, 160, w - 280, 50);
  ctx.fillStyle = '#ff3e00';
  ctx.fillRect(140, 250, 300, 10);
  ctx.fillStyle = '#111111';
  ctx.fillRect(140, 320, w - 280, 180);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px "IBM Plex Mono", monospace';
  ctx.fillText('THROUGHPUT / EMOTIONAL EFFICIENCY', 168, 350);
};

fullAutoBtn.addEventListener('click', autoFill);
manualGenBtn.addEventListener('click', manualRender);
platformSelect.addEventListener('change', drawCanvas);
assetSelect.addEventListener('change', manualRender);

exportBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `slop_v9_${platformSelect.value}_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

promptInput.value = pick(promptBank);
headlineInput.value = pick(headlineBank);
captionInput.value = pick(captionBank);
manualRender();
