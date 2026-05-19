import { projectsData } from './src/data.js';
import flexiblePopupImage from './src/assets/output/screenshots/flexible-visual-systems-popup.png';

const selectedProjectIds = [
  '1984-to-go-claudia-mai',
  'follow-the-white-rabbit',
  'fast-fwd-too-slow',
  'ich-bin-da',
  'fmdg-i-find-the-luck',
  'post-everything-bachelor-thesis',
  'real-mix',
  'nice-lab-50-50-nairobi',
];

const toolProjects = [
  {
    title: 'FLEXIBLE VISUAL SYSTEMS / GRID DRAWER',
    kind: 'Tools',
    filter: 'tools',
    href: 'flexible-visual-systems.html',
    image: flexiblePopupImage,
    text: 'Ein Flexible-Visual-Systems-Tool fuer distinctive shapes, maskenartige Container, organische Verbindungen und isometrische Bausteine. Die Form wird jedes Mal neu aus dem Grid entwickelt, damit sie auf Format, Typografie und Kommunikationsidee reagieren kann statt nur ein festes Asset zu reproduzieren.',
  },
  {
    title: 'FLEXIBLE VISUAL SYSTEMS / BLOB BUILDER',
    kind: 'Tools',
    filter: 'tools',
    href: 'grid-blob.html',
    image: flexiblePopupImage,
    text: 'Ein punktbasiertes Flexible-Visual-Systems-Tool fuer runde Zellen, Kreuzungs-Connectoren und organische Masken. Die exportierten Formen koennen als Bildmasken genutzt werden, um Paare, Spannungen und Beziehungen sichtbar zu machen: zwei Welten, zwei Produkte, zwei Momente oder zwei Perspektiven innerhalb eines visuellen Systems.',
  },
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

const projects = [
  ...selectedProjectIds.map((id, index) => {
    const project = projectsData[id];
    const isOwnProject = index < 6;
    return {
      title: decodeHtml(project.title),
      kind: isOwnProject ? 'Portfolio' : 'Lehre',
      filter: isOwnProject ? 'portfolio' : 'lehre',
      href: project.url,
      image: project.image,
      text: cleanText(project.text),
    };
  }),
  ...toolProjects,
];

const accents = [
  'rgba(56, 248, 255, 0.62)',
  'rgba(255, 61, 242, 0.62)',
  'rgba(185, 255, 69, 0.62)',
  'rgba(255, 138, 61, 0.62)',
];

const grid = document.querySelector('[data-project-grid]');
const template = document.querySelector('#project-card-template');
const canvas = document.querySelector('#slop-field');
const ctx = canvas.getContext('2d');

let activeFilter = 'all';
let particles = [];

function renderProjects() {
  grid.innerHTML = '';
  const visible = activeFilter === 'all'
    ? projects
    : projects.filter((project) => project.filter === activeFilter);

  visible.forEach((project, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const accent = accents[index % accents.length];
    card.style.setProperty('--accent', accent);
    card.style.setProperty('--hot-x', `${28 + ((index * 17) % 48)}%`);
    card.style.setProperty('--image-pos', '50% 50%');
    card.style.setProperty('--card-image', `url("${project.image}")`);
    card.querySelector('.project-kind').textContent = project.kind;
    card.querySelector('.project-score').textContent = String(index + 1).padStart(2, '0');
    card.querySelector('h3').textContent = project.title;
    card.querySelector('p').textContent = project.text;
    card.querySelector('.card-link').setAttribute('href', project.href);
    grid.append(card);
  });
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(76, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 0.8 + Math.random() * 2.3,
    vx: -0.18 + Math.random() * 0.36,
    vy: -0.12 + Math.random() * 0.28,
    hue: [184, 304, 81, 26][Math.floor(Math.random() * 4)],
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;
    if (particle.y < -10) particle.y = window.innerHeight + 10;
    if (particle.y > window.innerHeight + 10) particle.y = -10;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${particle.hue}, 100%, 68%, 0.62)`;
    ctx.shadowColor = `hsla(${particle.hue}, 100%, 68%, 0.48)`;
    ctx.shadowBlur = 16;
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    renderProjects();
  });
});

window.addEventListener('resize', resizeCanvas);

renderProjects();
resizeCanvas();
drawParticles();
