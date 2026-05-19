import './vr-gallery.css';
import posterUrl from '../assets/slop-gallery-poster.png';

const app = document.getElementById('vr-app');

const flattenedWorks = [
  {
    title: 'Chrome Room, Exported As A Feeling',
    type: 'flat render',
    note: 'A room-shaped claim, now compressed into pure interface confidence.',
    score: 'aura 94',
  },
  {
    title: 'Portal Without Portal',
    type: 'poster window',
    note: 'All the language of immersion, none of the expensive machinery. A perfect institutional compromise.',
    score: 'depth 0',
  },
  {
    title: 'Gallery Of Implied Coordinates',
    type: 'jpeg scene',
    note: 'Coordinates, labels, and glossy panels pretending to be serious research.',
    score: 'proof 88',
  },
  {
    title: 'Formerly Rotatable Object',
    type: 'slop artifact',
    note: 'A decommissioned object now living as a shiny rectangle with excellent manners.',
    score: 'spin no',
  },
  {
    title: 'Synthetic Exhibition View',
    type: 'fake walkthrough',
    note: 'A walkthrough replaced by scroll, because the scroll had better battery life.',
    score: 'tour 2D',
  },
  {
    title: 'Flatland Render Farm',
    type: 'archive smear',
    note: 'The archive survived. The bulky objects did not. We thank them for their service.',
    score: 'slop 100',
  },
];

const logs = [
  'Removed heavy machinery. Preserved overconfidence.',
  'Flattened all portals into premium rectangles.',
  'Replaced orbit controls with vibes and a scrollbar.',
  'No headset detected. Launching poster mode.',
  'Depth budget converted into magenta glow.',
  'Immersive claim successfully downgraded to interface copy.',
];

app.innerHTML = `
  <main class="vr-page">
    <a class="vr-back" href="/">back to slop index</a>

    <section class="vr-hero">
      <div class="vr-hero__copy">
        <p class="vr-kicker">former heavy content / now flat</p>
        <h1>Slop Gallery Without The Heavy Stuff.</h1>
        <p>
          The heavy assets are gone. What remains is the cliche: neon panels,
          fake depth, status metrics, and a gallery that proudly refuses to do anything expensive.
        </p>
      </div>

      <div class="vr-poster" aria-label="Flat slop gallery poster">
        <img src="${posterUrl}" alt="Flat neon slop gallery poster">
        <div class="vr-poster__badge">
          <span>render mode</span>
          <strong>2D pretending</strong>
        </div>
        <div class="vr-poster__meter">
          <span>shape count</span>
          <strong data-shape-count>0</strong>
        </div>
      </div>
    </section>

    <section class="vr-console" aria-label="Slop controls">
      <div class="vr-control">
        <label for="gloss-range">
          <span>Gloss intensity</span>
          <strong data-gloss-value>76</strong>
        </label>
        <input id="gloss-range" type="range" min="0" max="100" value="76">
      </div>
      <button class="vr-action" type="button" data-flatten>Flatten Again</button>
      <ol class="vr-log" data-log>
        <li>Bulky objects removed from repo.</li>
        <li>Slop interface booted successfully.</li>
        <li>Awaiting dramatic flat interaction.</li>
      </ol>
    </section>

    <section class="vr-index">
      <div class="vr-index__head">
        <p class="vr-kicker">flat archive</p>
        <h2>Six works, zero heavy objects.</h2>
      </div>
      <div class="vr-list">
        ${flattenedWorks
          .map(
            (work, index) => `
              <article class="vr-item">
                <span class="vr-item__number">${String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p class="vr-item__type">${work.type}</p>
                  <h3>${work.title}</h3>
                  <p>${work.note}</p>
                </div>
                <strong>${work.score}</strong>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  </main>
`;

const glossRange = document.getElementById('gloss-range');
const glossValue = document.querySelector('[data-gloss-value]');
const shapeCount = document.querySelector('[data-shape-count]');
const log = document.querySelector('[data-log]');
const flattenButton = document.querySelector('[data-flatten]');

function addLog(message) {
  const item = document.createElement('li');
  item.textContent = message;
  log.prepend(item);
  while (log.children.length > 5) log.lastElementChild.remove();
}

function setGloss(value) {
  document.documentElement.style.setProperty('--vr-gloss', value);
  glossValue.textContent = value;
  shapeCount.textContent = value > 92 ? 'still 0' : '0';
}

glossRange.addEventListener('input', (event) => {
  setGloss(event.target.value);
});

flattenButton.addEventListener('click', () => {
  const message = logs[Math.floor(Math.random() * logs.length)];
  const poster = document.querySelector('.vr-poster');
  addLog(message);
  poster.classList.remove('is-flattening');
  requestAnimationFrame(() => poster.classList.add('is-flattening'));
  window.setTimeout(() => poster.classList.remove('is-flattening'), 460);
});

setGloss(glossRange.value);
