const projects = [
  {
    title: "Social Media Generator",
    kind: "tool",
    filter: "tools",
    score: "viral 92",
    accent: "rgba(56, 248, 255, 0.62)",
    hotX: "76%",
    imagePosition: "52% 42%",
    text: "A publishing machine for formats, variants, and layout pressure. Now with legally unnecessary sparkle metrics.",
    detail: "Generated a post system with 14 fake engagement graphs and one useful export button."
  },
  {
    title: "Slop-O-Matic",
    kind: "machine",
    filter: "tools",
    score: "aura 100",
    accent: "rgba(255, 61, 242, 0.62)",
    hotX: "22%",
    imagePosition: "38% 50%",
    text: "The original sludge engine. Turns interface cliches into interactive matter with alarming confidence.",
    detail: "Slop-O-Matic reached peak gloss and requested a second funding round from itself."
  },
  {
    title: "Slop Gallery",
    kind: "poster dump",
    filter: "space",
    score: "depth 0",
    accent: "rgba(185, 255, 69, 0.62)",
    hotX: "68%",
    imagePosition: "66% 38%",
    text: "A flattened gallery for glossy panels, fake metrics, spatial language, and suspiciously poetic navigation.",
    detail: "Slop Gallery removed the expensive parts, kept the neon confidence, and called it curation."
  },
  {
    title: "Journal Archive",
    kind: "archive",
    filter: "archive",
    score: "memory 76",
    accent: "rgba(255, 138, 61, 0.62)",
    hotX: "44%",
    imagePosition: "48% 66%",
    text: "A living index for notes, blog textures, references, and the many tabs that become research.",
    detail: "Journal Archive sorted the chaos into a taxonomy called very nearly done."
  }
];

const logs = [
  "Inflating context window with artisanal vapor.",
  "Compressing meaningful work into a chrome rectangle.",
  "Re-ranking projects by glow density and suspicious confidence.",
  "Adding one more glass panel because the market demands transparency.",
  "Checking if the word agentic improves the layout. It does not, but it glows.",
  "Replacing strategy with a progress bar shaped like ambition."
];

const moods = [
  "Confidently decorative",
  "Premium-ish",
  "Model-adjacent",
  "Soft launched inside a prism",
  "Unreasonably optimized",
  "A/B testing the void"
];

const grid = document.querySelector("[data-project-grid]");
const template = document.querySelector("#project-card-template");
const consoleLog = document.querySelector("[data-console-log]");
const consoleStatus = document.querySelector("[data-console-status]");
const slopRange = document.querySelector("[data-slop-range]");
const slopLabel = document.querySelector("[data-slop-label]");
const auraScore = document.querySelector("[data-aura-score]");
const contactStatus = document.querySelector("[data-contact-status]");
const randomizeButton = document.querySelector("[data-randomize]");
const generateButton = document.querySelector("[data-generate]");
const copyButton = document.querySelector("[data-copy-contact]");
const canvas = document.querySelector("#slop-field");
const ctx = canvas.getContext("2d");

let activeFilter = "all";
let activeMode = "Aura";
let particles = [];

function renderProjects() {
  grid.innerHTML = "";
  const visible = activeFilter === "all"
    ? projects
    : projects.filter((project) => project.filter === activeFilter);

  visible.forEach((project, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.style.setProperty("--accent", project.accent);
    card.style.setProperty("--hot-x", project.hotX);
    card.style.setProperty("--image-pos", project.imagePosition);
    card.style.setProperty("--card-image", `url("assets/slop-hero.png")`);
    card.querySelector(".project-kind").textContent = project.kind;
    card.querySelector(".project-score").textContent = project.score;
    card.querySelector("h3").textContent = project.title;
    card.querySelector("p").textContent = project.text;
    card.querySelector(".card-link").addEventListener("click", () => {
      addLog(project.detail);
      card.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-8px) scale(1.018)" },
          { transform: "translateY(0) scale(1)" }
        ],
        { duration: 420 + index * 30, easing: "cubic-bezier(.2,.9,.2,1)" }
      );
    });
    grid.append(card);
  });
}

function addLog(message) {
  const item = document.createElement("li");
  item.textContent = message;
  consoleLog.prepend(item);
  while (consoleLog.children.length > 5) {
    consoleLog.lastElementChild.remove();
  }
  consoleStatus.textContent = activeMode.toLowerCase();
}

function setSlop(value) {
  document.documentElement.style.setProperty("--slop-energy", value);
  slopLabel.textContent = value;
  auraScore.textContent = `${Math.min(99.9, Number(value) + 24.3).toFixed(1)}%`;
}

function randomLog() {
  const message = logs[Math.floor(Math.random() * logs.length)];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  document.querySelector(".model-card-top strong").textContent = mood;
  addLog(message);
}

function copyContact() {
  const email = "clmai@me.com";
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email).then(() => {
      contactStatus.textContent = "Contact copied. Funnel respectfully avoided.";
    }).catch(() => {
      contactStatus.textContent = email;
    });
  } else {
    contactStatus.textContent = email;
  }
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
    hue: [184, 304, 81, 26][Math.floor(Math.random() * 4)]
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

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    renderProjects();
    addLog(`Filter switched to ${activeFilter}. Repackaging taste as evidence.`);
  });
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    activeMode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((modeButton) => {
      modeButton.classList.toggle("is-active", modeButton === button);
    });
    addLog(`${activeMode} mode activated. The interface nodded knowingly.`);
  });
});

slopRange.addEventListener("input", (event) => {
  setSlop(event.target.value);
});

randomizeButton.addEventListener("click", randomLog);

generateButton.addEventListener("click", () => {
  const project = projects[Math.floor(Math.random() * projects.length)];
  addLog(`Generated focus: ${project.title}. ${project.detail}`);
  document.querySelector("#work").scrollIntoView({ behavior: "smooth", block: "start" });
});

copyButton.addEventListener("click", copyContact);

window.addEventListener("resize", resizeCanvas);

renderProjects();
setSlop(slopRange.value);
resizeCanvas();
drawParticles();
