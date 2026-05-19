import './portfolio-home.css';
import { projectsData } from './data.js';
import postEverythingLogoImage from './assets/post-everything-logo.png';
import fantasyLandscapeImage from './assets/fantasy-landscape.png';
import gravityImage from './assets/gravity-is-optional/image-0.png';

const app = document.getElementById('portfolio-app');

const featuredProjects = [
  {
    title: 'Post Everything',
    category: 'Bachelorarbeit',
    href: '/bachelorprojekt-post-everything.html',
    cta: 'Projekt öffnen',
    image: postEverythingLogoImage,
    imageAlt: 'Post Everything Projektansicht',
    meta: 'Regelbasierte Kreativitaet, Buchsystem, kontrollierter Zufall',
    text: 'Ein 300-seitiges Buchprojekt ueber Gestaltung unter maschinenaehnlichen Bedingungen. Nicht glatt erzaehlt, sondern als System aus Regeln, Parametern und stoerender Konsequenz.',
  },
  {
    title: 'FMDG / I find the luck',
    category: 'Antwortmaschine',
    href: '/version-3.html?focus=fmdg-i-find-the-luck',
    cta: 'Antwortmaschine ansehen',
    image: projectsData['fmdg-i-find-the-luck'].image,
    imageAlt: 'Vorschaubild von FMDG / I find the luck',
    meta: 'Fischli & Weiss, Suchmaschine, Uebersetzung, Interface',
    text: 'Eine Frage-Maschine, die das Poetische nicht erklaert, sondern in Suchspuren, Bildreste und Antworten zerlegt. Das Interface bleibt bewusst etwas widerspenstig.',
  },
  {
    title: 'Gravity Is Optional',
    category: 'Raum / Erzählung',
    href: '/gravity-is-optional.html',
    cta: 'Projekt ansehen',
    image: gravityImage,
    imageAlt: 'Vorschaubild von Gravity Is Optional',
    meta: 'Synthetische Fotografie, dokumentarische Stoerung, Serie',
    text: 'Generative Bilder, die nicht nach KI-Spektakel schreien, sondern fast dokumentarisch wirken und dann an einer kleinen falschen Stelle kippen.',
  },
  {
    title: '3D / VR',
    category: 'Raum',
    href: '/threedvr.html',
    cta: '3D / VR öffnen',
    image: fantasyLandscapeImage,
    imageAlt: '3D-Landschaft als Vorschaubild',
    meta: 'Blender, VR, Modellraum, digitale Buehne',
    text: 'Ein Cluster aus raeumlichen Arbeiten, Modellen und Renderings. Die Seite funktioniert eher wie ein bewegter Materialtisch als wie eine saubere Galerie.',
  },
];

const pathways = [
  {
    label: 'Lehre',
    title: 'Lehrprojekte',
    href: '/lehrprojekte.html',
    text: 'Kurse, Seminare und Experimente, in denen Gestaltung, Code und KI nicht getrennt voneinander behandelt werden.',
  },
  {
    label: 'Systeme',
    title: 'Tool Gallery',
    href: '/version-5.html',
    text: 'Kleine Maschinen, Generatoren und Interface-Studien. Werkzeuge als Haltung, nicht als Demo-Flaeche.',
  },
  {
    label: 'Recherche',
    title: 'Denkraum',
    href: '/blog.html',
    text: 'Ein offenes Feld aus Signalen, Archivspuren und verdichteten Beobachtungen.',
  },
];

app.innerHTML = `
  <section class="portfolio-hero">
    <div class="portfolio-hero__copy">
      <p class="portfolio-kicker">Claudia Mai</p>
      <h1>Index fuer Gestaltung, Lehre, Code und Systeme.</h1>
      <p class="portfolio-subheadline">Arbeiten zwischen Buch, Browser, KI, 3D und Unterricht. Nicht als glatte Case-Study-Wand, sondern als benutzbares Archiv mit kleinen Widerhaken.</p>
      <nav class="portfolio-jump" aria-label="Seitennavigation">
        <a href="#arbeiten">Arbeiten</a>
        <a href="#bereiche">Bereiche</a>
        <a href="/lehrkonzept.html">Lehrkonzept</a>
      </nav>
    </div>

    <div class="portfolio-atlas" aria-label="Visueller Index">
      ${featuredProjects
        .map(
          (project, index) => `
            <a class="portfolio-atlas__item portfolio-atlas__item--${index + 1}" href="${project.href}">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <img src="${project.image}" alt="${project.imageAlt}" />
            </a>
          `,
        )
        .join('')}
    </div>
  </section>

  <section class="portfolio-section" id="arbeiten">
    <div class="portfolio-section__head">
      <p class="portfolio-section__label">Ausgewählte Arbeiten</p>
      <h2>Keine Vitrine. Eher ein Arbeitsindex.</h2>
    </div>

    <div class="portfolio-work-list">
      ${featuredProjects
        .map(
          (project, index) => `
            <article class="portfolio-work">
              <a class="portfolio-work__image" href="${project.href}" aria-label="${project.title}">
                <img src="${project.image}" alt="${project.imageAlt}" loading="lazy" />
              </a>
              <div class="portfolio-work__content">
                <div class="portfolio-work__eyebrow">
                  <span>${String(index + 1).padStart(2, '0')}</span>
                  <p class="portfolio-work__category">${project.category}</p>
                </div>
                <h3><a href="${project.href}">${project.title}</a></h3>
                <p class="portfolio-work__meta">${project.meta}</p>
                <p>${project.text}</p>
                <a class="portfolio-text-link" href="${project.href}">${project.cta}</a>
              </div>
            </article>
          `,
        )
        .join('')}
    </div>
  </section>

  <section class="portfolio-section portfolio-section--paths" id="bereiche">
    <div class="portfolio-section__head">
      <p class="portfolio-section__label">Weitere Bereiche</p>
      <h2>Drei Tueren, alle etwas anders schief.</h2>
    </div>

    <div class="portfolio-paths">
      ${pathways
        .map(
          (item) => `
            <a class="portfolio-path" href="${item.href}">
              <p class="portfolio-path__label">${item.label}</p>
              <h3>${item.title}</h3>
              <span>${item.text}</span>
            </a>
          `,
        )
        .join('')}
    </div>
  </section>

  <section class="portfolio-outro">
    <p>Die zweite Eingangstuer bleibt absichtlich rauer: mehr Gegenentwurf, mehr Drift, weniger Portfolio-Konvention.</p>
    <a class="portfolio-button portfolio-button--primary" href="/postdigital.html">Postdigitales Projekt öffnen</a>
  </section>
`;
