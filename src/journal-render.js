function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

const TREND_LAYOUTS = [
  { x: 8, y: 10, w: 26, h: 20, driftX: -10, driftY: 6, rotate: -2 },
  { x: 38, y: 18, w: 25, h: 18, driftX: 6, driftY: -8, rotate: 1.5 },
  { x: 66, y: 8, w: 24, h: 20, driftX: -4, driftY: 8, rotate: -1 },
  { x: 16, y: 46, w: 22, h: 18, driftX: 8, driftY: -4, rotate: 1.2 },
  { x: 48, y: 52, w: 27, h: 18, driftX: -6, driftY: 5, rotate: -1.5 },
];

const FRAGMENT_LAYOUTS = [
  { x: 6, y: 33, w: 20, driftX: 10, driftY: -6, rotate: -1.5 },
  { x: 28, y: 38, w: 18, driftX: -8, driftY: 5, rotate: 1.8 },
  { x: 56, y: 33, w: 17, driftX: 7, driftY: 4, rotate: -0.8 },
  { x: 76, y: 38, w: 16, driftX: -7, driftY: -3, rotate: 1.1 },
  { x: 10, y: 70, w: 17, driftX: 6, driftY: -4, rotate: 0.7 },
  { x: 34, y: 72, w: 18, driftX: -5, driftY: 6, rotate: -1.1 },
  { x: 58, y: 68, w: 18, driftX: 9, driftY: -5, rotate: 1.4 },
  { x: 78, y: 72, w: 15, driftX: -8, driftY: 4, rotate: -1.8 },
];

const ARTIFACT_LAYOUTS = [
  { x: 64, y: 10, w: 24, h: 18, driftX: -3, driftY: 2, rotate: 1.2 },
  { x: 70, y: 28, w: 22, h: 17, driftX: 4, driftY: -3, rotate: -1.1 },
  { x: 52, y: 18, w: 20, h: 16, driftX: -5, driftY: 4, rotate: 0.8 },
];

function getLayout(layouts, index) {
  return layouts[index % layouts.length];
}

function getPositionStyle(layout, override = {}) {
  const x = override.x ?? layout.x;
  const y = override.y ?? layout.y;
  const w = override.w ?? layout.w;
  const h = override.h ?? layout.h ?? 18;
  const rotate = override.rotate ?? layout.rotate ?? 0;
  const driftX = override.driftX ?? layout.driftX ?? 0;
  const driftY = override.driftY ?? layout.driftY ?? 0;
  const z = override.z ?? '';

  return `--x:${x}; --y:${y}; --w:${w}; --h:${h}; --drift-x:${driftX}px; --drift-y:${driftY}px; --rotate:${rotate}deg;${z !== '' ? ` --z:${z};` : ''}`;
}

function renderTrendField(trend, index, isActive, windowLayout) {
  const layout = getLayout(TREND_LAYOUTS, index);
  const override = windowLayout[`trend:${trend.id}`] || {};
  return `
    <article
      class="trend-field${isActive ? ' is-active' : ''}"
      data-trend-id="${escapeHtml(trend.id)}"
      data-window-id="trend:${escapeHtml(trend.id)}"
      style="--field-index:${index}; ${getPositionStyle(layout, override)}"
    >
      <header class="window-handle" data-window-handle>
        <span class="trend-field__label">${escapeHtml(trend.label)}</span>
        <span class="window-handle__meta">drag zone</span>
      </header>
      <button type="button" class="trend-field__body" data-trend-id="${escapeHtml(trend.id)}">
        <strong>${escapeHtml(trend.short)}</strong>
      </button>
    </article>
  `;
}

function renderSurfaceFragment(fragment, trends, activeTrendId, index) {
  const attachedTrend = trends.find((trend) => fragment.trendIds?.includes(trend.id));
  const isMuted = activeTrendId && !fragment.trendIds?.includes(activeTrendId);
  const layout = getLayout(FRAGMENT_LAYOUTS, index);

  return `
    <article class="surface-fragment${isMuted ? ' is-muted' : ''}" style="--x:${layout.x}; --y:${layout.y}; --w:${layout.w}; --drift-x:${layout.driftX}px; --drift-y:${layout.driftY}px; --rotate:${layout.rotate}deg;">
      <p>${escapeHtml(fragment.text)}</p>
      <footer>
        <span>${escapeHtml(fragment.sourceLabel || fragment.source || 'signal')}</span>
        ${attachedTrend ? `<button type="button" data-trend-id="${escapeHtml(attachedTrend.id)}">${escapeHtml(attachedTrend.label)}</button>` : ''}
      </footer>
    </article>
  `;
}

function renderSurfaceArtifact(artifact, trends, index, windowLayout) {
  const layout = getLayout(ARTIFACT_LAYOUTS, index);
  const override = windowLayout[`artifact:${artifact.id}`] || {};
  const linkedTrend = artifact.trendIds.map((id) => trends.find((trend) => trend.id === id)).filter(Boolean)[0];
  const preview = artifact.fragments[0] || artifact.summary || artifact.question;

  return `
    <article
      class="surface-artifact"
      data-window-id="artifact:${escapeHtml(artifact.id)}"
      data-artifact-window
      style="${getPositionStyle(layout, { ...override, z: override.z ?? 6 + index })}"
    >
      <header class="window-handle" data-window-handle>
        <span class="trend-field__label">artifact</span>
        <span class="window-handle__meta">${escapeHtml(formatDate(artifact.createdAt))}</span>
      </header>
      <button type="button" class="surface-artifact__body" data-artifact-id="${escapeHtml(artifact.id)}" ${linkedTrend ? `data-trend-id="${escapeHtml(linkedTrend.id)}"` : ''}>
        <strong>${escapeHtml(artifact.title)}</strong>
        <p>${escapeHtml(preview)}</p>
        ${linkedTrend ? `<span>${escapeHtml(linkedTrend.label)}</span>` : ''}
      </button>
    </article>
  `;
}

function renderActiveTrend(trend, allTrends, artifacts, archiveSignals, relatedResponses) {
  if (!trend) {
    return `
      <section class="focus-panel focus-panel--empty">
        <p class="focus-panel__label">Fokus</p>
        <p>Waehle ein Trendfeld oder stelle eine Frage. Neue Artefakte landen hier als verdichtete Spur.</p>
      </section>
    `;
  }

  const matchingArtifacts = artifacts.filter((artifact) => artifact.trendIds.includes(trend.id)).slice(0, 4);
  const matchingSignals = archiveSignals.filter((signal) => signal.trendIds.includes(trend.id)).slice(0, 4);
  const relatedFragments = allTrends
    .flatMap((entry) => (entry.id === trend.id ? [entry.short, entry.long] : []))
    .slice(0, 2);
  const responses = (trend.relatedResponses || []).map((id) => relatedResponses[id]).filter(Boolean);

  return `
    <section class="focus-panel">
      <p class="focus-panel__label">Trendfokus</p>
      <h2>${escapeHtml(trend.label)}</h2>
      <p class="focus-panel__summary">${escapeHtml(trend.long)}</p>
      <div class="focus-panel__meta">
        ${trend.keywords.slice(0, 4).map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join('')}
      </div>
      <div class="focus-panel__thesis">
        ${relatedFragments.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
      </div>

      <div class="focus-panel__columns">
        <section class="focus-column focus-column--artifacts">
          <p class="focus-panel__subhead">Neuere Artefakte</p>
          ${
            matchingArtifacts.length
              ? matchingArtifacts
                  .map(
                    (artifact) => `
                      <article class="focus-note">
                        <strong>${escapeHtml(artifact.title)}</strong>
                        <p>${escapeHtml(artifact.summary || artifact.fragments[0] || '')}</p>
                      </article>
                    `,
                  )
                  .join('')
              : '<p class="focus-empty">Noch keine direkten Artefakte.</p>'
          }
        </section>
        <section class="focus-column focus-column--archive">
          <p class="focus-panel__subhead">Archivspuren</p>
          ${
            matchingSignals.length
              ? matchingSignals
                  .map(
                    (signal) => `
                      <article class="focus-note">
                        <strong>${escapeHtml(signal.sourceLabel || signal.source)}</strong>
                        <p>${escapeHtml(signal.text)}</p>
                      </article>
                    `,
                  )
                  .join('')
              : '<p class="focus-empty">Keine frischen Spuren im Archiv.</p>'
          }
        </section>
      </div>

      ${
        responses.length
          ? `
            <div class="focus-panel__responses">
              <p class="focus-panel__subhead">Operative Antworten</p>
              ${responses
                .map(
                  (response) => `
                    <a href="${escapeHtml(response.href)}" class="response-link">
                      <strong>${escapeHtml(response.label)}</strong>
                      <span>${escapeHtml(response.note)}</span>
                    </a>
                  `,
                )
                .join('')}
            </div>
          `
          : ''
      }
    </section>
  `;
}

function renderArtifactCard(artifact, trends, relatedResponses) {
  const linkedTrends = artifact.trendIds.map((id) => trends.find((trend) => trend.id === id)).filter(Boolean);
  const linkedResponses = artifact.relatedResponses.map((id) => relatedResponses[id]).filter(Boolean);

  return `
    <article class="artifact-card" id="artifact-entry-${escapeHtml(artifact.id)}" data-artifact-id="${escapeHtml(artifact.id)}">
      <header>
        <p>${formatDate(artifact.createdAt)}</p>
        <h3>${escapeHtml(artifact.title)}</h3>
      </header>
      <p class="artifact-card__question">${escapeHtml(artifact.question)}</p>
      ${artifact.summary ? `<p class="artifact-card__summary">${escapeHtml(artifact.summary)}</p>` : ''}
      <div class="artifact-card__fragments">
        ${artifact.fragments.map((fragment) => `<p>${escapeHtml(fragment)}</p>`).join('')}
      </div>
      <footer>
        <div class="artifact-card__tags">
          ${linkedTrends.map((trend) => `<button type="button" data-trend-id="${escapeHtml(trend.id)}">${escapeHtml(trend.label)}</button>`).join('')}
        </div>
        ${
          linkedResponses.length
            ? `<div class="artifact-card__links">${linkedResponses
                .map((response) => `<a href="${escapeHtml(response.href)}">${escapeHtml(response.label)}</a>`)
                .join('')}</div>`
            : ''
        }
      </footer>
    </article>
  `;
}

export function renderJournal(app, state, config) {
  const { trends, askExamples, relatedResponses } = config;
  const activeTrend = trends.find((trend) => trend.id === state.activeTrendId) || null;
  const surfaceFragments = [...config.seedFragments.slice(0, 3), ...state.archiveSignals.slice(0, 3)];
  const surfaceArtifacts = state.artifacts.slice(-3).reverse();
  const surfaceClassName = activeTrend ? 'journal-surface has-focus' : 'journal-surface';

  app.innerHTML = `
    <section class="journal-shell">
      <header class="journal-intro">
        <div>
          <p class="journal-intro__eyebrow">Offenes Recherchefeld</p>
          <h1>Denkraum</h1>
        </div>
        <p class="journal-intro__copy">
          Ein lebendes Feld aus Fragen, Signalen und verdichteten Spuren. Neue Antworten erscheinen nicht als Chat, sondern als dokumentierte Artefakte.
        </p>
      </header>

      <section class="${surfaceClassName}">
        <div class="journal-surface__backdrop" aria-hidden="true"></div>
        <div class="journal-surface__grain" aria-hidden="true"></div>
        <div class="journal-surface__fields">
          ${trends.map((trend, index) => renderTrendField(trend, index, trend.id === state.activeTrendId, state.windowLayout)).join('')}
          ${surfaceArtifacts.map((artifact, index) => renderSurfaceArtifact(artifact, trends, index, state.windowLayout)).join('')}
        </div>
        <div class="journal-surface__fragments">
          ${surfaceFragments.map((fragment, index) => renderSurfaceFragment(fragment, trends, state.activeTrendId, index)).join('')}
        </div>
      </section>

      <section class="journal-ask">
        <div class="journal-ask__heading">
          <p class="journal-section-label">Frage stellen</p>
          <p>${escapeHtml(state.askMessage)}</p>
        </div>
        <form id="journal-ask-form" class="journal-ask__form">
          <label for="journal-question" class="sr-only">Frage an den Denkraum</label>
          <textarea id="journal-question" name="question" rows="3" placeholder="${escapeHtml(askExamples[0])}">${escapeHtml(state.lastQuestion)}</textarea>
          <div class="journal-ask__actions">
            <div class="journal-ask__examples">
              ${askExamples.map((example) => `<button type="button" data-example="${escapeHtml(example)}">${escapeHtml(example)}</button>`).join('')}
            </div>
            <button type="submit" class="journal-submit"${state.askStatus === 'loading' ? ' disabled' : ''}>
              ${state.askStatus === 'loading' ? 'building artifact...' : 'create artifact'}
            </button>
          </div>
        </form>
      </section>

      <section class="journal-focus-grid">
        ${renderActiveTrend(activeTrend, trends, state.artifacts, state.archiveSignals, relatedResponses)}

        <section class="live-strip">
          <p class="journal-section-label">Aktuelle Spuren</p>
          <p class="live-strip__status">${escapeHtml(state.archiveMessage)}</p>
          <div class="live-strip__items">
            ${
              state.archiveSignals.length
                ? state.archiveSignals.slice(0, 5).map((signal) => `
                    <article class="live-strip__item">
                      <p>${escapeHtml(signal.text)}</p>
                      <footer>
                        <span>${escapeHtml(signal.sourceGroup || signal.sourceLabel || signal.source)}</span>
                        ${signal.href ? `<a href="${escapeHtml(signal.href)}" target="_blank" rel="noopener">open</a>` : ''}
                      </footer>
                    </article>
                  `).join('')
                : '<p class="focus-empty">Noch keine Archive-Signale sichtbar.</p>'
            }
          </div>
        </section>
      </section>

      <section class="artifact-log">
        <header class="artifact-log__header">
          <div>
            <p class="journal-section-label">Artefaktarchiv</p>
            <h2>Dokumentierte Spuren</h2>
          </div>
          <p>${state.artifacts.length} Artefakte gespeichert</p>
        </header>
        <div class="artifact-log__grid">
          ${
            state.artifacts.length
              ? state.artifacts
                  .slice()
                  .reverse()
                  .map((artifact) => renderArtifactCard(artifact, trends, relatedResponses))
                  .join('')
              : '<p class="focus-empty">Noch keine Artefakte. Die erste Frage setzt die erste Spur.</p>'
          }
        </div>
      </section>
    </section>
  `;
}
