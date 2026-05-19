export const ARTIFACT_STORAGE_KEY = 'signal-journal-artifacts-v1';
export const WINDOW_STORAGE_KEY = 'signal-journal-window-layout-v1';

export function createInitialState() {
  return {
    activeTrendId: null,
    archiveSignals: [],
    archiveStatus: 'loading',
    archiveMessage: 'Archive wird geladen.',
    artifacts: loadArtifacts(),
    windowLayout: loadWindowLayout(),
    askStatus: 'idle',
    askMessage: 'Eine Frage erzeugt ein neues Artefakt.',
    lastQuestion: '',
  };
}

export function loadArtifacts() {
  try {
    const raw = localStorage.getItem(ARTIFACT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistArtifacts(artifacts) {
  try {
    localStorage.setItem(ARTIFACT_STORAGE_KEY, JSON.stringify(artifacts));
  } catch {
    // Ignore storage failures and keep the in-memory state.
  }
}

export function loadWindowLayout() {
  try {
    const raw = localStorage.getItem(WINDOW_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function persistWindowLayout(layout) {
  try {
    localStorage.setItem(WINDOW_STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // Ignore storage failures and keep the in-memory state.
  }
}
