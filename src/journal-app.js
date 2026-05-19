import './journal.css';
import { askExamples, relatedResponses, seedFragments, trends } from './journal-data.js';
import { createInitialState, persistArtifacts, persistWindowLayout } from './journal-state.js';
import { fetchArchiveSignals } from './journal-archive.js';
import { createArtifact } from './journal-ai.js';
import { renderJournal } from './journal-render.js';

const app = document.getElementById('blog-app');
const state = createInitialState();
let dragSession = null;
let globalPointerEventsBound = false;

function getRelevantContext(question) {
  const lower = question.toLowerCase();

  const matchedTrends = trends
    .filter((trend) => trend.keywords.some((keyword) => lower.includes(keyword.toLowerCase())))
    .slice(0, 3);

  const selectedTrends = matchedTrends.length ? matchedTrends : trends.slice(0, 2);
  const selectedTrendIds = selectedTrends.map((trend) => trend.id);

  const fragments = [...seedFragments, ...state.archiveSignals]
    .filter((fragment) => !fragment.trendIds || fragment.trendIds.some((id) => selectedTrendIds.includes(id)))
    .slice(0, 8)
    .map((fragment) => ({
      text: fragment.text,
      source: fragment.source,
      trendIds: fragment.trendIds || [],
    }));

  return {
    matchedTrends: selectedTrends.map((trend) => ({
      id: trend.id,
      label: trend.label,
      short: trend.short,
    })),
    fragments,
  };
}

function setActiveTrend(trendId) {
  state.activeTrendId = trendId === state.activeTrendId ? null : trendId;
  render();
}

function focusArtifact(artifactId) {
  const artifact = state.artifacts.find((entry) => entry.id === artifactId);
  if (!artifact) return;
  state.activeTrendId = artifact.trendIds[0] || state.activeTrendId;
  render();
  requestAnimationFrame(() => {
    const target = document.getElementById(`artifact-entry-${artifactId}`);
    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    if (target) {
      target.classList.add('is-focused');
      window.setTimeout(() => target.classList.remove('is-focused'), 1800);
    }
  });
}

function placeArtifactWindow(artifact) {
  const artifactCount = state.artifacts.slice(-3).length;
  state.windowLayout[`artifact:${artifact.id}`] = {
    x: Math.max(50, 72 - artifactCount * 8),
    y: 8 + artifactCount * 8,
    w: 24,
    h: 18,
    rotate: artifactCount % 2 === 0 ? 1.2 : -1.1,
    z: 12 + artifactCount,
  };
  persistWindowLayout(state.windowLayout);
}

async function hydrateArchive() {
  try {
    state.archiveStatus = 'loaded';
    state.archiveSignals = await fetchArchiveSignals(trends);
    state.archiveMessage = state.archiveSignals.length
      ? 'Frische Signale aus dem Archiv sind in die Flaeche eingemischt.'
      : 'Archiv verbunden, aber aktuell ohne sichtbare Spuren.';
  } catch {
    state.archiveStatus = 'error';
    state.archiveMessage = 'Archiv nicht erreichbar. Der Denkraum arbeitet mit seinen statischen Spuren weiter.';
    state.archiveSignals = [];
  }
  render();
}

async function handleQuestionSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const question = String(formData.get('question') || '').trim();

  if (!question) return;

  state.askStatus = 'loading';
  state.askMessage = 'Die Frage wird gerade in ein Artefakt uebersetzt.';
  state.lastQuestion = question;
  render();

  const context = getRelevantContext(question);
  const artifact = await createArtifact(question, trends, relatedResponses, context);

  state.artifacts = [...state.artifacts, artifact].slice(-18);
  persistArtifacts(state.artifacts);
  placeArtifactWindow(artifact);
  state.activeTrendId = artifact.trendIds[0] || state.activeTrendId;
  state.askStatus = 'idle';
  state.askMessage = 'Neue Spur erzeugt und im Denkraum abgelegt.';
  render();
}

function startWindowDrag(event, windowNode) {
  const surface = app.querySelector('.journal-surface');
  if (!surface) return;

  const windowId = windowNode.getAttribute('data-window-id');
  if (!windowId) return;

  const surfaceRect = surface.getBoundingClientRect();
  const nodeRect = windowNode.getBoundingClientRect();
  const existing = state.windowLayout[windowId] || {};

  dragSession = {
    windowId,
    surfaceRect,
    offsetX: event.clientX - nodeRect.left,
    offsetY: event.clientY - nodeRect.top,
    widthPercent: existing.w || (nodeRect.width / surfaceRect.width) * 100,
    heightPercent: existing.h || (nodeRect.height / surfaceRect.height) * 100,
    rotate: existing.rotate ?? (Number.parseFloat(getComputedStyle(windowNode).getPropertyValue('--rotate')) || 0),
    z: Math.max(...Object.values(state.windowLayout).map((entry) => entry?.z || 1), 8) + 1,
  };

  state.windowLayout[windowId] = {
    ...(state.windowLayout[windowId] || {}),
    z: dragSession.z,
  };
  persistWindowLayout(state.windowLayout);
  windowNode.classList.add('is-dragging');
}

function updateWindowDrag(event) {
  if (!dragSession) return;

  const { windowId, surfaceRect, offsetX, offsetY, widthPercent, heightPercent, rotate, z } = dragSession;
  const x = ((event.clientX - surfaceRect.left - offsetX) / surfaceRect.width) * 100;
  const y = ((event.clientY - surfaceRect.top - offsetY) / surfaceRect.height) * 100;
  const clampedX = Math.min(Math.max(2, x), 98 - widthPercent);
  const clampedY = Math.min(Math.max(2, y), 92 - heightPercent);

  state.windowLayout[windowId] = {
    ...state.windowLayout[windowId],
    x: Number(clampedX.toFixed(2)),
    y: Number(clampedY.toFixed(2)),
    w: widthPercent,
    h: heightPercent,
    rotate,
    z,
  };

  const node = app.querySelector(`[data-window-id="${CSS.escape(windowId)}"]`);
  if (node) {
    node.style.setProperty('--x', state.windowLayout[windowId].x);
    node.style.setProperty('--y', state.windowLayout[windowId].y);
    node.style.setProperty('--w', state.windowLayout[windowId].w);
    node.style.setProperty('--h', state.windowLayout[windowId].h);
    node.style.setProperty('--rotate', `${rotate}deg`);
    node.style.setProperty('--z', z);
  }
}

function endWindowDrag() {
  if (!dragSession) return;
  persistWindowLayout(state.windowLayout);
  const node = app.querySelector(`[data-window-id="${CSS.escape(dragSession.windowId)}"]`);
  node?.classList.remove('is-dragging');
  dragSession = null;
}

function bindEvents() {
  const form = document.getElementById('journal-ask-form');
  form?.addEventListener('submit', handleQuestionSubmit);

  app.querySelectorAll('[data-trend-id]').forEach((node) => {
    node.addEventListener('click', () => setActiveTrend(node.getAttribute('data-trend-id')));
  });

  app.querySelectorAll('[data-example]').forEach((node) => {
    node.addEventListener('click', () => {
      const textarea = document.getElementById('journal-question');
      if (!textarea) return;
      textarea.value = node.getAttribute('data-example') || '';
      textarea.focus();
    });
  });

  app.querySelectorAll('[data-artifact-id]').forEach((node) => {
    node.addEventListener('click', () => focusArtifact(node.getAttribute('data-artifact-id')));
  });

  app.querySelectorAll('[data-window-id]').forEach((node) => {
    node.addEventListener('pointerdown', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest('a, input, textarea, select')) return;

      const rect = node.getBoundingClientRect();
      const dragZoneHeight = Math.min(88, rect.height * 0.45);
      const pointerOffsetY = event.clientY - rect.top;

      if (pointerOffsetY > dragZoneHeight) return;

      event.preventDefault();
      startWindowDrag(event, node);
    });
  });

  const surface = app.querySelector('.journal-surface');
  if (surface) {
    surface.addEventListener('pointermove', (event) => {
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      surface.style.setProperty('--pointer-x', `${x.toFixed(3)}`);
      surface.style.setProperty('--pointer-y', `${y.toFixed(3)}`);
    });

    surface.addEventListener('pointerleave', () => {
      surface.style.setProperty('--pointer-x', '0');
      surface.style.setProperty('--pointer-y', '0');
    });
  }

  if (!globalPointerEventsBound) {
    window.addEventListener('pointermove', updateWindowDrag);
    window.addEventListener('pointerup', endWindowDrag);
    globalPointerEventsBound = true;
  }
}

function render() {
  renderJournal(app, state, {
    trends,
    seedFragments,
    askExamples,
    relatedResponses,
  });
  bindEvents();
}

render();
hydrateArchive();
