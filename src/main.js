import './style.css';
import { projectsData } from './data.js';
import { initSlopBackground } from './slop-bg.js';
import {
    getAiImageStats,
    getRandomAiImageSet,
    getRandomAiImageUrl
} from './ai-images.js';
import {
    getOutputMediaStats,
    getRandomOutputImageUrl,
    getRandomOutputScreenshotUrl,
    getRandomOutputVideoUrl
} from './output-media.js';
import { getRandomOutputLink } from './output-links.js';
const bootLog = document.getElementById('boot-log');
const bootScreen = document.getElementById('system-bootup');
const rssRowContainer = document.getElementById('rss-row-container');
const discordSidebarContainer = document.getElementById('discord-sidebar-container');
const bootMessages = [
    "[SYSTEM] OPENING INDEX SURFACE ....",
    "[SYSTEM] CALIBRATING DRIFT ....",
    "[SYSTEM] READY."
];

function spawnWorkInProgressNotice() {}

async function runBootSequence() {
    if (!bootScreen) {
        initSlopBackground();
        window.setTimeout(spawnWorkInProgressNotice, 2000);
        return;
    }
    
    for (let i = 0; i < bootMessages.length; i++) {
        bootLog.innerText += bootMessages[i] + '\n';
        await new Promise(r => setTimeout(r, 70));
    }
    
    await initSlopBackground();
    
    await new Promise(r => setTimeout(r, 110));
    
    bootScreen.style.opacity = '0';
    setTimeout(() => bootScreen.remove(), 260);
    window.setTimeout(spawnWorkInProgressNotice, 2000);
}

runBootSequence();

const fallbackRssFeed = [
    '1984-to-go-claudia-mai',
    'follow-the-white-rabbit',
    'fast-fwd-too-slow',
    'ich-bin-da',
    'fmdg-i-find-the-luck'
].map((id, index) => ({
    id: `portfolio-fallback-${id}`,
    title: projectsData[id]?.title || id,
    href: projectsData[id]?.url || '',
    source: 'Portfolio',
    timestamp: new Date(Date.now() - index * 1000 * 60 * 18).toISOString()
}));

const fallbackDiscordProjectIds = [
    'post-everything-bachelor-thesis',
    'real-mix',
    'nice-lab-50-50-nairobi'
];

const fallbackDiscordFeed = fallbackDiscordProjectIds.map((id, index) => ({
    id: `discord-fallback-${id}`,
    content: `${projectsData[id]?.title || id} ${projectsData[id]?.url || ''}`.trim(),
    author: 'Portfolio',
    timestamp: new Date(Date.now() - index * 3600000).toISOString()
}));

const projectPopupConcepts = {
    'fmdg-i-find-the-luck': {
        intro: 'FMDG / I find the luck wird hier als Ausgangspunkt fuer zwei weiterentwickelte Antwortmaschinen gelesen: einmal als KI-basierte Such- und Bildmaschine und einmal als bewusst inszenierte Vibe-Coding-Oberflaeche.',
        versions: [
            {
                href: '/version-3.html?focus=fmdg-i-find-the-luck',
                title: 'i find the luck 2.0',
                text: 'Diese Version wurde rein mit KI erstellt, wobei die Fragen weiterhin vorgegeben sind. Beantwortet werden die Fragen ueber die Google Search API, Bilder werden ebenfalls von Google bereitgestellt. Vor dem Einsatz von KI waere ein solches Projekt nur mit umfangreichen Programmierkenntnissen umsetzbar gewesen. Mit Vibe Coding laesst sich diese Art von Antwortmaschine heute sehr muehelos entwickeln.',
            },
            {
                href: '/version-2-5.html',
                title: 'answer machine 3.0',
                text: 'Answer Machine 3.0 ist die Weiterentwicklung von 2.0 und als rein vibe-codedes Konzept mit typischer KI-Optik angelegt. Fragen und Antworten werden ueber eine KI-Schnittstelle erzeugt und als fortlaufende Antwortmaschine inszeniert.',
            }
        ]
    }
};

const geminiToolDefinitions = {
    'gemini-image-filters': {
        fileLabel: '_ TOOL_01_react_webgl_filters.exe',
        title: 'IMAGE FILTERS',
        text: 'Eine webbasierte Tool-Suite fuer Lo-Fi visuelle Effekte wie Dithering, Halftone und Gradients, gesteuert ueber Echtzeit-Slider im Browser.',
    },
    'gemini-grid-designer': {
        fileLabel: '_ TOOL_02_flexible_visual_systems_grid_drawer.html',
        title: 'FLEXIBLE VISUAL SYSTEMS / GRID DRAWER',
        text: 'Ein Flexible-Visual-Systems-Tool fuer distinctive shapes, maskenartige Container, organische Verbindungen und isometrische Bausteine. Die Form wird jedes Mal neu aus dem Grid entwickelt, damit sie auf Format, Typografie und Kommunikationsidee reagieren kann statt nur ein festes Asset zu reproduzieren.',
        image: '/src/assets/output/screenshots/flexible-visual-systems-popup.png',
        url: '/flexible-visual-systems.html',
    },
    'gemini-gridblob-tool': {
        fileLabel: '_ TOOL_02B_flexible_visual_systems_blob_builder.html',
        title: 'FLEXIBLE VISUAL SYSTEMS / BLOB BUILDER',
        text: 'Ein punktbasiertes Flexible-Visual-Systems-Tool fuer runde Zellen, Kreuzungs-Connectoren und organische Masken. Die exportierten Formen koennen als Bildmasken genutzt werden, um Paare, Spannungen und Beziehungen sichtbar zu machen: zwei Welten, zwei Produkte, zwei Momente oder zwei Perspektiven innerhalb eines visuellen Systems.',
        url: '/grid-blob.html',
    },
    'gemini-ai-prompt-tools': {
        fileLabel: '_ TOOL_03_prompt_visualizer.sys',
        title: 'PROMPT VISUALIZER',
        text: 'Ein serverseitiges Tool zur Generierung und Optimierung von AI Prompts. Es verknuepft komplexe Text-Modelle und vereinfacht die visuelle Steuerung von Parametern.',
    },
};

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function truncateText(value = '', maxLength = 130) {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength).trim()}...`;
}

function toSafeDomId(prefix, value, fallback = 'item') {
    const normalized = String(value || fallback)
        .replace(/&[a-z0-9#]+;/gi, '-')
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

    return `${prefix}${normalized || fallback}`;
}

function buildReadMoreLink(url, label = '[ READ MORE ]') {
    if (!url) return '';
    const safeUrl = escapeHtml(url);
    return `<br><br><a href="${safeUrl}" target="_blank" rel="noopener" style="color: blue; background: #ccff00; text-decoration: none; padding: 2px 5px; display: inline-block; border: 1px solid blue; font-weight: bold;">${label}</a>`;
}

function renderProjectPopupConcept(projectId) {
    const concept = projectPopupConcepts[projectId];
    if (!concept) return '';

    return `
      <div style="margin-top:16px; padding-top:14px; border-top:1px solid #000;">
        <p style="margin:0 0 12px; color:#000; line-height:1.5;"><strong>Konzept</strong><br>${concept.intro}</p>
        ${concept.versions
            .map(
                (version) => `
                  <div style="margin-top:12px; padding:12px; border:1px solid #000; background:#f3f3f3;">
                    <p style="margin:0 0 8px; font-family:monospace; font-size:12px; text-transform:uppercase;"><strong>${version.title}</strong></p>
                    <p style="margin:0 0 10px; color:#000; line-height:1.5;">${version.text}</p>
                    <a href="${version.href}" style="display:inline-block; background:#000; color:#fff; padding:5px 10px; text-decoration:none;">${version.title}</a>
                  </div>
                `,
            )
            .join('')}
      </div>
    `;
}

function normalizeRssItems(items = []) {
    return items
        .map((item, index) => ({
            id: item.id || item.src || item.href || `rss-${index}`,
            source: 'rss',
            title: item.title || item.credit || item.caption || 'RSS signal detected',
            href: item.href || item.link || '',
            sourceLabel: item.source || item.caption || '#rss',
            timestamp: item.timestamp || new Date(Date.now() - index * 600000).toISOString()
        }))
        .filter((item) => item.title);
}

function renderNewsSurface() {
    loadArchiveSurface();
}
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const cursorSwitcher = document.getElementById('cursor-switcher');
const cursorModeButtons = cursorSwitcher ? Array.from(cursorSwitcher.querySelectorAll('[data-cursor-mode]')) : [];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = window.innerWidth / 2;
let ringY = window.innerHeight / 2;
const catEmojis = ['😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐈', '🐈‍⬛', '🐱', '✨', '🐾'];
let lastSpawnTime = 0;
const cursorModes = new Set(['cats', 'minimal', 'off']);
let cursorMode = 'cats';

function applyCursorMode(nextMode) {
    const safeMode = cursorModes.has(nextMode) ? nextMode : 'cats';
    cursorMode = safeMode;

    document.body.classList.remove('cursor-mode-cats', 'cursor-mode-minimal', 'cursor-mode-off');
    document.body.classList.add(`cursor-mode-${safeMode}`);

    cursorModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.cursorMode === safeMode);
    });

    window.localStorage.setItem('index-cursor-mode', safeMode);
}

const storedCursorMode = window.localStorage.getItem('index-cursor-mode');
if (storedCursorMode) {
    applyCursorMode(storedCursorMode);
} else {
    applyCursorMode('cats');
}

cursorModeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        applyCursorMode(button.dataset.cursorMode);
    });
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    const now = Date.now();
    if (cursorMode === 'cats' && now - lastSpawnTime > 150) {
        lastSpawnTime = now;
        spawnCatEmoji(mouseX, mouseY);
    }
});

function spawnCatEmoji(x, y) {
    const emojiStr = catEmojis[Math.floor(Math.random() * catEmojis.length)];
    const startSize = 44 + Math.random() * 34;
    const endScale = 4.2 + Math.random() * 1.8;
    const el = document.createElement('div');
    el.innerText = emojiStr;
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9998';
    el.style.fontSize = `${startSize}px`;
    el.style.transition = 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transform = `translate(-50%, -50%) scale(1) rotate(${(Math.random() - 0.5) * 45}deg)`;
    el.style.opacity = '1';
    el.style.filter = 'drop-shadow(0 14px 28px rgba(0,0,0,0.28))';
    el.style.userSelect = 'none';
    el.style.cursor = 'none';

    document.body.appendChild(el);
    setTimeout(() => {
        el.style.transform = `translate(-50%, ${-140 - Math.random() * 90}px) scale(${endScale}) rotate(${(Math.random() - 0.5) * 120}deg)`;
        el.style.opacity = '0';
    }, 320);
    setTimeout(() => {
        el.remove();
    }, 2100);
}
function animateCursor() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();
const desktopSpace = document.getElementById('desktop-space');
const directoryList = document.getElementById('directory-list');
const isCompactViewport = () => window.matchMedia('(max-width: 768px)').matches;

const ownProjects = [
    "1984-to-go-claudia-mai", "100-poster-battle-2-sharing-cultural-identities",
    "follow-the-white-rabbit", "fast-fwd-too-slow-magazine", "fast-fwd-too-slow",
    "ich-bin-da", "fmdg-i-find-the-luck",
    "post-everything-bachelor-thesis"
];

const ownProjectLinks = [
    {
        id: 'own-project-gravity-is-optional',
        title: 'Gravity is Optional',
        fileLabel: '_ gravity_is_optional.html',
        href: '/gravity-is-optional.html'
    }
];

const fallbackOutputImage =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <rect width="640" height="640" fill="#111111"/>
          <rect x="32" y="32" width="576" height="576" fill="none" stroke="#ff1493" stroke-width="6"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="36">NO_AI_IMAGE_FOUND</text>
        </svg>
    `);

const outputMediaStats = getOutputMediaStats();
const aiImageStats = getAiImageStats();
const outputDefinitions = {
    "midjourney-fashion": {
        title: "SYNTHETIC_WARDROBE_LEAK",
        fileLabel: "OUTPUT_01_synthetic_wardrobe_leak.img",
        accent: "#00ffc6"
    },
    "midjourney-architecture": {
        title: "BRUTALIST_DREAM_CACHE",
        fileLabel: "OUTPUT_02_brutalist_dream_cache.img",
        accent: "#ff8a00"
    },
    "midjourney-creatures": {
        title: "CREATURE_RESIDUE",
        fileLabel: "OUTPUT_03_creature_residue.img",
        accent: "#8d6bff"
    }
};
const studentProjects = Object.keys(projectsData).filter(
    (id) => !ownProjects.includes(id),
);
function createDirectoryHTML() {
    let html = '<div class="dir-category">/01/Eig_Projekte</div>';
    ownProjects.forEach(id => {
        if (projectsData[id]) {
            html += `<button class="file-item" data-id="${id}">_ ${projectsData[id].title}</button>`;
        }
    });
    ownProjectLinks.forEach(item => {
        html += `<button class="file-item" data-id="${item.id}">${item.fileLabel}</button>`;
    });

    html += '<div class="dir-category" style="margin-top: 20px;">/02/Lehre_Studierende</div>';
    studentProjects.forEach(id => {
        if (projectsData[id]) {
            html += `<button class="file-item" data-id="${id}">_ ${projectsData[id].title}</button>`;
        }
    });

    html += '<div class="dir-category" style="margin-top: 20px;">/03/Tools</div>';
    html += '<button class="file-item" data-id="tool-gallery-link">_ tool_gallery.html</button>';
    html += '<button class="file-item" data-id="denkraum-link">_ denkraum.html</button>';
    html += '<button class="file-item" data-id="prompting-workshops-link">_ Prompting_Workshops.pdf</button>';
    html += '<button class="file-item" data-id="ai-image-archive">_ KI_IMAGE_ARCHIVE.rnd</button>';
    html += '<div class="dir-category" style="margin-top: 20px;">/04/Manifesto_Statements</div>';
    html += '<button class="file-item" data-id="statement-wandel">_ 01_Der_Wandel.txt</button>';
    html += '<button class="file-item" data-id="statement-kompetenz">_ 02_Die_neue_Kompetenz.txt</button>';
    html += '<button class="file-item" data-id="statement-wertversprechen">_ 03_Wertversprechen.txt</button>';
    html += '<button class="file-item" data-id="statement-block-1">_ 04_Fokus_Superkraefte.txt</button>';
    html += '<button class="file-item" data-id="statement-block-2">_ 05_Kampf_Mittelmaessigkeit.txt</button>';
    html += '<button class="file-item" data-id="statement-block-3">_ 06_Transparenz_Prozess.txt</button>';
    html += '<button class="file-item" data-id="statement-block-4">_ 07_Ethik_Leitplanke.txt</button>';
    html += '<button class="file-item" data-id="statement-block-5">_ 08_Himmelfahrtskommando.txt</button>';
    html += '<button class="file-item" data-id="statement-block-6">_ 09_Grundlagen_und_Zukunft.txt</button>';

    directoryList.innerHTML = html;
}
createDirectoryHTML();
let topZIndex = 100;

function makeDraggable(windowEl) {
    const header = windowEl.querySelector('.window-header');
    if (!header) return;

    if (isCompactViewport()) {
        header.onmousedown = null;
        return;
    }

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;
    windowEl.addEventListener('mousedown', () => {
        topZIndex++;
        windowEl.style.zIndex = topZIndex;
    });

    function dragMouseDown(e) {
        if (e.target.classList.contains('window-close')) return;

        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        topZIndex++;
        windowEl.style.zIndex = topZIndex;
        windowEl.style.opacity = "0.8";
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        windowEl.style.top = (windowEl.offsetTop - pos2) + "px";
        windowEl.style.left = (windowEl.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        windowEl.style.opacity = "1";
    }
}

function getRandomDesktopPosition(width, height, leftOffset = 80, topOffset = 50) {
    return {
        left: leftOffset + Math.random() * Math.max(0, window.innerWidth - (width + leftOffset + 40)),
        top: topOffset + Math.random() * Math.max(0, window.innerHeight - (height + topOffset + 40))
    };
}

function attachCloseHandler(windowEl) {
    if (!windowEl) return;
    const closeBtn = windowEl.querySelector('.window-close');
    if (!closeBtn) return;

    closeBtn.addEventListener('click', () => {
        windowEl.remove();
    });
}

function createOutputSignalMarkup(config) {
    const videoStatus = outputMediaStats.videos > 0 ? 'VIDEO_BUFFER_READY' : 'VIDEO_SOURCE_MISSING';

    return `
      <div class="output-signal-grid">
        <div class="output-signal-cell">
          <span class="output-signal-label">IMAGES</span>
          <strong>${String(outputMediaStats.images).padStart(2, '0')}</strong>
        </div>
        <div class="output-signal-cell">
          <span class="output-signal-label">VIDEOS</span>
          <strong>${String(outputMediaStats.videos).padStart(2, '0')}</strong>
        </div>
        <div class="output-signal-cell">
          <span class="output-signal-label">SHOTS</span>
          <strong>${String(outputMediaStats.screenshots).padStart(2, '0')}</strong>
        </div>
        <div class="output-signal-cell">
          <span class="output-signal-label">ENTRY</span>
          <strong>${config.title}</strong>
        </div>
        <div class="output-signal-cell">
          <span class="output-signal-label">STATE</span>
          <strong>${videoStatus}</strong>
        </div>
      </div>
    `;
}

function createScreenshotMarkup(screenshotUrl) {
    return `
      <img src="${screenshotUrl}" class="output-media output-media-image" alt="Website screenshot fragment">
      <div class="output-caption">WEBSITE_SCREENSHOT / LOCAL_CAPTURE / CROPPED_MEMORY</div>
    `;
}

function createOutputLinkMarkup(randomLink) {
    return `
      <div class="output-link-card">
        <div class="output-link-label">${randomLink.label || 'EXTERNAL_SITE'}</div>
        <a href="${randomLink.url}" target="_blank" rel="noopener noreferrer" class="output-link-anchor">${randomLink.url}</a>
      </div>
      <div class="output-caption">LIVE_REFERENCE / EXTERNAL_DESTINATION / NEW_TAB</div>
    `;
}

function spawnOutputExperience(id) {
    const config = outputDefinitions[id];
    if (!config) return;
    const randomScreenshot = getRandomOutputScreenshotUrl();
    const randomVideo = getRandomOutputVideoUrl();
    const randomLink = getRandomOutputLink(id);

    const imageWindows = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < imageWindows; i++) {
        const subId = `${id}-image-${i}`;
        if (document.getElementById(`win-${subId}`)) continue;

        const w = 220 + Math.floor(Math.random() * 220);
        const h = 190 + Math.floor(Math.random() * 160);
        const pos = getRandomDesktopPosition(w, h, 70, 50);
        const randomImg = getRandomOutputImageUrl() || fallbackOutputImage;

        const winHTML = `
          <div class="window output-window output-window-image" id="win-${subId}" style="top:${pos.top}px; left:${pos.left}px; width:${w}px; background:#050505; border-color:${config.accent};">
            <div class="window-header output-window-header" style="background:${config.accent}; color:#000;">
              <span class="win-title">${config.title} // FRAGMENT_${String(i + 1).padStart(2, '0')}</span>
              <button class="window-close" style="color:${config.accent}; background:#000;">X</button>
            </div>
            <div class="window-content output-window-content">
              <img src="${randomImg}" class="output-media output-media-image" alt="${config.title} fragment">
              <div class="output-caption">LOCAL_IMAGE_FRAGMENT / UNSTABLE_ARCHIVE / CLICK_DRAG_REPEAT</div>
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(`win-${subId}`);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        attachCloseHandler(newWin);
    }

    const signalId = `win-${id}-signal`;
    if (!document.getElementById(signalId)) {
        const pos = getRandomDesktopPosition(280, 180, 120, 120);
        const winHTML = `
          <div class="window output-window output-window-signal" id="${signalId}" style="top:${pos.top}px; left:${pos.left}px; width:280px; background:#0e0e0e; border-color:${config.accent};">
            <div class="window-header output-window-header" style="background:#0e0e0e; color:${config.accent}; border-bottom:1px solid ${config.accent};">
              <span class="win-title">${config.fileLabel}</span>
              <button class="window-close" style="color:#0e0e0e; background:${config.accent};">X</button>
            </div>
            <div class="window-content output-window-content output-window-content-signal">
              ${createOutputSignalMarkup(config)}
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(signalId);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        attachCloseHandler(newWin);
    }

    const screenshotWindowId = `win-${id}-screenshot`;
    if (randomScreenshot && !document.getElementById(screenshotWindowId)) {
        const pos = getRandomDesktopPosition(340, 260, 140, 80);
        const winHTML = `
          <div class="window output-window output-window-screenshot" id="${screenshotWindowId}" style="top:${pos.top}px; left:${pos.left}px; width:340px; background:#040404; border-color:${config.accent};">
            <div class="window-header output-window-header" style="background:#040404; color:${config.accent}; border-bottom:1px solid ${config.accent};">
              <span class="win-title">${config.title} // SCREEN_CAPTURE</span>
              <button class="window-close" style="color:#040404; background:${config.accent};">X</button>
            </div>
            <div class="window-content output-window-content">
              ${createScreenshotMarkup(randomScreenshot)}
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(screenshotWindowId);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        attachCloseHandler(newWin);
    }

    const videoWindowId = `win-${id}-video`;
    if (randomVideo && !document.getElementById(videoWindowId)) {
        const pos = getRandomDesktopPosition(360, 260, 180, 90);
        const winHTML = `
          <div class="window output-window output-window-video" id="${videoWindowId}" style="top:${pos.top}px; left:${pos.left}px; width:360px; background:#020202; border-color:${config.accent};">
            <div class="window-header output-window-header" style="background:#020202; color:${config.accent}; border-bottom:1px solid ${config.accent};">
              <span class="win-title">${config.title} // LOOP_FEED</span>
              <button class="window-close" style="color:#020202; background:${config.accent};">X</button>
            </div>
            <div class="window-content output-window-content">
              <video class="output-media output-media-video" src="${randomVideo}" autoplay muted loop playsinline></video>
              <div class="output-caption">LOCAL_VIDEO_LOOP / MUTED / PLAYING_FROM_CACHE</div>
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(videoWindowId);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        attachCloseHandler(newWin);
    }

    const linkWindowId = `win-${id}-link`;
    if (randomLink && !document.getElementById(linkWindowId)) {
        const pos = getRandomDesktopPosition(320, 170, 210, 140);
        const winHTML = `
          <div class="window output-window output-window-link" id="${linkWindowId}" style="top:${pos.top}px; left:${pos.left}px; width:320px; background:#050505; border-color:${config.accent};">
            <div class="window-header output-window-header" style="background:${config.accent}; color:#000;">
              <span class="win-title">${config.title} // LINK_POINTER</span>
              <button class="window-close" style="color:${config.accent}; background:#000;">X</button>
            </div>
            <div class="window-content output-window-content">
              ${createOutputLinkMarkup(randomLink)}
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(linkWindowId);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        attachCloseHandler(newWin);
    }
}

function createAiSignalMarkup() {
    return `
      <div class="output-signal-grid">
        <div class="output-signal-cell">
          <span class="output-signal-label">AI_IMAGES</span>
          <strong>${String(aiImageStats.images).padStart(3, '0')}</strong>
        </div>
        <div class="output-signal-cell">
          <span class="output-signal-label">MODE</span>
          <strong>RANDOM_WINDOW_CLUSTER</strong>
        </div>
        <div class="output-signal-cell">
          <span class="output-signal-label">STATE</span>
          <strong>${aiImageStats.images ? 'ARCHIVE_ONLINE' : 'ARCHIVE_EMPTY'}</strong>
        </div>
        <div class="output-signal-cell">
          <span class="output-signal-label">SOURCE</span>
          <strong>src/assets/ai-images</strong>
        </div>
      </div>
    `;
}

function spawnAiImageArchive() {
    const clusterId = `ai-cluster-${Date.now()}`;
    const imagesToOpen = getRandomAiImageSet(2 + Math.floor(Math.random() * 3));

    if (!imagesToOpen.length) {
        const emptyId = `win-${clusterId}-empty`;

        const pos = getRandomDesktopPosition(360, 220, 140, 80);
        const winHTML = `
          <div class="window ai-window" id="${emptyId}" style="top:${pos.top}px; left:${pos.left}px; width:360px; background:#050505; border-color:#00ffd5;">
            <div class="window-header ai-window-header">
              <span class="win-title">KI_IMAGE_ARCHIVE // EMPTY</span>
              <button class="window-close ai-window-close">X</button>
            </div>
            <div class="window-content ai-window-content">
              <div class="output-no-signal">
                <div class="output-no-signal-lines"></div>
                <div class="output-no-signal-text">DROP_FILES_IN_src-assets-ai-images</div>
              </div>
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const emptyWin = document.getElementById(emptyId);
        makeDraggable(emptyWin);
        topZIndex++;
        emptyWin.style.zIndex = topZIndex;
        attachCloseHandler(emptyWin);
        return;
    }

    imagesToOpen.forEach((imageUrl, index) => {
        const subId = `${clusterId}-image-${index}`;

        const w = 240 + Math.floor(Math.random() * 260);
        const h = 220 + Math.floor(Math.random() * 190);
        const pos = getRandomDesktopPosition(w, h, 90, 45);
        const tone = ['#00ffd5', '#ff4fd8', '#93ff2f', '#ffffff'][index % 4];

        const winHTML = `
          <div class="window ai-window ai-window-image" id="win-${subId}" style="top:${pos.top}px; left:${pos.left}px; width:${w}px; background:#030303; border-color:${tone};">
            <div class="window-header ai-window-header" style="border-bottom-color:${tone}; color:${tone};">
              <span class="win-title">KI_IMAGE_ARCHIVE // SAMPLE_${String(index + 1).padStart(2, '0')}</span>
              <button class="window-close ai-window-close" style="background:${tone}; color:#000;">X</button>
            </div>
            <div class="window-content ai-window-content">
              <img src="${imageUrl}" class="output-media output-media-image ai-window-media" alt="Random KI image">
              <div class="ai-window-caption">RANDOM_AI_IMAGE / LOCAL_ARCHIVE / RELOAD_FOR_NEW_SET</div>
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(`win-${subId}`);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        attachCloseHandler(newWin);
    });

    const signalId = `win-${clusterId}-signal`;
    const pos = getRandomDesktopPosition(300, 180, 180, 110);
    const coverImage = getRandomAiImageUrl();
    const winHTML = `
      <div class="window ai-window ai-window-signal" id="${signalId}" style="top:${pos.top}px; left:${pos.left}px; width:300px; background:#050505; border-color:#00ffd5;">
        <div class="window-header ai-window-header" style="border-bottom-color:#00ffd5; color:#00ffd5;">
          <span class="win-title">KI_IMAGE_ARCHIVE // INDEX</span>
          <button class="window-close ai-window-close" style="background:#00ffd5; color:#000;">X</button>
        </div>
        <div class="window-content ai-window-content">
          ${coverImage ? `<img src="${coverImage}" class="ai-window-index-preview" alt="AI archive preview">` : ''}
          ${createAiSignalMarkup()}
        </div>
      </div>
    `;

    desktopSpace.insertAdjacentHTML('beforeend', winHTML);
    const newWin = document.getElementById(signalId);
    makeDraggable(newWin);
    topZIndex++;
    newWin.style.zIndex = topZIndex;
    attachCloseHandler(newWin);
}
const fileItems = document.querySelectorAll('.file-item');

fileItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const id = item.getAttribute('data-id');
        const ownProjectLink = ownProjectLinks.find((entry) => entry.id === id);
        let project = projectsData[id];

        if (ownProjectLink) {
            window.location.href = ownProjectLink.href;
            return;
        }

        if (id === 'tool-gallery-link') {
            window.location.href = '/version-5.html';
            return;
        }

        if (id === 'denkraum-link') {
            window.location.href = '/blog.html';
            return;
        }

        if (id === 'prompting-workshops-link') {
            window.location.href = '/pdfs/prompting-workshops.pdf';
            return;
        }
        if (id.startsWith('gemini-')) {
            const toolDefinition = geminiToolDefinitions[id];
            const fallbackDesc = "Entwicklung kreativer Web-Applikationen und visueller Tools in Kollaboration mit GenAI. Fokus auf experimentelles Frontend-Design und Architektur durch KI-Assistenz.";

            project = {
                title: toolDefinition?.title || id.replace('gemini-', '').replace(/-/g, ' ').toUpperCase(),
                author: "Claudia Mai + AI",
                text: toolDefinition?.text || fallbackDesc,
                image: toolDefinition?.image || getRandomOutputImageUrl() || fallbackOutputImage,
                url: toolDefinition?.url || "#"
            };
        }

        if (id.startsWith('midjourney-')) {
            spawnOutputExperience(id);
            return;
        }

        if (id === 'drift-tool') {
            window.location.href = 'copy-machine.html';
            return;
        }

        if (id === 'ai-image-archive') {
            spawnAiImageArchive();
            return;
        }
        if (id.startsWith('statement-')) {
            let title = id;
            let introText = "";
            let blockText = "";

            if (id === 'statement-wandel') {
                title = "01_Der_Wandel.txt";
                introText = "DER WANDEL";
                blockText = "Die Frage ist nicht mehr, ob KI in gestalterischen Produktionsprozessen eingesetzt wird, sondern welche Funktion sie darin einnimmt. Der Status des bloßen Assistenztools ist längst überschritten. Ein einzelner Prompt kann heute multimodale Produktionsketten auslösen: Text, Bild, Layout, Variation, Verdichtung. Damit verschiebt sich die Rolle der Gestalterin nicht ins Abseits, sondern in Richtung Orchestrierung, Kuration und Verantwortungsübernahme. Die operative Ausführung wird teilautomatisiert, die konzeptionelle und ästhetische Entscheidung wird wichtiger.";
            } else if (id === 'statement-kompetenz') {
                title = "02_Die_neue_Kompetenz.txt";
                introText = "DIE NEUE KOMPETENZ";
                blockText = "Die zentrale Kompetenz liegt nicht im schnellen Prompten, sondern in der Unterscheidung von Polishing und Producing. Beim Polishing ist KI hochfunktional: Sie optimiert, bereinigt, segmentiert, skaliert und beschleunigt. Beim Producing aus dem Nichts beginnt dagegen die eigentliche Gestaltungsarbeit. Dann braucht es Kontextwissen, Urteilskraft, visuelle Präzision und editorische Kontrolle. Entscheidend ist nicht, dass etwas generiert werden kann, sondern ob es formal, kulturell und inhaltlich tragfähig ist.";
            } else if (id === 'statement-wertversprechen') {
                title = "03_Wertversprechen.txt";
                introText = "WERTVERSPRECHEN";
                blockText = "Wenn generative Systeme die Produktionskosten für generische Inhalte gegen null drücken, verliert Durchschnitt an Wert. Gerade daraus entsteht eine neue Authentizitätsprämie. Relevant werden Arbeiten, in denen Autorenschaft, Kontextsensibilität und ästhetische Position erkennbar bleiben. Der Mehrwert liegt nicht in der Menge erzeugter Varianten, sondern in Auswahl, Reduktion, Verdichtung und im bewussten Verzicht. Kuration ist hier keine Nebenaufgabe, sondern die eigentliche gestalterische Leistung.";
            } else if (id === 'statement-block-1') {
                title = "04_Fokus_Superkraefte.txt";
                introText = "EPISTEMISCHE WACHSAMKEIT";
                blockText = "Epistemische Wachsamkeit bedeutet, KI-generierte Ergebnisse nicht als neutrale Vorschläge zu behandeln, sondern als hochgradig vorgeprägte Outputs. Woher stammt diese Bildsprache? Welche Datensätze und kulturellen Normen sprechen hier mit? Welche Perspektiven fehlen systematisch? Für die Gestaltungspraxis ist das keine theoretische Zusatzaufgabe, sondern methodische Grundhaltung. Wer mit KI arbeitet, muss Bias, blinde Flecken und hegemoniale Muster erkennen können, statt glatten Oberflächen vorschnell zu vertrauen.";
            } else if (id === 'statement-block-2') {
                title = "05_Kampf_Mittelmaessigkeit.txt";
                introText = "KAMPF DER MITTELMÄSSIGKEIT";
                blockText = "Wenn Algorithmen massenhaft Material ohne ernsthafte menschliche Selektion ausgeben, entsteht AI-Slop: formal oft brauchbar, aber kulturell flach, austauschbar und ohne Nachhall. Generative Modelle rekonfigurieren bestehende Muster. Genau deshalb führt unkritischer Einsatz fast zwangsläufig zu ästhetischer Homogenisierung. Gestaltung muss diesem Standardisierungsdruck etwas entgegensetzen: Differenz, Reibung, Kontext, Formbewusstsein und eine klar erkennbare Haltung.";
            } else if (id === 'statement-block-3') {
                title = "06_Transparenz_Prozess.txt";
                introText = "TRANSPARENZ & PROZESS";
                blockText = "In der Zusammenarbeit mit KI wird das Veto zu einem zentralen Entwurfsinstrument. Nicht jedes plausible Resultat verdient Anschluss. Das bewusste Ablehnen, Filtern und Umlenken ist kein Verlust, sondern der Punkt, an dem Gestaltung überhaupt erst konturiert wird. Prozesssichtbarkeit bedeutet daher mehr als Making-of-Rhetorik. Sie macht nachvollziehbar, welche Entscheidungen getroffen, welche Vorschläge verworfen und welche Wissensbestände dem maschinellen Output entgegengesetzt wurden.";
            } else if (id === 'statement-block-4') {
                title = "07_Ethik_Leitplanke.txt";
                introText = "ETHIK ALS LEITPLANKE";
                blockText = "KI kann halluzinieren, vorhandenes Material replizieren, diskriminierende Logiken fortschreiben oder trügerische Evidenz erzeugen. Die Verantwortung für das Endprodukt bleibt dennoch beim Menschen. Gestaltung im KI-Zeitalter braucht deshalb nicht mehr Technikgläubigkeit, sondern mehr intellektuelle und ethische Souveränität. Prüfen, auditieren, kennzeichnen, zweifeln und gegebenenfalls widersprechen sind keine Bremsen des Prozesses, sondern professionelle Mindeststandards.";
            } else if (id === 'statement-block-5') {
                title = "08_Himmelfahrtskommando.txt";
                introText = "HIMMELFAHRTSKOMMANDO / HÖLLENRITT";
                blockText = "Warum ich mich auf eine Stelle bewerbe, die vier Studiengänge innerhalb eines Fachbereichs abdeckt, und zugleich sage, dass sie realistisch nur in Teilzeit zu leisten ist? Weil genau darin die strukturelle Zumutung sichtbar wird. Das Tätigkeitsfeld ist längst hybrid: Gestaltung, digitale Produktion, KI, Vermittlung, Marktbeobachtung, methodische Aktualisierung. Wer 24 SWS Lehre stemmen und parallel diese Wissensfelder auf Stand halten soll, sitzt in einem Himmelfahrtskommando. Gerade im KI-Bereich entstehen in kürzester Zeit neue Modelle, Interfaces und Produktionsparadigmen. Wer substanziell lehren will, braucht Zeit für Recherche, Erprobung und kritische Einordnung. Deshalb halte ich ein Modell mit Lehrbeauftragten nicht für eine Verlegenheitslösung, sondern für eine notwendige Durchlässigkeit zwischen Hochschule und Praxis. Vielfalt ist nicht das Problem. Fehlende Zeit für qualifizierte Aktualisierung ist das Problem.";
            } else if (id === 'statement-block-6') {
                title = "09_Grundlagen_und_Zukunft.txt";
                introText = "GRUNDLAGEN KOMMEN VOR ALLEM ANDEREN";
                blockText = "Mein Ziel ist nicht, Studierende dazu zu bringen, alles mit KI zu machen. Mein Ziel ist, sie dafür auszubilden, das zu realisieren, was sie realisieren wollen, auch wenn sich die Werkzeuge permanent verändern. Deshalb kommen Grundlagen vor allem anderen: Typografie, Bild, Form, Raum, Kontext, Recherche, Urteil und gestalterische Methodik. Wer diese Basis nicht beherrscht, wird durch KI nicht besser, sondern nur schneller beliebig. Gleichzeitig erweitert KI die Handlungsspielräume erheblich. Die Studierenden müssen keine Entwicklerinnen und Entwickler werden, aber sie können heute Dinge entwerfen und prototypisieren, die vorher außerhalb ihrer Reichweite lagen. Durchsetzen werden sich diejenigen, die beides beherrschen: die Basis und die neuen Systeme.";
            }

            const w = id === 'statement-block-5' || id === 'statement-block-6' ? 520 : 450;
            const h = id === 'statement-block-5' || id === 'statement-block-6' ? 360 : 300;
            const randomLeft = 100 + Math.random() * Math.max(0, window.innerWidth - (w + 40));
            const randomTop = 100 + Math.random() * Math.max(0, window.innerHeight - (h + 80));

            const winHTML = `
              <div class="window" id="win-${id}" style="top: ${randomTop}px; left: ${randomLeft}px; width: ${w}px; z-index: ${topZIndex + 1}; background: #e0e0e0;">
                <div class="window-header" style="background: #000; color: #fff;">
                  <span class="win-title">${title}</span>
                  <button class="window-close" style="color: #fff; background: red;">X</button>
                </div>
                <div class="window-content manifesto-window-content" style="padding: 20px; color: #000; font-family: 'Space Grotesk', monospace;">
                  <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.2rem; letter-spacing: -0.05em; border-bottom: 2px solid #000; padding-bottom: 5px;">${introText}</h3>
                  <p style="font-size: 0.95rem; line-height: 1.56; text-align: justify; hyphens: auto;">
                    ${blockText}
                  </p>
                </div>
              </div>
            `;

            desktopSpace.insertAdjacentHTML('beforeend', winHTML);
            const newWin = document.getElementById(`win-${id}`);
            makeDraggable(newWin);

            topZIndex++;
            newWin.style.zIndex = topZIndex;

            const closeBtn = newWin.querySelector('.window-close');
            closeBtn.addEventListener('click', () => {
                newWin.remove();
            });
            return;
        }

        if (!project) return;

        if (document.getElementById(`win-${id}`)) {
            const existingWin = document.getElementById(`win-${id}`);
            topZIndex++;
            existingWin.style.zIndex = topZIndex;
            return;
        }
        const randomLeft = 320 + Math.random() * Math.max(0, window.innerWidth - 750);
        const randomTop = 20 + Math.random() * Math.max(0, window.innerHeight - 500);
        const winHTML = `
          <div class="window" id="win-${id}" style="top: ${randomTop}px; left: ${randomLeft}px; width: 400px; max-height: 80vh;">
            <div class="window-header">
              <span class="win-title">${project.title}</span>
              <button class="window-close">X</button>
            </div>
            <div class="window-content">
              <div style="width:100%; margin-bottom: 10px; background: #eee;">
                 <img src="${project.image || fallbackOutputImage}" style="width: 100%; height: auto; display: block;" alt="Project Image">
              </div>
              <p data-i18n-project-text="${id}" style="margin-top:10px; color: #000; line-height: 1.5;">
                ${project.text}
              </p>
              ${renderProjectPopupConcept(id)}
              ${project.url && project.url !== '#' ? `<a href="${project.url}" target="_blank" style="display:inline-block; margin-top: 10px; background: #000; color: #fff; padding: 5px 10px; text-decoration: none;">_open_link</a>` : ''}
            </div>
          </div>
        `;
        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(`win-${id}`);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        const closeBtn = newWin.querySelector('.window-close');
        closeBtn.addEventListener('click', () => {
            newWin.remove();
        });
    });
});
const navItems = document.querySelectorAll('.nav-item');
document.addEventListener('mousemove', (e) => {
    navItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - itemX, e.clientY - itemY);

        if (dist < 80) {
            const dx = (itemX - e.clientX) * 0.3;
            const dy = (itemY - e.clientY) * 0.3;
            item.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 10 - 5}deg)`;
            item.style.color = "blue";
            item.style.background = "yellow";
        } else {
            item.style.transform = '';
            item.style.color = "";
            item.style.background = "";
        }
    });
});
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const id = item.id;

        if (id === 'nav-concept') {
            e.preventDefault();
            spawnIframeWindow(item.innerText, item.getAttribute('href'));
            return;
        }

        e.preventDefault();

        if (document.getElementById(`win-${id}`)) {
            const existingWin = document.getElementById(`win-${id}`);
            topZIndex++;
            existingWin.style.zIndex = topZIndex;
            return;
        }

        let title, content;
        if (id === 'nav-about') {
            title = 'about.txt';
            content = `
              <p style="margin-top:0;"><strong>Portfolio & Praxis</strong></p>
              <p><strong>Einleitung & Fokus</strong></p>
              <p>Ich arbeite an der Schnittstelle von Gestaltung, Forschung und digitaler Praxis. Mein Fokus liegt auf neuen Technologien in unterschiedlichen Ausprägungen und Anwendungsebenen — auf KI, Interfaces, visuellen Systemen und experimentellen Formaten, in denen technologische Umbrüche nicht nur angewendet, sondern formal und inhaltlich sichtbar werden. Technik setze ich dabei nur so ein, wie sie im jeweiligen Zusammenhang notwendig ist — und vermittle sie entsprechend.</p>
              <p><strong>Portfolio als Arbeitsraum</strong></p>
              <p>Dieses Portfolio ist bewusst keine einheitlich durchgestaltete Oberfläche, sondern ein Arbeitsraum. Es versammelt Projekte, Archive, Tool-Experimente und KI-basierte Untersuchungen, die parallel entstehen und miteinander in Beziehung stehen. Die Struktur folgt keiner Marke, sondern einer Praxis.</p>
              <p>Die Seite ist Work in Progress. Nicht alles funktioniert zu jedem Zeitpunkt — Dinge brechen, werden repariert, umgebaut, verbessert. Das ist kein Versehen, sondern Teil des Zustands, den diese Seite zeigt.</p>
              <p><strong>Unterschiedliche visuelle Sprachen</strong></p>
              <p>Die Webseite hat bewusst keine einheitliche Gestaltung. Sie ist Ausdruck der Vielfalt der Möglichkeiten — unterschiedlicher Werkzeuge, Kontexte und Herangehensweisen. Projekte wie „Gravity is Optional" arbeiten mit anderen räumlichen, narrativen und ästhetischen Setzungen als die Index-Seite oder das KI Image Archive. Gestaltung wird hier nicht vereinheitlicht, sondern jeweils aus dem Gegenstand und dem Kontext heraus entwickelt. Die Heterogenität ist keine Schwäche des Systems, sondern seine Aussage.</p>
              <p><strong>Startseite & User Unfriendliness</strong></p>
              <p>Die Startseite folgt bewusst keiner klassischen Logik von Übersichtlichkeit oder unmittelbarer Zugänglichkeit. Sie arbeitet mit Momenten von Irritation und gezielter Unzugänglichkeit. Diese Form der User Unfriendliness ist als gestalterisches Mittel eingesetzt und verweist auf Positionen wie Yehwan Song, in deren Arbeiten Interfaces nicht primär der Effizienz dienen, sondern als Raum für Reibung und Reflexion erfahrbar werden.</p>
              <p><strong>Netzkunst-Referenzen</strong></p>
              <p>Gleichzeitig bezieht sich die Struktur auf Strategien der Netzkunst, wie sie seit den 1990er Jahren entwickelt wurden — etwa im Kontext von Olia Lialina oder Jodi. Navigation wird hier nicht als neutrale Funktion verstanden, sondern als Teil der gestalterischen Aussage. Brüche, Umwege und unerwartete Übergänge sind bewusst gesetzt und fordern eine aktive Auseinandersetzung mit dem Interface.</p>
              <p><strong>Tool Gallery & Nutzerinteraktion</strong></p>
              <p>Ein weiterer Bestandteil ist die Tool Gallery, die die Webseite selbst als gestaltbares System begreift. Sie zeigt KI nicht nur als Werkzeug zur Bild- oder Textproduktion, sondern als Interface, das in die Struktur und Erscheinung der Seite eingreift. Nutzer können Parameter verändern, visuelle Entscheidungen beeinflussen und damit das Erscheinungsbild der Seite aktiv mitbestimmen. Gestaltung entsteht so nicht mehr ausschließlich vorab, sondern im Moment der Nutzung.</p>
              <p><strong>Dynamische Oberfläche</strong></p>
              <p>Die Webseite fungiert damit nicht als statisches Portfolio, sondern als dynamische Oberfläche, die unterschiedliche Zustände annehmen kann. Sie macht sichtbar, wie sich gestalterische Kontrolle verschiebt, wenn Systeme, Modelle und Interfaces in den Entwurfsprozess eingebunden werden.</p>
              <p><strong>Automatisierte Kommunikation</strong></p>
              <p>Ein weiterer Aspekt ist die Darstellung automatisierter Kommunikation über RSS-Feeds und Discord-Integrationen — in zwei Modi. Im ersten erfolgt die Veröffentlichung vollständig automatisiert, Auswahl und Frequenz werden an externe Quellen ausgelagert. Im zweiten basiert die Veröffentlichung auf kuratierter Auswahl, die anschließend über IFTTT automatisiert archiviert und publiziert wird. Beide Ansätze stehen nebeneinander und machen unterschiedliche Grade von Kontrolle sichtbar. Das hat eine weitere Konsequenz: Die Webseite bleibt aktiv, auch wenn ich in Lehre, Forschung oder Projekten stecke — oder einfach Freizeit habe. Das Archiv füllt sich, der Denkraum wächst, und auf der Startseite entstehen kontinuierlich neue Einträge. Die Seite wartet nicht auf manuelle Pflege, sondern läuft als paralleler Prozess.</p>
              <p><strong>Arbeitsweise: explorativ & systematisch</strong></p>
              <p>Meine Arbeitsweise ist explorativ und zugleich systematisch. Für meine Bachelorarbeit habe ich über 3.000 digitale Tools auf ihre gestalterische Einsetzbarkeit untersucht. Dieses Wissen nutze ich, um neue Werkzeuge schnell einzuordnen, produktive Workflows zu entwickeln und Systeme gezielt miteinander zu verbinden.</p>
              <p><strong>Eigene Tools & Setups</strong></p>
              <p>Ich arbeite mit eigenen Setups, entwickle Tools und kombiniere bestehende Anwendungen zu funktionierenden Prozessen. Dazu gehören automatisierte Workflows, generative Bildsysteme sowie experimentelle Interfaces. Ansätze wie Vibe Coding und Vibe Design nutze ich, um Ideen direkt in Prototypen zu überführen und Gestaltung im Prozess zu entscheiden.</p>
              <p><strong>Prompting & LLMs</strong></p>
              <p>Ein zentraler Bestandteil meiner Praxis ist Prompting und die Arbeit mit Large Language Models. Ich entwickle Prompt-Systeme, iterative Feedback-Prozesse zwischen Mensch und Modell und übersetze gestalterische Konzepte in Sprache. Wie diese Arbeit in die Lehre übergeht, ist unter /lehre beschrieben.</p>
              <p><strong>Agentische Systeme & KI-Workflows</strong></p>
              <p>Mein Fokus auf KI umfasst auch agentische Systeme, multimodale Modelle, automatisierte Entscheidungsprozesse sowie die Entwicklung KI-gestützter Workflows. Ich arbeite mit API-Anbindungen, vernetzten Tools und hybriden Setups, in denen Gestaltung, Code und Modelllogiken ineinandergreifen. KI wird dabei nicht isoliert als Werkzeug verstanden, sondern als Bestandteil eines erweiterten gestalterischen Systems.</p>
              <p><strong>KI als verbindende Struktur</strong></p>
              <p>Während meiner Weiterbildung im Fullstack Development gab es Momente, in denen Technologien, Tools und Abhängigkeiten zunächst unverbunden nebeneinander standen. Mit der Arbeit an KI-basierten Systemen hat sich das verändert. KI wirkt als verbindende Struktur, die es ermöglicht, Ideen direkt umzusetzen, eigene Tools zu entwickeln und komplexe Prozesse zugänglich zu machen.</p>
              <p><strong>Schluss</strong></p>
              <p>Ein wesentlicher Teil dieser Praxis ist kollaborativ. Ich arbeite mit Studierenden, Lehrenden und Akteur·innen aus der Praxis zusammen — in gemeinsamen Projekten, Lehrformaten und Prozessen, in denen unterschiedliche Perspektiven und Wissensformen in Beziehung treten.</p>
              <p>Im Zentrum steht die Frage, wie Gestaltung auf KI-basierte Produktionslogiken reagieren kann, ohne in ästhetische Gleichförmigkeit, reine Tool-Demonstration oder unreflektierte Automatisierung zu kippen. Diese Fassung bleibt offen. Gestaltung verstehe ich als kritische Praxis, als gebaute Methode und als sichtbaren Denkprozess.</p>
            `;
        } else if (id === 'nav-contact') {
            title = 'contact_info';
            content = `
              <p style="margin-top:0;"><strong>CONTACT</strong></p>
              <p>Fuer Lehre, Vortraege, Projekte, Kollaborationen oder Rueckfragen zu den Arbeiten am besten per Mail.</p>
              <p>E-Mail<br><a href="mailto:clmai@me.com" style="color:blue;">clmai@me.com</a></p>
              <p>Diese Seite und die zugehoerigen Texte befinden sich aktuell in Ueberarbeitung. Wenn etwas noch unfertig wirkt, ist das wahrscheinlich Absicht oder Zwischenstand.</p>
            `;
        } else if (id === 'nav-archive') {
            title = '_ARCHIVE';
            content = `
              <p style="margin-top:0;"><strong>ARCHIVE STATUS</strong><br>INDEX IS PARTIALLY OPEN</p>
              <p>Der Archivbereich sammelt Referenzen, Fundstuecke, Prozessreste, Linkmaterial, Browserfunde und Arbeitskontexte, die nicht sauber in klassische Projektseiten passen.</p>
              <p>Aktuell ist dieser Bereich noch im Umbau. Die oeffentliche Kurzfassung liegt bereits separat vor:</p>
              <p><a href="linkarchiv.html" style="color:blue;">linkarchiv.html oeffnen</a></p>
              <p style="font-size:12px;">Geplant sind hier spaeter: Quellen, Notizen, verworfene Pfade, Zwischenstaende und Material, das die Projekte rahmt, aber nicht direkt als fertige Arbeit auftritt.</p>
            `;
        }

        const infoWindowConfig = {
            'nav-about': { width: 520, top: 88, left: 360 },
            'nav-contact': { width: 360, top: 140, left: 430 },
            'nav-archive': { width: 430, top: 180, left: 390 },
        };
        const config = infoWindowConfig[id] || { width: 430, top: 96, left: 360 };
        const maxLeft = Math.max(24, window.innerWidth - config.width - 320);
        const left = Math.min(config.left, maxLeft);
        const top = Math.min(config.top, Math.max(24, window.innerHeight - 340));
        const windowContentClass = id === 'nav-about' ? 'window-content about-window-content' : 'window-content';
        const windowContentStyle = id === 'nav-about'
            ? 'font-family: monospace; line-height:1.72;'
            : 'font-family: monospace; line-height:1.55;';
        const winHTML = `
          <div class="window" id="win-${id}" style="top:${top}px; left:${left}px; width:${config.width}px; max-height:72vh; background:#fff;">
            <div class="window-header">
              <span class="win-title">${title}</span>
              <button class="window-close">X</button>
            </div>
            <div class="${windowContentClass}" style="${windowContentStyle}">
              ${content}
            </div>
          </div>
        `;

        desktopSpace.insertAdjacentHTML('beforeend', winHTML);
        const newWin = document.getElementById(`win-${id}`);
        makeDraggable(newWin);
        topZIndex++;
        newWin.style.zIndex = topZIndex;
        attachCloseHandler(newWin);
    });
});

function spawnIframeWindow(title, url) {
    const id = "win-iframe-" + Date.now();
    const w = Math.min(840, window.innerWidth * 0.9);
    const h = Math.min(700, window.innerHeight * 0.85);
    const pos = getRandomDesktopPosition(w, h, 20, 20);

    const winHTML = `
      <div class="window" id="${id}" style="top:${pos.top}px; left:${pos.left}px; width:${w}px; height:${h}px; background:#e5e5e5; display:flex; flex-direction:column; border:2px solid #000; box-shadow: 6px 6px 0 rgba(0,0,255,0.2);">
        <div class="window-header" style="background:#000; color:#fff; padding:8px 15px; display:flex; justify-content:space-between; align-items:center; font-family:monospace;">
          <span class="win-title">${title} // SYSTEM_MEMO</span>
          <button class="window-close" style="background:#ccff00; color:#000; border:none; width:24px; height:24px; font-weight:bold; cursor:pointer; font-size:14px;">X</button>
        </div>
        <div class="window-content" style="flex-grow:1; padding:0; overflow:hidden;">
          <iframe src="${url}" style="width:100%; height:100%; border:none;"></iframe>
        </div>
      </div>
    `;

    document.getElementById('desktop-space').insertAdjacentHTML('beforeend', winHTML);
    const newWin = document.getElementById(id);
    makeDraggable(newWin);
    topZIndex++;
    newWin.style.zIndex = topZIndex;
    attachCloseHandler(newWin);
}
async function loadArchiveSurface() {
    if (!rssRowContainer || !discordSidebarContainer) return;

    let rssFeed = [];
    let discordFeed = [];

    try {
        const data = await fetchJsonOrNull('/.netlify/functions/archive-feed');
        rssFeed = Array.isArray(data?.latest?.rss) && data.latest.rss.length ? data.latest.rss : [];
        discordFeed = Array.isArray(data?.latest?.discord) && data.latest.discord.length ? data.latest.discord : [];
    } catch (error) {
        rssFeed = fallbackRssFeed.map((item) => ({
            ...item,
            sourceLabel: item.source,
        }));
    }

    if (!rssFeed.length) {
        rssFeed = fallbackRssFeed.map((item) => ({
            ...item,
            sourceLabel: item.source,
        }));
    }

    if (!discordFeed.length) {
        try {
            const discordData = await fetchJsonOrNull('/.netlify/functions/discord-feed');
            if (Array.isArray(discordData.feed) && discordData.feed.length) {
                discordFeed = discordData.feed;
            }
        } catch (error) {
        }
    }

    if (!discordFeed.length) {
        discordFeed = fallbackDiscordFeed;
    }

    rssFeed.forEach((item) => {
        spawnRssCard(item);
    });

    discordFeed.forEach((msg, index) => {
        setTimeout(() => {
            spawnNewsTicker(msg);
        }, index * 500);
    });
}

function spawnRssCard(item) {
    const cardId = toSafeDomId('news-rss-', item.id || item.href || item.title, 'rss-item');
    if (!rssRowContainer || document.getElementById(cardId)) return;

    const safeTitle = escapeHtml(truncateText(item.title, 120));
    const safeSource = escapeHtml(item.sourceLabel || '#rss');
    const safeTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const winHTML = `
      <div class="window news-card" id="${cardId}">
        <div class="window-header" style="background: #0000ff; color: #fff; border-bottom: 2px solid #ccff00;">
          <span class="win-title">RSS TRACE</span>
          <button class="window-close" type="button" aria-label="Close RSS item">X</button>
        </div>
        <div class="window-content" style="padding: 10px; background: #f4f4f4; color: #050505; font-family: monospace; font-size: 12px; line-height: 1.45;">
           <i style="color: #4b4b4b;">${safeSource} / ${safeTime}</i><br><br>
           ${safeTitle}
           ${buildReadMoreLink(item.href, '[ OPEN FEED ]')}
        </div>
      </div>
    `;

    rssRowContainer.insertAdjacentHTML('beforeend', winHTML);
    attachCloseHandler(document.getElementById(cardId));
}

function spawnNewsTicker(msg) {
    const tickerId = toSafeDomId('news-discord-', msg.id || msg.timestamp || msg.author, 'discord-item');
    if (!discordSidebarContainer || document.getElementById(tickerId)) return;

    const rawContent = String(msg.content || '');
    const safeAuthor = escapeHtml(msg.author || 'discord');
    const urlMatch = rawContent.match(/(https?:\/\/[^\s]+)/);
    const linkSrc = urlMatch ? urlMatch[0] : null;

    let cleanText = rawContent.replace(/(https?:\/\/[^\s]+)/g, '').replace(/\n/g, ' ').trim();
    cleanText = escapeHtml(truncateText(cleanText, 160));

    let contentHtml = cleanText;
    if (linkSrc) {
        contentHtml += buildReadMoreLink(linkSrc);
    }

    const winHTML = `
      <div class="window news-ticker" id="${tickerId}">
        <div class="window-header" style="background: #ccff00; color: black; border-bottom: 2px solid black;">
          <span class="win-title">DISCORD TRACE</span>
          <button class="window-close" type="button" aria-label="Close Discord item">X</button>
        </div>
        <div class="window-content" style="padding: 10px; background: black; color: #ccff00; font-family: monospace; font-size: 13px; word-wrap: break-word; line-height: 1.4;">
           <i style="color: white;">${safeAuthor} / ${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</i><br><br>
           ${contentHtml}
        </div>
      </div>
    `;

    discordSidebarContainer.insertAdjacentHTML('beforeend', winHTML);
    attachCloseHandler(document.getElementById(tickerId));
}

async function fetchJsonOrNull(url) {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';

    if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`NON_JSON_RESPONSE:${res.status}`);
    }

    return res.json();
}

setTimeout(renderNewsSurface, 1200);
