import './vr-gallery.css';
import { projectsData } from './data.js';
import posterUrl from '../assets/slop-gallery-poster.png';

const app = document.getElementById('vr-app');

const projectIds = [
  '1984-to-go-claudia-mai',
  'follow-the-white-rabbit',
  'fast-fwd-too-slow',
  'ich-bin-da',
  'fmdg-i-find-the-luck',
  'post-everything-bachelor-thesis',
];

function decodeHtml(value = '') {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function cleanText(value = '') {
  return decodeHtml(value)
    .replace(/&#8230;|&hellip;/g, '...')
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const galleryProjects = projectIds
  .map((id) => ({ id, ...projectsData[id] }))
  .filter((project) => project.title);

app.innerHTML = `
  <main class="vr-page">
    <a class="vr-back" href="/">zurueck zum index</a>

    <section class="vr-hero">
      <div class="vr-hero__copy">
        <p class="vr-kicker">Portfolio</p>
        <h1>CLAUDIA MAI</h1>
      </div>

      <div class="vr-poster" aria-label="Auswahl">
        <img src="${posterUrl}" alt="Auswahl">
        <div class="vr-poster__badge">
          <span>Portfolio</span>
          <strong>Auswahl</strong>
        </div>
      </div>
    </section>

    <section class="vr-index">
      <div class="vr-index__head">
        <p class="vr-kicker">Auswahl</p>
        <h2>Portfolio</h2>
      </div>
      <div class="vr-list">
        ${galleryProjects
          .map(
            (project, index) => `
              <article class="vr-item">
                <span class="vr-item__number">${String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p class="vr-item__type">Portfolio</p>
                  <h3>${escapeHtml(decodeHtml(project.title))}</h3>
                  <p>${escapeHtml(cleanText(project.text))}</p>
                </div>
                <a href="${escapeHtml(project.url || '#')}">Projekt öffnen</a>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  </main>
`;
