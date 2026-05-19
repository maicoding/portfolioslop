import { projectsData } from './data.js';

const container = document.getElementById('project-content');
const timeNode = document.getElementById('project-time');

const ownProjects = [
  '1984-to-go-claudia-mai',
  '100-poster-battle-2-sharing-cultural-identities',
  'follow-the-white-rabbit',
  'fast-fwd-too-slow-magazine',
  'fast-fwd-too-slow',
  'ich-bin-da',
  'fmdg-i-find-the-luck',
  'post-everything-bachelor-thesis',
];

const featuredIds = [
  'real-mix',
  'city-of-play',
  'uaps',
  'so-viele-worte-ohne-dich',
  'einmal-um-die-welt',
  'nice-lab-50-50-nairobi',
];

const previewFocusStops = ['50%', '62%', '38%', '58%', '34%', '68%'];

const decodeHtml = (value = '') => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
};

const cleanText = (value = '') =>
  decodeHtml(value)
    .replace(/&#8230;|&hellip;/g, '...')
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

function extractSentences(text = '') {
  return cleanText(text)
    .replace(/\.\.\.+/g, '. ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 22);
}

function summarizeText(text = '', maxSentences = 2) {
  const sentences = extractSentences(text).slice(0, maxSentences);
  if (sentences.length) return sentences.join(' ');

  const fallback = cleanText(text);
  return fallback.length > 240 ? `${fallback.slice(0, 237)}...` : fallback;
}

function inferTags(title = '', text = '') {
  const haystack = `${title} ${text}`.toLowerCase();
  const tags = [];
  const rules = [
    ['KI / Bild', /(ki|ai|prompt|midjourney|generativ|image|bilder)/],
    ['Publikation', /(buch|publikation|magazin|ringbuch|kalender|postkarten)/],
    ['Raum / Stadt', /(stadt|urban|raum|space|intervention|field research)/],
    ['AR / VR / Raum', /(vr|ar|nomad|blender|styly|surreal worlds)/],
    ['Kollaboration', /(summer school|nairobi|studierenden|gruppen|workshop|international)/],
    ['Recherche', /(kritisch|analyse|untersuch|frage|dokument)/],
  ];

  for (const [label, pattern] of rules) {
    if (pattern.test(haystack)) tags.push(label);
    if (tags.length === 3) break;
  }

  if (!tags.length) tags.push('Lehrprojekt');
  return tags;
}

function formatLocalTime(date = new Date()) {
  const time = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
  }).format(date);

  return `Berlin ${time}`;
}

function updateTime() {
  if (!timeNode) return;
  timeNode.textContent = formatLocalTime();
}

const studentProjects = Object.entries(projectsData)
  .filter(([id]) => !ownProjects.includes(id))
  .map(([id, project]) => ({
    id,
    ...project,
    titleText: decodeHtml(project.title),
    bodyText: cleanText(project.text),
  }));

const featuredProjects = featuredIds
  .map((id, index) => {
    const project = studentProjects.find((entry) => entry.id === id);
    if (!project) return null;

    return {
      ...project,
      label: String(index + 1).padStart(2, '0'),
      excerpt: summarizeText(project.text, 2),
      focus: previewFocusStops[index % previewFocusStops.length],
      tags: inferTags(project.titleText, project.bodyText),
    };
  })
  .filter(Boolean);

const featuredIdSet = new Set(featuredProjects.map((project) => project.id));

const archiveProjects = studentProjects
  .filter((project) => !featuredIdSet.has(project.id))
  .map((project) => ({
    ...project,
    excerpt: summarizeText(project.text, 2),
    tags: inferTags(project.titleText, project.bodyText),
  }));

const metaItems = [
  { label: 'Format', value: 'Lehrprojekte / Studierendenarbeiten' },
  { label: 'Auswahl', value: `${studentProjects.length} Projekte` },
  { label: 'Fokus', value: 'KI, Publikation, Raum, Kollaboration' },
  { label: 'Status', value: 'Wachsender Lehrindex' },
];

document.title = 'Lehrprojekte - Claudia Mai';

if (!featuredProjects.length) {
  container.innerHTML = `
    <section class="project-error">
      <p class="project-micro">Lehrarchiv</p>
      <h1>Lehrprojekte werden aufgebaut.</h1>
      <p>Für diese Seite ist noch keine kuratierte Auswahl hinterlegt.</p>
      <a href="/lehrkonzept.html">Zum Lehrkonzept</a>
    </section>
  `;
} else {
  const firstProject = featuredProjects[0];

  container.innerHTML = `
    <article class="project-page">
      <section class="project-stage">
        <div class="project-stage__title">
          <p class="project-micro">Lehrarchiv</p>
          <h1>Lehrprojekte</h1>
          <p class="project-stage__tags">Studierende, Seminare, Kollaboration</p>
        </div>

        <div class="project-stage__info">
          <p class="project-stage__lead">
            Diese Seite zeigt Lehre über konkrete Arbeiten: als gemeinsames Entwickeln, Prüfen, Verwerfen und
            Übersetzen von Ideen in Bilder, Bücher, Interfaces, Räume und Systeme.
          </p>
          <div class="project-stage__intro">
            <p>
              Im Zentrum stehen studentische Projekte aus Seminaren, KI-Kursen, kollaborativen Formaten und
              internationalen Zusammenhängen. Die Arbeiten zeigen, wie gestalterische Grundlagen, neue Werkzeuge
              und kritische Fragen zusammenkommen.
            </p>
            <p>
              Einige neue Arbeiten sind noch nicht vollständig aufgearbeitet. Die Übersicht ist deshalb als
              wachsender Index angelegt: kuratiert genug, um lesbar zu sein, und offen genug, um weitere Projekte
              und neue Jahrgänge aufzunehmen.
            </p>
          </div>
          <div class="project-stage__actions">
            <a href="#lehrprojekte-index">Auswahl</a>
            <a href="#lehrprojekte-archiv">Archiv</a>
            <a href="/lehrkonzept.html">Lehrkonzept</a>
          </div>
          <dl class="project-stage__meta">
            ${metaItems
              .map(
                (item) => `
                  <div>
                    <dt>${item.label}</dt>
                    <dd>${item.value}</dd>
                  </div>
                `,
              )
              .join('')}
          </dl>
        </div>

        <aside class="project-stage__visual">
          <div class="project-preview" id="project-preview">
            <div class="project-preview__stage">
              <figure class="project-preview__frame">
                <img class="project-preview__image" id="project-preview-image" src="${firstProject.image}" alt="${firstProject.titleText}" />
              </figure>

              <div class="project-preview__caption">
                <span class="project-preview__label" id="project-preview-label">Project ${firstProject.label}</span>
                <p id="project-preview-text">${firstProject.excerpt}</p>
                <span class="project-preview__label" id="project-preview-id">${firstProject.titleText}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section class="project-section" id="lehrprojekte-index">
        <div class="project-section__label project-micro">Auswahl</div>
        <div class="project-section__body">
          <div class="project-section__head">
            <h2>Aus Aufgaben, Methoden und Gesprächen entstehen eigenständige Arbeiten.</h2>
            <p>
              Die Auswahl verbindet unterschiedliche Formate: KI-Bildkritik, Publikation, Stadt, Raum, AR/VR und
              internationale Zusammenarbeit. Jede Arbeit steht für eine andere Art, Gestaltung als Recherche,
              Haltung und Materialentscheidung zu begreifen.
            </p>
          </div>

          <div class="project-concept-list">
            ${featuredProjects
              .map(
                (project, index) => `
                  <button
                    type="button"
                    class="project-concept-card${index === 0 ? ' is-active' : ''}"
                    data-project-index="${index}"
                  >
                    <span class="project-concept-card__number">${project.label}</span>
                    <p><strong>${project.titleText}</strong><br>${project.excerpt}</p>
                  </button>
                `,
              )
              .join('')}
          </div>
        </div>
      </section>

      <section class="project-versions" id="lehrprojekte-archiv">
        <div class="project-section__label project-micro">Archiv</div>
        <div class="project-section__body">
          <div class="project-section__head">
            <h2>Weitere Lehrprojekte und studentische Arbeiten.</h2>
            <p>
              Die Karten unten bilden den aktuellen Bestand ab. Später können daraus eigene Unterseiten,
              Jahrgänge oder Seminarcluster entstehen, sobald die neuen Projekte vollständig dokumentiert sind.
            </p>
          </div>
          <div class="project-version-list">
            ${archiveProjects
              .map(
                (project, index) => `
                  <article class="project-version-card">
                    <span class="project-version-card__label">${String(index + 1).padStart(2, '0')}</span>
                    <h3>${project.titleText}</h3>
                    <p>${project.excerpt}</p>
                    <p>${project.tags.join(', ')}</p>
                    <a href="${project.url}" target="_blank" rel="noreferrer">Projekt ansehen</a>
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
      </section>
    </article>
  `;

  const preview = document.getElementById('project-preview');
  const previewImage = document.getElementById('project-preview-image');
  const previewLabel = document.getElementById('project-preview-label');
  const previewText = document.getElementById('project-preview-text');
  const previewId = document.getElementById('project-preview-id');
  const projectButtons = Array.from(document.querySelectorAll('[data-project-index]'));

  let activeIndex = 0;
  let swapTimeout = 0;

  function renderProject(index) {
    const nextIndex = Math.max(0, Math.min(index, featuredProjects.length - 1));
    const project = featuredProjects[nextIndex];
    activeIndex = nextIndex;

    projectButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === nextIndex);
    });

    preview?.classList.add('is-swapping');
    window.clearTimeout(swapTimeout);

    swapTimeout = window.setTimeout(() => {
      if (previewImage) {
        previewImage.src = project.image;
        previewImage.alt = project.titleText;
        previewImage.style.setProperty('--project-focus', project.focus);
      }
      if (previewLabel) previewLabel.textContent = `Project ${project.label}`;
      if (previewText) previewText.textContent = project.excerpt;
      if (previewId) previewId.textContent = project.titleText;
      preview?.classList.remove('is-swapping');
    }, 140);
  }

  projectButtons.forEach((button) => {
    const nextIndex = Number(button.dataset.projectIndex);
    button.addEventListener('mouseenter', () => renderProject(nextIndex));
    button.addEventListener('focus', () => renderProject(nextIndex));
    button.addEventListener('click', () => renderProject(nextIndex));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') renderProject(activeIndex + 1);
    if (event.key === 'ArrowLeft') renderProject(activeIndex - 1);
  });

  renderProject(0);
}

updateTime();
window.setInterval(updateTime, 30000);
