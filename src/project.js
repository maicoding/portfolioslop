import { projectsData } from './data.js';

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
const container = document.getElementById('project-content');
const timeNode = document.getElementById('project-time');

const deeperMap = {
  'follow-the-white-rabbit': '/version-3.html?focus=follow-the-white-rabbit',
  'fast-fwd-too-slow': '/version-3.html?focus=fast-fwd-too-slow',
  'ich-bin-da': '/version-3.html?focus=ich-bin-da',
  'fmdg-i-find-the-luck': '/version-3.html?focus=fmdg-i-find-the-luck',
  '1984-to-go-claudia-mai': '/version-3.html?focus=1984-to-go-claudia-mai',
  'salvador-ki': '/version-3.html?focus=salvador-ki',
  'real-mix': '/version-3.html?focus=real-mix',
  'city-of-play': '/version-3.html?focus=city-of-play',
  'trash-cache-salma-parra': '/version-3.html?focus=trash-cache-salma-parra',
  'die-menschenwuerde-ist-eine-wurst-eyad-abushaar': '/version-3.html?focus=die-menschenwuerde-ist-eine-wurst-eyad-abushaar',
};

const projectVersions = {
  'fmdg-i-find-the-luck': {
    intro:
      'FMDG / I find the luck wird hier als Ausgangspunkt fuer zwei weiterentwickelte Antwortmaschinen gelesen: einmal als KI-basierte Such- und Bildmaschine und einmal als bewusst inszenierte Vibe-Coding-Oberflaeche.',
    versions: [
      {
        href: deeperMap['fmdg-i-find-the-luck'],
        title: 'i find the luck 2.0',
        text: [
          'Diese Version wurde rein mit KI erstellt, wobei die Fragen weiterhin vorgegeben sind.',
          'Beantwortet werden die Fragen ueber die Google Search API, Bilder werden ebenfalls von Google bereitgestellt.',
          'Vor dem Einsatz von KI waere ein solches Projekt nur mit umfangreichen Programmierkenntnissen umsetzbar gewesen.',
        ],
        cta: 'zu i find the luck 2.0',
      },
      {
        href: '/version-2-5.html',
        title: 'answer machine 3.0',
        text: [
          'Answer Machine 3.0 ist die Weiterentwicklung von 2.0 und als bewusst typische KI-Oberflaeche mit Retro- und ELIZA-Anmutung angelegt.',
          'Das Konzept setzt auf reine Vibe-Coding-Aesthetik und macht die KI-Optik selbst zum Gestaltungsmittel.',
          'Im Unterschied zu 2.0 steht hier staerker die Simulation einer sprechenden Maschine im Vordergrund.',
        ],
        cta: 'zu answer machine 3.0',
      },
    ],
  },
};

const previewFocusStops = ['50%', '64%', '38%', '56%', '30%', '68%'];
const floatFocusStops = [
  ['66%', '32%', '78%'],
  ['40%', '68%', '54%'],
  ['58%', '26%', '72%'],
  ['36%', '60%', '48%'],
  ['70%', '34%', '82%'],
  ['45%', '74%', '58%'],
];

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

function buildConceptBlocks(text = '') {
  const sentences = extractSentences(text);
  const fallback = cleanText(text);
  const source = sentences.length ? sentences : [fallback];
  const blocks = [];

  for (let index = 0; index < source.length; index += 2) {
    const chunk = source.slice(index, index + 2).join(' ');
    if (chunk) blocks.push(chunk);
  }

  return blocks.slice(0, 6).map((paragraph, index) => ({
    label: String(index + 1).padStart(2, '0'),
    text: paragraph,
    previewFocus: previewFocusStops[index % previewFocusStops.length],
    floatFocus: floatFocusStops[index % floatFocusStops.length],
  }));
}

function inferTags(projectIdValue, title, text) {
  const haystack = `${projectIdValue} ${title} ${text}`.toLowerCase();
  const tags = [];
  const rules = [
    ['3D / VR', /(3d|vr|ar|render|nomad|blender|styly|surreal worlds|planet-b)/],
    ['KI / Automation', /(ki|ai|artificial intelligence|kuenstliche intelligenz|automatis|prompt|maschine)/],
    ['Publikation / Buch', /(buch|publikation|magazin|magazine|ringbuch|lexikon|kalender)/],
    ['Research / Design', /(forschung|research|kritisch|analyse|investigative|untersuch)/],
    ['Raum / Interface', /(interface|oberflaeche|raum|space|archive|installation|website|web)/],
    ['Bild / Narration', /(film|fotograf|photo|image|bild|collage|dokumentar|erzaehl)/],
  ];

  for (const [label, pattern] of rules) {
    if (pattern.test(haystack)) tags.push(label);
    if (tags.length === 3) break;
  }

  if (!tags.length) tags.push('Projektarchiv');
  return tags;
}

function isSugarscrollUrl(url = '') {
  return /^https?:\/\/(?:www\.)?sugarscroll\.de\//i.test(url);
}

function isExternalUrl(url = '') {
  return /^https?:\/\//i.test(url);
}

function buildMeta(projectIdValue, title, text, externalUrl) {
  const sourceLabel = isSugarscrollUrl(externalUrl) ? 'Sugarscroll' : isExternalUrl(externalUrl) ? 'Extern' : 'Intern';

  return [
    { label: 'Projekt ID', value: projectIdValue },
    { label: 'Archiv', value: 'Klassisches Portfolio' },
    { label: 'Fokus', value: inferTags(projectIdValue, title, text).join(', ') },
    { label: 'Quelle', value: sourceLabel },
  ];
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

const project = projectId ? projectsData[projectId] : null;

if (!project) {
  container.innerHTML = `
    <section class="project-error">
      <p class="project-micro">Archive error</p>
      <h1>Projekt nicht gefunden.</h1>
      <p>Fuer diese Adresse liegt im klassischen Portfolio aktuell kein Datensatz vor.</p>
      <a href="/portfolio.html">Zurueck zum Portfolio</a>
    </section>
  `;
} else {
  const image =
    project.image ||
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="100%" height="100%" fill="white"/></svg>';
  const title = decodeHtml(project.title);
  const bodyText = cleanText(project.text);
  const conceptBlocks = buildConceptBlocks(project.text);
  const lead = conceptBlocks[0]?.text || bodyText;
  const introBlocks = conceptBlocks.slice(1, 3);
  const detailBlocks = conceptBlocks.length > 1 ? conceptBlocks : [{ label: '01', text: bodyText, previewFocus: '50%', floatFocus: ['66%', '32%', '78%'] }];
  const conceptEntry = projectVersions[projectId] || null;
  const metaItems = buildMeta(projectId, title, bodyText, project.url);

  document.title = `${title} - Claudia Mai`;

  container.innerHTML = `
    <article class="project-page">
      <section class="project-stage">
        <div class="project-stage__title">
          <p class="project-micro">Archive entry</p>
          <h1>${title}</h1>
          <p class="project-stage__tags">${inferTags(projectId, title, bodyText).join(', ')}</p>
        </div>

        <div class="project-stage__info">
          <p class="project-stage__lead" data-i18n-project-text="${projectId}">${lead}</p>
          <div class="project-stage__intro">
            ${introBlocks.map((block) => `<p>${block.text}</p>`).join('')}
          </div>
          <div class="project-stage__actions">
            <a href="#concept">Konzept</a>
            <a href="#visual-index">Index</a>
            <a href="/portfolio.html">Zurueck</a>
          </div>
          ${isSugarscrollUrl(project.url) ? `<a class="project-stage__source" href="${project.url}" target="_blank" rel="noreferrer">Auf Sugarscroll ansehen</a>` : ''}
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
            <div class="project-preview__backdrop" aria-hidden="true">
              <figure><img src="${image}" alt="" style="object-position: 58% 50%;" /></figure>
              <figure><img src="${image}" alt="" style="object-position: 28% 50%;" /></figure>
              <figure><img src="${image}" alt="" style="object-position: 72% 50%;" /></figure>
            </div>

            <div class="project-preview__stage">
              <figure class="project-preview__frame">
                <img class="project-preview__image" id="project-preview-image" src="${image}" alt="${title}" />
                <figure class="project-preview__float project-preview__float--one">
                  <img id="project-float-one" src="${image}" alt="" style="--float-focus:${detailBlocks[0].floatFocus[0]} 50%;" />
                </figure>
                <figure class="project-preview__float project-preview__float--two">
                  <img id="project-float-two" src="${image}" alt="" style="--float-focus:${detailBlocks[0].floatFocus[1]} 50%;" />
                </figure>
                <figure class="project-preview__float project-preview__float--three">
                  <img id="project-float-three" src="${image}" alt="" style="--float-focus:${detailBlocks[0].floatFocus[2]} 50%;" />
                </figure>
              </figure>

              <div class="project-preview__caption">
                <span class="project-preview__label" id="project-preview-label">Concept ${detailBlocks[0].label}</span>
                <p id="project-preview-text">${detailBlocks[0].text}</p>
                <span class="project-preview__label">${projectId}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section class="project-section" id="concept">
        <div class="project-section__label project-micro">Konzept</div>
        <div class="project-section__body">
          <div class="project-section__head">
            <h2>Das Projekt wird als lesbare Fallstudie gezeigt statt als zerlegte Effektflaeche.</h2>
            <p>
              Der linke Bereich bleibt bewusst textstark. Gleichzeitig steuert der nummerierte Konzeptindex rechts die Bildfokusse,
              damit Text und Preview miteinander sprechen statt nebeneinander zu liegen.
            </p>
          </div>

          <div class="project-concept-list" id="visual-index">
            ${detailBlocks
              .map(
                (block, index) => `
                  <button
                    type="button"
                    class="project-concept-card${index === 0 ? ' is-active' : ''}"
                    data-block-index="${index}"
                  >
                    <span class="project-concept-card__number">${block.label}</span>
                    <p>${block.text}</p>
                  </button>
                `,
              )
              .join('')}
          </div>
        </div>
      </section>

      ${
        conceptEntry
          ? `
            <section class="project-versions">
              <div class="project-section__label project-micro">Weiterfuehrungen</div>
              <div class="project-section__body">
                <div class="project-section__head">
                  <h2>Das Projekt verzweigt hier in weitere Versionen und spaetere Antworten.</h2>
                  <p>${conceptEntry.intro}</p>
                </div>
                <div class="project-version-list">
                  ${conceptEntry.versions
                    .map(
                      (version, index) => `
                        <article class="project-version-card">
                          <span class="project-version-card__label">${String(index + 1).padStart(2, '0')}</span>
                          <h3>${version.title}</h3>
                          ${version.text.map((paragraph) => `<p>${paragraph}</p>`).join('')}
                          <a href="${version.href}">${version.cta || `${version.title} ansehen`}</a>
                        </article>
                      `,
                    )
                    .join('')}
                </div>
              </div>
            </section>
          `
          : ''
      }
    </article>
  `;

  const preview = document.getElementById('project-preview');
  const previewImage = document.getElementById('project-preview-image');
  const previewLabel = document.getElementById('project-preview-label');
  const previewText = document.getElementById('project-preview-text');
  const floatOne = document.getElementById('project-float-one');
  const floatTwo = document.getElementById('project-float-two');
  const floatThree = document.getElementById('project-float-three');
  const blockButtons = Array.from(document.querySelectorAll('[data-block-index]'));

  let activeIndex = 0;
  let swapTimeout = 0;

  function renderBlock(index) {
    const nextIndex = Math.max(0, Math.min(index, detailBlocks.length - 1));
    const block = detailBlocks[nextIndex];
    activeIndex = nextIndex;

    blockButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === nextIndex);
    });

    preview?.classList.add('is-swapping');
    window.clearTimeout(swapTimeout);

    swapTimeout = window.setTimeout(() => {
      if (previewImage) previewImage.style.setProperty('--project-focus', `${block.previewFocus}`);
      if (floatOne) floatOne.style.setProperty('--float-focus', `${block.floatFocus[0]} 50%`);
      if (floatTwo) floatTwo.style.setProperty('--float-focus', `${block.floatFocus[1]} 50%`);
      if (floatThree) floatThree.style.setProperty('--float-focus', `${block.floatFocus[2]} 50%`);
      if (previewLabel) previewLabel.textContent = `Concept ${block.label}`;
      if (previewText) previewText.textContent = block.text;
      preview?.classList.remove('is-swapping');
    }, 140);
  }

  blockButtons.forEach((button) => {
    const nextIndex = Number(button.dataset.blockIndex);
    button.addEventListener('mouseenter', () => renderBlock(nextIndex));
    button.addEventListener('focus', () => renderBlock(nextIndex));
    button.addEventListener('click', () => renderBlock(nextIndex));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') renderBlock(activeIndex + 1);
    if (event.key === 'ArrowLeft') renderBlock(activeIndex - 1);
  });

  renderBlock(0);
}

updateTime();
window.setInterval(updateTime, 30000);
