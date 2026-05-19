import './swarm-gen.css';

const SHAPES = {
  tesseract: { name: 'Flat Tesseract', shortLabel: 'Tesseract' },
  sphere: { name: 'Sticker Sphere', shortLabel: 'Sphere' },
  helix: { name: 'Poster Helix', shortLabel: 'Helix' },
  torus: { name: 'Fake Torus', shortLabel: 'Torus' },
  mobius: { name: 'Ribbon Loop', shortLabel: 'Mobius' },
  storm: { name: 'Slop Storm', shortLabel: 'Storm' },
};

const countRange = document.getElementById('count-range');
const countValue = document.getElementById('count-value');
const shapeGrid = document.getElementById('shape-grid');
const paramControls = document.getElementById('param-controls');
const activeShapeLabel = document.getElementById('active-shape-label');
const liveStateLabel = document.getElementById('live-state-label');
const codeModal = document.getElementById('code-modal');
const codeOutput = document.getElementById('code-output');
const generateCodeBtn = document.getElementById('generate-code');
const downloadHtmlBtn = document.getElementById('download-html');
const captureFrameBtn = document.getElementById('capture-frame');
const toggleCodeBtn = document.getElementById('toggle-code');
const copyCodeBtn = document.getElementById('copy-code');
const copyCodeModalBtn = document.getElementById('copy-code-modal');
const closeCodeBtn = document.getElementById('close-code');
const canvasContainer = document.getElementById('swarm-canvas');

let shape = 'tesseract';
let count = 15000;
let params = {
  rotSpeed: 1,
  spread: 60,
  twist: 1,
  breathAmp: 0.8,
  bloom: 1.5,
  hue: 0.5,
};
let particles = [];
let generatedCodeCache = '';
let animationId = null;

const paramConfig = {
  rotSpeed: { min: 0, max: 4, step: 0.01 },
  spread: { min: 10, max: 100, step: 0.01 },
  twist: { min: 0, max: 4, step: 0.01 },
  breathAmp: { min: 0, max: 1, step: 0.01 },
  bloom: { min: 0, max: 5, step: 0.01 },
  hue: { min: 0, max: 1, step: 0.01 },
};

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvasContainer.appendChild(canvas);

function formatLabel(value) {
  return value.replace(/([A-Z])/g, ' $1').trim();
}

function updateActiveShapeLabel() {
  activeShapeLabel.textContent = SHAPES[shape].name;
}

function shapePoint(index, total, time) {
  const ratio = index / Math.max(total - 1, 1);
  const t = time * 0.001 * params.rotSpeed;
  const spread = params.spread * 3.6;
  const twist = params.twist;
  const breath = 1 + Math.sin(t + index * 0.01) * 0.08 * params.breathAmp;

  if (shape === 'sphere') {
    const angle = ratio * Math.PI * 2 * 34 + t;
    const radius = Math.sqrt(ratio) * spread * 0.95 * breath;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  if (shape === 'helix') {
    const angle = ratio * Math.PI * 18 * twist + t;
    return {
      x: Math.cos(angle) * spread * 0.42,
      y: (ratio - 0.5) * spread * 1.8,
    };
  }

  if (shape === 'torus') {
    const a = ratio * Math.PI * 2;
    const b = (index % 160) / 160 * Math.PI * 2 * twist + t;
    const radius = spread * 0.62 + Math.cos(b) * spread * 0.18;
    return {
      x: Math.cos(a + t * 0.3) * radius,
      y: Math.sin(a + t * 0.3) * radius * 0.64 + Math.sin(b) * spread * 0.18,
    };
  }

  if (shape === 'mobius') {
    const a = ratio * Math.PI * 2;
    const ribbon = Math.sin(index * 0.17 + t) * spread * 0.18;
    return {
      x: Math.cos(a) * (spread * 0.72 + ribbon),
      y: Math.sin(a * 2 + t) * spread * 0.28 + Math.sin(a) * spread * 0.42,
    };
  }

  if (shape === 'storm') {
    const angle = ratio * Math.PI * 42 * twist + t * 1.8;
    const radius = ratio * spread * (0.4 + params.breathAmp);
    const chaos = Math.sin(index * 0.31 + t * 2) * spread * 0.12;
    return {
      x: Math.cos(angle) * radius + chaos,
      y: Math.sin(angle * 0.8) * radius * 0.72 - chaos,
    };
  }

  const side = Math.ceil(Math.sqrt(total));
  const x = (index % side) / side - 0.5;
  const y = Math.floor(index / side) / side - 0.5;
  const wobble = Math.sin((x + y) * 10 * twist + t) * 14 * params.breathAmp;
  return {
    x: x * spread * 1.45 + wobble,
    y: y * spread * 1.45 - wobble * 0.5,
  };
}

function resize() {
  const rect = canvasContainer.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function buildParticles() {
  const visibleCount = Math.min(count, window.innerWidth < 700 ? 3600 : 9000);
  particles = Array.from({ length: visibleCount }, (_, index) => ({
    index,
    size: 0.7 + Math.random() * 2.1,
    jitter: Math.random() * Math.PI * 2,
  }));
}

function render(time = 0) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width * 0.56;
  const cy = height * 0.5;
  const hue = params.hue * 360;

  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.8);
  bg.addColorStop(0, `hsla(${hue}, 100%, 56%, 0.26)`);
  bg.addColorStop(0.42, 'rgba(39, 215, 255, 0.08)');
  bg.addColorStop(1, 'rgba(5, 5, 5, 1)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = '#ffffff';
  for (let x = 0; x < width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin(time * 0.0004 + x) * 22, height);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.shadowBlur = 10 + params.bloom * 8;
  particles.forEach((particle) => {
    const point = shapePoint(particle.index, particles.length, time);
    const pulse = Math.sin(time * 0.002 + particle.jitter) * params.breathAmp;
    const x = cx + point.x + Math.cos(particle.jitter + time * 0.001) * pulse * 7;
    const y = cy + point.y + Math.sin(particle.jitter + time * 0.001) * pulse * 7;
    const localHue = (hue + particle.index * 0.08) % 360;
    ctx.fillStyle = `hsla(${localHue}, 100%, 68%, 0.72)`;
    ctx.shadowColor = `hsl(${localHue}, 100%, 62%)`;
    ctx.beginPath();
    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  animationId = requestAnimationFrame(render);
}

function renderShapeButtons() {
  shapeGrid.innerHTML = Object.entries(SHAPES)
    .map(([key, item]) => `
      <button class="shape-btn ${key === shape ? 'is-active' : ''}" type="button" data-shape="${key}">
        <span>${item.shortLabel}</span>
      </button>
    `)
    .join('');

  shapeGrid.querySelectorAll('[data-shape]').forEach((button) => {
    button.addEventListener('click', () => {
      shape = button.dataset.shape;
      updateActiveShapeLabel();
      renderShapeButtons();
      liveStateLabel.textContent = `${SHAPES[shape].shortLabel} flattened`;
    });
  });
}

function renderParamControls() {
  paramControls.innerHTML = Object.entries(paramConfig)
    .map(([key, config]) => `
      <div class="range-control">
        <div class="range-control__meta">
          <span>${formatLabel(key)}</span>
          <strong id="${key}-value">${params[key].toFixed(2)}</strong>
        </div>
        <input id="${key}-range" type="range" min="${config.min}" max="${config.max}" step="${config.step}" value="${params[key]}">
      </div>
    `)
    .join('');

  Object.keys(paramConfig).forEach((key) => {
    const input = document.getElementById(`${key}-range`);
    const output = document.getElementById(`${key}-value`);
    input.addEventListener('input', () => {
      params[key] = Number(input.value);
      output.textContent = params[key].toFixed(2);
    });
  });
}

function updateCount() {
  count = Number(countRange.value);
  countValue.textContent = count.toLocaleString('en-US');
  buildParticles();
}

function makeStandaloneHtml() {
  const safeParams = JSON.stringify(params);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Flat Swarm Export</title>
<style>
html,body{margin:0;height:100%;background:#050505;overflow:hidden}
canvas{display:block;width:100%;height:100%}
</style>
</head>
<body>
<canvas></canvas>
<script>
const shape=${JSON.stringify(shape)};
const params=${safeParams};
const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');
let particles=[];
function resize(){const r=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*r;canvas.height=innerHeight*r;ctx.setTransform(r,0,0,r,0,0);particles=Array.from({length:5000},(_,i)=>({i,s:.8+Math.random()*2,j:Math.random()*6.28}))}
function point(i,total,time){const ratio=i/Math.max(total-1,1);const t=time*.001*params.rotSpeed;const spread=params.spread*3.4;if(shape==='sphere'){const a=ratio*Math.PI*68+t;const r=Math.sqrt(ratio)*spread;return{x:Math.cos(a)*r,y:Math.sin(a)*r}}if(shape==='helix'){const a=ratio*Math.PI*18*params.twist+t;return{x:Math.cos(a)*spread*.42,y:(ratio-.5)*spread*1.8}}if(shape==='torus'){const a=ratio*Math.PI*2;const b=(i%160)/160*Math.PI*2*params.twist+t;const r=spread*.62+Math.cos(b)*spread*.18;return{x:Math.cos(a+t*.3)*r,y:Math.sin(a+t*.3)*r*.64+Math.sin(b)*spread*.18}}if(shape==='mobius'){const a=ratio*Math.PI*2;const ribbon=Math.sin(i*.17+t)*spread*.18;return{x:Math.cos(a)*(spread*.72+ribbon),y:Math.sin(a*2+t)*spread*.28+Math.sin(a)*spread*.42}}if(shape==='storm'){const a=ratio*Math.PI*42*params.twist+t*1.8;const r=ratio*spread*(.4+params.breathAmp);const c=Math.sin(i*.31+t*2)*spread*.12;return{x:Math.cos(a)*r+c,y:Math.sin(a*.8)*r*.72-c}}const side=Math.ceil(Math.sqrt(total));const x=i%side/side-.5;const y=Math.floor(i/side)/side-.5;const w=Math.sin((x+y)*10*params.twist+t)*14*params.breathAmp;return{x:x*spread*1.45+w,y:y*spread*1.45-w*.5}}
function draw(time=0){ctx.clearRect(0,0,innerWidth,innerHeight);const hue=params.hue*360;const g=ctx.createRadialGradient(innerWidth*.56,innerHeight*.5,0,innerWidth*.56,innerHeight*.5,Math.max(innerWidth,innerHeight)*.8);g.addColorStop(0,'hsla('+hue+',100%,56%,.28)');g.addColorStop(1,'#050505');ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight);ctx.shadowBlur=10+params.bloom*8;particles.forEach(p=>{const q=point(p.i,particles.length,time);const h=(hue+p.i*.08)%360;ctx.fillStyle='hsla('+h+',100%,68%,.72)';ctx.shadowColor='hsl('+h+',100%,62%)';ctx.beginPath();ctx.arc(innerWidth*.56+q.x,innerHeight*.5+q.y,p.s,0,Math.PI*2);ctx.fill()});requestAnimationFrame(draw)}
addEventListener('resize',resize);resize();draw();
</script>
</body>
</html>`;
}

function refreshCode() {
  generatedCodeCache = makeStandaloneHtml();
  codeOutput.textContent = generatedCodeCache;
  liveStateLabel.textContent = 'Code generated';
}

async function copyCode() {
  if (!generatedCodeCache) refreshCode();
  try {
    await navigator.clipboard.writeText(generatedCodeCache);
    liveStateLabel.textContent = 'Code copied';
  } catch {
    liveStateLabel.textContent = 'Copy unavailable';
  }
}

function downloadHtml() {
  if (!generatedCodeCache) refreshCode();
  const blob = new Blob([generatedCodeCache], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `flat-swarm-${shape}.html`;
  link.click();
  URL.revokeObjectURL(url);
  liveStateLabel.textContent = 'HTML downloaded';
}

function captureFrame() {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `flat-swarm-${shape}.png`;
  link.click();
  liveStateLabel.textContent = 'PNG rendered';
}

countRange.addEventListener('input', updateCount);
generateCodeBtn.addEventListener('click', refreshCode);
downloadHtmlBtn.addEventListener('click', downloadHtml);
captureFrameBtn.addEventListener('click', captureFrame);
toggleCodeBtn.addEventListener('click', () => {
  if (!generatedCodeCache) refreshCode();
  codeModal.hidden = false;
});
copyCodeBtn.addEventListener('click', copyCode);
copyCodeModalBtn.addEventListener('click', copyCode);
closeCodeBtn.addEventListener('click', () => {
  codeModal.hidden = true;
});

window.addEventListener('resize', resize);

renderShapeButtons();
renderParamControls();
updateActiveShapeLabel();
updateCount();
resize();
if (animationId) cancelAnimationFrame(animationId);
render();
