import './swarm-gen.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const divide = (a, b) => a / b;

const SHAPE_LOGIC = {
  tesseract: {
    name: '4D Tesseract',
    shortLabel: 'Tesseract',
    math: (i, count, time, params) => {
      const { rotSpeed, spread, twist, breathAmp } = params;
      const nSide = Math.floor(Math.pow(count, 0.25)) || 1;
      const t = time * rotSpeed;
      const breathing = 1 + Math.sin(time * 0.8) * 0.25 * breathAmp;

      let idx = i;
      const wIdx = idx % nSide;
      idx = Math.floor(divide(idx - wIdx, nSide));
      const zIdx = idx % nSide;
      idx = Math.floor(divide(idx - zIdx, nSide));
      const yIdx = idx % nSide;
      const xIdx = Math.floor(divide(idx - yIdx, nSide));

      const half = (nSide - 1) * 0.5;
      const x4 = divide(xIdx - half, nSide);
      const y4 = divide(yIdx - half, nSide);
      const z4 = divide(zIdx - half, nSide);
      const w4 = divide(wIdx - half, nSide);

      const angle1 = t + twist * w4;
      const x4r = x4 * Math.cos(angle1) - w4 * Math.sin(angle1);
      const w4r = x4 * Math.sin(angle1) + w4 * Math.cos(angle1);
      const depth = divide(1, 1 + Math.abs(w4r) * 1.5);
      const s = spread * breathing * depth;

      return new THREE.Vector3(x4r * s, y4 * s, z4 * s);
    }
  },
  sphere: {
    name: 'Golden Sphere',
    shortLabel: 'Sphere',
    math: (i, count, time, params) => {
      const { rotSpeed, spread, breathAmp } = params;
      const phi = Math.acos(-1 + divide(2 * i, count));
      const theta = Math.sqrt(count * Math.PI) * phi;
      const t = time * rotSpeed;
      const r = spread * (1 + Math.sin(t + i * 0.01) * 0.1 * breathAmp);

      return new THREE.Vector3(
        r * Math.cos(theta + t) * Math.sin(phi),
        r * Math.sin(theta + t) * Math.sin(phi),
        r * Math.cos(phi)
      );
    }
  },
  helix: {
    name: 'Double Helix',
    shortLabel: 'Helix',
    math: (i, count, time, params) => {
      const { rotSpeed, spread, twist, breathAmp } = params;
      const t = time * rotSpeed;
      const ratio = divide(i, count);
      const angle = ratio * Math.PI * 20 * twist + t;
      const r = spread * 0.4 * (1 + Math.sin(t * 2 + ratio * 10) * 0.1 * breathAmp);
      const y = (ratio - 0.5) * spread * 2;
      const side = i % 2 === 0 ? 1 : -1;

      return new THREE.Vector3(
        Math.cos(angle) * r * side,
        y,
        Math.sin(angle) * r * side
      );
    }
  },
  torus: {
    name: 'Cosmic Torus',
    shortLabel: 'Torus',
    math: (i, count, time, params) => {
      const { rotSpeed, spread, twist, breathAmp } = params;
      const t = time * rotSpeed;
      const u = divide(i, count) * Math.PI * 2;
      const v = divide(i % 100, 100) * Math.PI * 2 * twist;
      const R = spread * 0.8;
      const r = spread * 0.3 * (1 + Math.sin(t + u * 5) * 0.2 * breathAmp);

      return new THREE.Vector3(
        (R + r * Math.cos(v + t)) * Math.cos(u),
        (R + r * Math.cos(v + t)) * Math.sin(u),
        r * Math.sin(v + t)
      );
    }
  },
  mobius: {
    name: 'Mobius Strip',
    shortLabel: 'Mobius',
    math: (i, count, time, params) => {
      const { rotSpeed, spread } = params;
      const t = time * rotSpeed;
      const u = divide(i, count) * Math.PI * 2;
      const v = Math.sin(i * 0.5) * 0.5 * spread * 0.4;
      const r = spread * 0.7;

      return new THREE.Vector3(
        (r + v * Math.cos(divide(u, 2) + t)) * Math.cos(u),
        (r + v * Math.cos(divide(u, 2) + t)) * Math.sin(u),
        v * Math.sin(divide(u, 2) + t)
      );
    }
  },
  storm: {
    name: 'Hyper Storm',
    shortLabel: 'Storm',
    math: (i, count, time, params) => {
      const { rotSpeed, spread, twist, breathAmp } = params;
      const t = time * rotSpeed;
      const angle = divide(i, count) * Math.PI * 2 + t;
      const r = spread * (0.5 + Math.sin(t * 0.5 + i * 0.001) * 0.5);
      const chaos = Math.sin(i * 0.1 + t) * 10 * breathAmp;

      return new THREE.Vector3(
        Math.cos(angle * twist) * r + chaos,
        Math.sin(angle) * Math.cos(t) * r,
        Math.sin(angle * twist) * r + chaos
      );
    }
  }
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
  rotSpeed: 1.0,
  spread: 60,
  twist: 1.0,
  breathAmp: 0.8,
  bloom: 1.5,
  hue: 0.5
};

const paramConfig = {
  rotSpeed: { min: 0, max: 4, step: 0.01 },
  spread: { min: 10, max: 100, step: 0.01 },
  twist: { min: 0, max: 4, step: 0.01 },
  breathAmp: { min: 0, max: 1, step: 0.01 },
  bloom: { min: 0, max: 5, step: 0.01 },
  hue: { min: 0, max: 1, step: 0.01 }
};

let runtime = null;
let generatedCodeCache = '';

function formatLabel(value) {
  return value.replace(/([A-Z])/g, ' $1').trim();
}

function updateActiveShapeLabel() {
  activeShapeLabel.textContent = SHAPE_LOGIC[shape].name;
}

function updateLiveStateLabel(message = 'Preview active') {
  liveStateLabel.textContent = message;
}

function renderShapeButtons() {
  shapeGrid.innerHTML = Object.entries(SHAPE_LOGIC)
    .map(
      ([key, config]) => `
        <button class="shape-btn${shape === key ? ' is-active' : ''}" type="button" data-shape="${key}" aria-pressed="${shape === key}">
          <span>${config.shortLabel}</span>
        </button>
      `
    )
    .join('');
}

function renderParamControls() {
  paramControls.innerHTML = Object.entries(params)
    .map(([key, value]) => {
      const config = paramConfig[key];
      return `
        <label class="range-control">
          <div class="range-control__meta">
            <span>${formatLabel(key)}</span>
            <strong id="value-${key}">${value.toFixed(2)}</strong>
          </div>
          <input
            type="range"
            data-param="${key}"
            min="${config.min}"
            max="${config.max}"
            step="${config.step}"
            value="${value}"
          >
        </label>
      `;
    })
    .join('');
}

function updateCountLabel() {
  countValue.textContent = count.toLocaleString('en-US');
}

function getGeneratedCode() {
  const currentShape = SHAPE_LOGIC[shape];
  const sOpen = '<script>';
  const sClose = '</' + 'script>';
  let mathStr = String(currentShape.math);
  mathStr = mathStr.split('params').join('PARAMS').split('count').join('COUNT');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swarm Export - ${currentShape.name}</title>
  <style>
    body { margin: 0; overflow: hidden; background: #050505; }
  </style>
  ${sOpen}
    window.addEventListener('error', (e) => {
      console.error('Swarm Runtime Error:', e.message);
    });
  ${sClose}
  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.183.2/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.183.2/examples/jsm/"
      }
    }
  ${sClose}
</head>
<body>
  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

    const COUNT = ${count};
    const PARAMS = ${JSON.stringify(params)};
    const divide = (a, b) => a / b;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      PARAMS.bloom,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    const instancedMesh = new THREE.InstancedMesh(
      new THREE.TetrahedronGeometry(0.3),
      new THREE.MeshBasicMaterial(),
      COUNT
    );
    scene.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const positions = Array.from({ length: COUNT }, () => new THREE.Vector3());
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      for (let i = 0; i < COUNT; i++) {
        const pos = (${mathStr})(i, COUNT, time, PARAMS);
        positions[i].lerp(pos, 0.1);
        dummy.position.copy(positions[i]);
        dummy.rotation.x = time * 0.2 + i * 0.001;
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        color.setHSL((PARAMS.hue + divide(i, COUNT) * 0.2 + Math.sin(time * 0.2) * 0.1) % 1, 0.8, 0.6);
        instancedMesh.setColorAt(i, color);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
      controls.update();
      composer.render();
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    });
  ${sClose}
</body>
</html>`;
}

function generateCodeSnapshot() {
  generatedCodeCache = getGeneratedCode();
  codeOutput.textContent = generatedCodeCache;
  updateLiveStateLabel('Code generated');
}

function downloadGeneratedHtml() {
  if (!generatedCodeCache) {
    generateCodeSnapshot();
  }

  const fileName = `swarm_${shape}.html`;
  const blob = new Blob([generatedCodeCache], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  updateLiveStateLabel(`Downloaded ${fileName}`);
}

function captureFrame() {
  if (!runtime?.renderer || !runtime?.composer) return;

  runtime.composer.render();
  const dataUrl = runtime.renderer.domElement.toDataURL('image/png');
  const fileName = `swarm_render_${shape}_${Date.now()}.png`;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  updateLiveStateLabel(`Captured ${fileName}`);
}

async function copyGeneratedCode() {
  if (!generatedCodeCache) {
    generateCodeSnapshot();
  }

  await navigator.clipboard.writeText(generatedCodeCache);
  const previous = copyCodeBtn.textContent;
  copyCodeBtn.textContent = 'Copied';
  copyCodeBtn.classList.add('swarm-btn--success');
  if (copyCodeModalBtn) {
    copyCodeModalBtn.textContent = 'Copied';
  }
  window.setTimeout(() => {
    copyCodeBtn.textContent = previous === 'Copied' ? 'Copy Code' : previous;
    copyCodeBtn.classList.remove('swarm-btn--success');
    if (copyCodeModalBtn) {
      copyCodeModalBtn.textContent = 'Copy All';
    }
  }, 1600);
}

function disposeRuntime(currentRuntime) {
  if (!currentRuntime) return;

  cancelAnimationFrame(currentRuntime.frameId);
  window.removeEventListener('resize', currentRuntime.onResize);
  currentRuntime.controls.dispose();
  currentRuntime.composer.dispose();
  currentRuntime.instancedMesh.geometry.dispose();
  currentRuntime.instancedMesh.material.dispose();
  currentRuntime.renderer.dispose();

  if (currentRuntime.renderer.domElement.parentNode) {
    currentRuntime.renderer.domElement.parentNode.removeChild(currentRuntime.renderer.domElement);
  }
}

function createRuntime() {
  disposeRuntime(runtime);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  const camera = new THREE.PerspectiveCamera(60, divide(width, height), 1, 2000);
  camera.position.set(0, 0, 150);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), params.bloom, 0.4, 0.85);
  composer.addPass(bloomPass);

  const geometry = new THREE.TetrahedronGeometry(0.3);
  const material = new THREE.MeshBasicMaterial();
  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
  scene.add(instancedMesh);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const positions = Array.from({ length: count }, () => new THREE.Vector3());
  const clock = new THREE.Clock();

  const localRuntime = {
    renderer,
    composer,
    controls,
    instancedMesh,
    frameId: 0,
    onResize: () => {
      camera.aspect = divide(window.innerWidth, window.innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    }
  };

  function animate() {
    localRuntime.frameId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    const currentShape = SHAPE_LOGIC[shape];
    bloomPass.strength = params.bloom;

    for (let i = 0; i < count; i += 1) {
      const target = currentShape.math(i, count, time, params);
      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.rotation.x = time * 0.2 + i * 0.001;
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      const hueValue = (params.hue + divide(i, count) * 0.2 + Math.sin(time * 0.2) * 0.1) % 1;
      color.setHSL(hueValue, 0.8, 0.6);
      instancedMesh.setColorAt(i, color);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }

    controls.update();
    composer.render();
  }

  window.addEventListener('resize', localRuntime.onResize);
  animate();
  runtime = localRuntime;
}

function rerenderScene() {
  updateCountLabel();
  updateActiveShapeLabel();
  renderShapeButtons();
  renderParamControls();
  createRuntime();
  updateLiveStateLabel('Preview active');
}

shapeGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-shape]');
  if (!button) return;
  shape = button.dataset.shape;
  rerenderScene();
});

paramControls.addEventListener('input', (event) => {
  const input = event.target.closest('[data-param]');
  if (!input) return;
  const key = input.dataset.param;
  params[key] = Number.parseFloat(input.value);
  const output = document.getElementById(`value-${key}`);
  if (output) output.textContent = params[key].toFixed(2);
  updateLiveStateLabel('Preview updated');
});

countRange.addEventListener('input', (event) => {
  count = Number.parseInt(event.target.value, 10);
  updateCountLabel();
  updateLiveStateLabel('Particle count changed');
});

countRange.addEventListener('change', () => {
  createRuntime();
});

generateCodeBtn.addEventListener('click', () => {
  generateCodeSnapshot();
});

downloadHtmlBtn.addEventListener('click', () => {
  downloadGeneratedHtml();
});

captureFrameBtn.addEventListener('click', () => {
  captureFrame();
});

toggleCodeBtn.addEventListener('click', () => {
  if (!generatedCodeCache) {
    generateCodeSnapshot();
  }
  codeModal.hidden = false;
});

closeCodeBtn.addEventListener('click', () => {
  codeModal.hidden = true;
});

codeModal.addEventListener('click', (event) => {
  if (event.target === codeModal) {
    codeModal.hidden = true;
  }
});

copyCodeBtn.addEventListener('click', () => {
  copyGeneratedCode().catch(() => {});
});

copyCodeModalBtn.addEventListener('click', () => {
  copyGeneratedCode().catch(() => {});
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !codeModal.hidden) {
    codeModal.hidden = true;
  }
});

rerenderScene();

window.addEventListener('beforeunload', () => {
  disposeRuntime(runtime);
});
