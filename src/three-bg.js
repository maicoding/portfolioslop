import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

class ParticlesSwarm {
    constructor(scene, count = 9000, options = {}) {
        this.scene = scene;
        this.count = count;
        this.speedMult = 1;
        this.mode = options.mode || 'sphere';
        this.group = new THREE.Group();
        this.group.position.copy(options.position || new THREE.Vector3(0, 0.2, -4.8));
        this.group.rotation.copy(options.rotation || new THREE.Euler(-0.2, 0.35, 0));

        this.dummy = new THREE.Object3D();
        this.target = new THREE.Vector3();
        this.pColor = new THREE.Color();
        this.positions = [];
        this.clock = new THREE.Clock();
        this.baseColor = new THREE.Color(options.color ?? (this.mode === 'torus' ? 0xff0055 : 0x00ff88));
        this.radius = options.radius ?? (this.mode === 'torus' ? 25 : 30);
        this.tubeRadius = options.tubeRadius ?? 8;
        this.turnMultiplier = options.turnMultiplier ?? (this.mode === 'torus' ? 40 : 1);

        this.geometry = new THREE.TetrahedronGeometry(0.12, 0);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            vertexColors: true
        });

        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        for (let i = 0; i < this.count; i++) {
            this.positions.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100
                )
            );
            this.mesh.setColorAt(i, this.baseColor);
        }

        this.group.add(this.mesh);
        this.scene.add(this.group);
    }

    update(mouseX = 0, mouseY = 0) {
        const time = this.clock.getElapsedTime() * this.speedMult;
        const turn = time * (this.mode === 'torus' ? 0.11 : 0.08);
        const wobbleX = mouseX * (this.mode === 'torus' ? 1.8 : 2.6);
        const wobbleY = mouseY * (this.mode === 'torus' ? 1.6 : 2.2);

        this.group.rotation.y += this.mode === 'torus' ? 0.0024 : 0.0012;
        this.group.rotation.x += ((this.mode === 'torus' ? -0.1 : -0.2) + mouseY * 0.16 - this.group.rotation.x) * 0.03;

        for (let i = 0; i < this.count; i++) {
            this.setTarget(i, time, turn, wobbleX, wobbleY);

            this.positions[i].lerp(this.target, 0.07);
            this.dummy.position.copy(this.positions[i]);

            const scale = 0.7 + Math.sin(time * 1.6 + i * 0.003) * 0.18;
            this.dummy.scale.setScalar(scale);
            this.dummy.rotation.set(
                this.positions[i].y * 0.02,
                this.positions[i].x * 0.02 + time * 0.25,
                this.positions[i].z * 0.01
            );
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);

            const depthRange = this.mode === 'torus' ? this.tubeRadius : this.radius;
            const colorPhase = (this.positions[i].z + depthRange) / (depthRange * 2);
            if (this.mode === 'torus') {
                this.pColor.setHSL(0.94 + colorPhase * 0.05, 1, 0.52 + colorPhase * 0.08);
            } else {
                this.pColor.setHSL(0.38 + colorPhase * 0.08, 1, 0.56 + colorPhase * 0.1);
            }
            this.mesh.setColorAt(i, this.pColor);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
        if (this.mesh.instanceColor) {
            this.mesh.instanceColor.needsUpdate = true;
        }
    }

    setTarget(i, time, turn, wobbleX, wobbleY) {
        if (this.mode === 'torus') {
            const u = (i / this.count) * Math.PI * 2 * this.turnMultiplier + turn * 10;
            const v = (i / this.count) * Math.PI * 2 + turn;
            const pulse = 1 + Math.sin(time * 1.4 + i * 0.002) * 0.06;

            this.target.set(
                (this.radius + this.tubeRadius * Math.cos(u)) * Math.cos(v) * pulse + wobbleX,
                (this.radius + this.tubeRadius * Math.cos(u)) * Math.sin(v) * pulse - wobbleY,
                this.tubeRadius * Math.sin(u) * pulse
            );
            return;
        }

        const phi = Math.acos(-1 + (2 * i) / this.count);
        const theta = Math.sqrt(this.count * Math.PI) * phi + turn;
        const pulse = 1 + Math.sin(time * 1.1 + i * 0.0025) * 0.08;

        this.target.set(
            this.radius * pulse * Math.cos(theta) * Math.sin(phi) + wobbleX,
            this.radius * pulse * Math.sin(theta) * Math.sin(phi) - wobbleY,
            this.radius * pulse * Math.cos(phi)
        );
    }

    dispose() {
        this.scene.remove(this.group);
        this.geometry.dispose();
        this.material.dispose();
    }
}

const backgroundModelModules = import.meta.glob([
    './assets/models/*.{glb,gltf}',
    '!./assets/models/glaus.glb',
    '!./assets/models/horse1.glb',
    '!./assets/models/tortenundso.glb',
    './assets/models/optimized/*.{glb,gltf}'
], {
    eager: false,
    query: '?url',
    import: 'default'
});

async function getBackgroundModelUrls() {
    const urls = [];
    for (const [path, loadFn] of Object.entries(backgroundModelModules)) {
        const filename = path.split('/').pop();
        if (!path.includes('/optimized/') && Object.keys(backgroundModelModules).some(p => p.includes(`/optimized/${filename}`))) {
            continue;
        }
        urls.push(await loadFn());
    }
    return urls;
}

const FLOAT_BOUNDS = {
    x: 18,
    y: 11,
    z: 6
};

const MODEL_STAGE_DEPTH = {
    near: -1.6,
    far: 1.6
};

const MODEL_STAGE_SLOTS = [
    new THREE.Vector3(-8.6, -3.1, 0.9),
    new THREE.Vector3(-5.8, 3.5, -0.4),
    new THREE.Vector3(-1.6, -4.3, 1.0),
    new THREE.Vector3(1.8, 4.1, -0.9),
    new THREE.Vector3(5.9, -3.0, 0.3),
    new THREE.Vector3(8.5, 2.8, -0.7)
];

const CENTER_VOID_RADIUS = 5.2;
const MIN_VISIBLE_MODELS = 3;
const MAX_VISIBLE_MODELS = 5;
const DEFAULT_SKIPPED_MODEL_KEYS = ['performetim', 'pinkso', 'glass2', 'horse'];

const MODEL_PROFILES = {
    duck: {
        scaleMin: 1.02,
        scaleMax: 1.34,
        tiltY: 0.58,
        driftX: [0.0012, 0.0017],
        driftY: [0.001, 0.0014],
        orbitX: [0.24, 0.42],
        orbitY: [0.16, 0.3],
        displaySpinY: [0.00055, 0.0009]
    },
    glaskugel: {
        scaleMin: 0.92,
        scaleMax: 1.22,
        tiltY: 0.22,
        driftX: [0.0007, 0.001],
        driftY: [0.0006, 0.00085],
        orbitX: [0.14, 0.26],
        orbitY: [0.1, 0.2],
        displaySpinY: [0.00018, 0.00034]
    },
    lollypop1: {
        scaleMin: 0.5,
        scaleMax: 0.82,
        tiltY: 0.36,
        driftX: [0.00095, 0.0013],
        driftY: [0.0008, 0.0012],
        orbitX: [0.2, 0.34],
        orbitY: [0.16, 0.26],
        displaySpinY: [0.00024, 0.00046]
    },
    loppo: {
        scaleMin: 0.92,
        scaleMax: 1.24,
        tiltY: 0.48,
        driftX: [0.0009, 0.0013],
        driftY: [0.0008, 0.0011],
        orbitX: [0.18, 0.32],
        orbitY: [0.14, 0.24],
        displaySpinY: [0.0003, 0.00052]
    },
    puttyyy: {
        scaleMin: 0.84,
        scaleMax: 1.12,
        tiltY: 0.24,
        driftX: [0.0006, 0.00095],
        driftY: [0.00055, 0.0008],
        orbitX: [0.14, 0.24],
        orbitY: [0.08, 0.18],
        displaySpinY: [0.00016, 0.0003]
    },
    yellowho: {
        scaleMin: 0.8,
        scaleMax: 1.08,
        tiltY: 0.42,
        driftX: [0.001, 0.00135],
        driftY: [0.00085, 0.00115],
        orbitX: [0.2, 0.34],
        orbitY: [0.12, 0.24],
        displaySpinY: [0.00028, 0.0005]
    },
    a_glass: {
        scaleMin: 1.06,
        scaleMax: 1.34,
        tiltY: 0.18,
        driftX: [0.00055, 0.00085],
        driftY: [0.00045, 0.00075],
        orbitX: [0.12, 0.22],
        orbitY: [0.08, 0.16],
        displaySpinY: [0.00012, 0.00024],
        stageOffsetY: 1.4,
        stageOffsetZ: 0.45,
        spreadMultiplier: 0.72
    },
    glass: {
        scaleMin: 1.04,
        scaleMax: 1.32,
        tiltY: 0.2,
        driftX: [0.00055, 0.00088],
        driftY: [0.00045, 0.00076],
        orbitX: [0.12, 0.22],
        orbitY: [0.08, 0.16],
        displaySpinY: [0.00012, 0.00024],
        stageOffsetY: 1.1,
        stageOffsetZ: 0.3,
        spreadMultiplier: 0.76
    },
    glasspaint1: {
        scaleMin: 0.94,
        scaleMax: 1.18,
        tiltY: 0.26,
        driftX: [0.0005, 0.0008],
        driftY: [0.00042, 0.00068],
        orbitX: [0.1, 0.18],
        orbitY: [0.08, 0.14],
        displaySpinY: [0.0001, 0.0002],
        stageOffsetY: 0.8,
        stageOffsetZ: 0.18,
        spreadMultiplier: 0.74
    },
    animated_organic_blob: {
        scaleMin: 1.08,
        scaleMax: 1.42,
        tiltY: 0.28,
        driftX: [0.00085, 0.00115],
        driftY: [0.0007, 0.00095],
        orbitX: [0.18, 0.28],
        orbitY: [0.16, 0.26],
        displaySpinY: [0.00016, 0.0003],
        stageOffsetY: -0.4,
        spreadMultiplier: 0.82
    },
    big_tears: {
        scaleMin: 1.04,
        scaleMax: 1.28,
        tiltY: 0.24,
        driftX: [0.0008, 0.0011],
        driftY: [0.00105, 0.00135],
        orbitX: [0.12, 0.22],
        orbitY: [0.2, 0.34],
        displaySpinY: [0.00014, 0.00026],
        stageOffsetY: -1.1,
        spreadMultiplier: 0.76
    },
    black_tears: {
        scaleMin: 0.96,
        scaleMax: 1.18,
        tiltY: 0.2,
        driftX: [0.00072, 0.00098],
        driftY: [0.00095, 0.00124],
        orbitX: [0.1, 0.18],
        orbitY: [0.18, 0.3],
        displaySpinY: [0.0001, 0.00022],
        stageOffsetY: -1.3,
        stageOffsetZ: -0.2,
        spreadMultiplier: 0.74
    },
    blacktearorange: {
        scaleMin: 1.08,
        scaleMax: 1.34,
        tiltY: 0.26,
        driftX: [0.0008, 0.00108],
        driftY: [0.001, 0.00128],
        orbitX: [0.12, 0.22],
        orbitY: [0.2, 0.34],
        displaySpinY: [0.00014, 0.00026],
        stageOffsetY: -0.9,
        stageOffsetZ: 0.16,
        spreadMultiplier: 0.72
    },
    pink_baby_whale: {
        scaleMin: 1.1,
        scaleMax: 1.44,
        tiltY: 0.52,
        driftX: [0.00125, 0.00165],
        driftY: [0.0007, 0.001],
        orbitX: [0.26, 0.44],
        orbitY: [0.14, 0.22],
        displaySpinY: [0.00034, 0.00058],
        stageOffsetY: 0.9,
        stageOffsetZ: 0.25,
        spreadMultiplier: 0.88
    },
    pinkso: {
        scaleMin: 1.06,
        scaleMax: 1.36,
        tiltY: 0.46,
        driftX: [0.00088, 0.00118],
        driftY: [0.0007, 0.00102],
        orbitX: [0.22, 0.34],
        orbitY: [0.14, 0.24],
        displaySpinY: [0.00022, 0.00042],
        stageOffsetY: 0.55,
        stageOffsetZ: 0.18,
        spreadMultiplier: 0.86
    },
    network_model: {
        scaleMin: 0.7,
        scaleMax: 0.92,
        tiltY: 0.62,
        driftX: [0.00135, 0.0017],
        driftY: [0.001, 0.00135],
        orbitX: [0.22, 0.38],
        orbitY: [0.16, 0.28],
        displaySpinY: [0.00046, 0.00078],
        stageOffsetZ: -0.45,
        spreadMultiplier: 1.08
    },
    performetim: {
        scaleMin: 0.92,
        scaleMax: 1.18,
        tiltY: 0.38,
        driftX: [0.0008, 0.00108],
        driftY: [0.0007, 0.00096],
        orbitX: [0.16, 0.28],
        orbitY: [0.12, 0.22],
        displaySpinY: [0.00018, 0.00034],
        stageOffsetY: -0.2,
        stageOffsetZ: -0.1,
        spreadMultiplier: 0.84
    },
    torte1: {
        scaleMin: 0.98,
        scaleMax: 1.28,
        tiltY: 0.3,
        driftX: [0.00062, 0.00092],
        driftY: [0.00048, 0.00074],
        orbitX: [0.12, 0.2],
        orbitY: [0.08, 0.15],
        displaySpinY: [0.00012, 0.00022],
        stageOffsetY: -0.2,
        stageOffsetZ: 0.32,
        spreadMultiplier: 0.78
    }
};

function randomInRange(min, max) {
    return min + Math.random() * (max - min);
}

function shuffleArray(values) {
    const next = [...values];

    for (let i = next.length - 1; i > 0; i -= 1) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        [next[i], next[swapIndex]] = [next[swapIndex], next[i]];
    }

    return next;
}

function getModelKey(modelUrl) {
    return modelUrl.split('/').pop().split('.').slice(0, -1).join('.').toLowerCase();
}

function getModelProfile(modelUrl) {
    const key = getModelKey(modelUrl);
    const matchedProfile =
        MODEL_PROFILES[key] ||
        Object.entries(MODEL_PROFILES).find(([profileKey]) => key.includes(profileKey))?.[1];

    return matchedProfile || {
        scaleMin: 0.94,
        scaleMax: 1.18,
        tiltY: 0.34,
        driftX: [0.00085, 0.0012],
        driftY: [0.0007, 0.001],
        orbitX: [0.16, 0.28],
        orbitY: [0.12, 0.22],
        displaySpinY: [0.0002, 0.00042],
        stageOffsetY: 0,
        stageOffsetZ: 0,
        spreadMultiplier: 1
    };
}

function getEligibleModelUrls(modelUrls) {
    return modelUrls.filter((modelUrl) => {
        const key = getModelKey(modelUrl);
        return !DEFAULT_SKIPPED_MODEL_KEYS.some((blockedKey) => key.includes(blockedKey));
    });
}

function pickVisibleModelUrls(modelUrls) {
    const eligibleModelUrls = shuffleArray(getEligibleModelUrls(modelUrls));
    const pool = eligibleModelUrls.length ? eligibleModelUrls : shuffleArray(modelUrls);
    const targetCount = Math.min(pool.length, Math.floor(randomInRange(MIN_VISIBLE_MODELS, MAX_VISIBLE_MODELS + 1)));

    return pool.slice(0, Math.max(1, targetCount));
}

function buildModelScaleBands(count) {
    const bands = [];
    const hugeCount = 1;
    const heroCount = Math.max(1, Math.round(count * 0.2));
    const largeCount = Math.max(1, Math.round(count * 0.28));
    const smallCount = Math.max(1, count - hugeCount - heroCount - largeCount);

    for (let i = 0; i < hugeCount; i += 1) bands.push(1.68);
    for (let i = 0; i < heroCount; i += 1) bands.push(1.22);
    for (let i = 0; i < largeCount; i += 1) bands.push(1.02);
    for (let i = 0; i < smallCount; i += 1) bands.push(0.82);

    return shuffleArray(bands).slice(0, count);
}

function getRandomPrimitivePosition() {
    let position = new THREE.Vector3();
    let attempts = 0;

    do {
        position = new THREE.Vector3(
            randomInRange(-FLOAT_BOUNDS.x, FLOAT_BOUNDS.x),
            randomInRange(-FLOAT_BOUNDS.y, FLOAT_BOUNDS.y),
            randomInRange(-FLOAT_BOUNDS.z, FLOAT_BOUNDS.z - 2)
        );
        attempts += 1;
    } while (position.length() < CENTER_VOID_RADIUS && attempts < 18);

    return position;
}

function getModelStagePosition(stageSlots, index, profile) {
    const slot = stageSlots[index % stageSlots.length];
    const cycle = Math.floor(index / MODEL_STAGE_SLOTS.length);
    const spread = (0.4 + cycle * 0.14) * (profile.spreadMultiplier || 1);

    return new THREE.Vector3(
        slot.x + randomInRange(-spread, spread),
        slot.y + randomInRange(-spread, spread) + (profile.stageOffsetY || 0),
        slot.z + randomInRange(MODEL_STAGE_DEPTH.near * 0.16, MODEL_STAGE_DEPTH.far * 0.16) + (profile.stageOffsetZ || 0)
    );
}

function setPosition(object3D, position) {
    object3D.position.copy(position);
    return position;
}

function setRandomRotation(object3D) {
    object3D.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
}

function setModelPresentationRotation(object3D, profile) {
    object3D.rotation.set(
        randomInRange(-0.18, 0.18),
        randomInRange(-profile.tiltY, profile.tiltY),
        randomInRange(-0.12, 0.12)
    );
}

function setRandomScale(object3D, min = 0.6, max = 2.0) {
    const scale = min + Math.random() * (max - min);
    object3D.scale.setScalar(scale);
}

function multiplyRandomScale(object3D, min = 0.6, max = 2.0) {
    const scale = min + Math.random() * (max - min);
    object3D.scale.multiplyScalar(scale);
}

function getModelScaleMultiplier(profile) {
    return randomInRange(profile.scaleMin, profile.scaleMax);
}

function createDriftState(basePosition, depthFactor = 1, overrides = {}) {
    return {
        role: overrides.role || 'drifter',
        baseX: basePosition.x,
        baseY: basePosition.y,
        baseZ: basePosition.z,
        driftX: (Math.random() - 0.5) * (overrides.driftX ?? 0.0032) * depthFactor,
        driftY: (Math.random() - 0.5) * (overrides.driftY ?? 0.0026) * depthFactor,
        orbitX: randomInRange(overrides.orbitXMin ?? 0.22, overrides.orbitXMax ?? 0.95) * depthFactor,
        orbitY: randomInRange(overrides.orbitYMin ?? 0.16, overrides.orbitYMax ?? 0.72) * depthFactor,
        orbitZ: randomInRange(overrides.orbitZMin ?? 0.05, overrides.orbitZMax ?? 0.28),
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        speedX: randomInRange(overrides.speedXMin ?? 0.05, overrides.speedXMax ?? 0.16),
        speedY: randomInRange(overrides.speedYMin ?? 0.04, overrides.speedYMax ?? 0.12),
        speedZ: randomInRange(overrides.speedZMin ?? 0.03, overrides.speedZMax ?? 0.08),
        rx: (Math.random() - 0.5) * (overrides.rx ?? 0.00022),
        ry: (Math.random() - 0.5) * (overrides.ry ?? 0.00035),
        rz: (Math.random() - 0.5) * (overrides.rz ?? 0.00018),
        mouseInfluenceX: randomInRange(overrides.mouseInfluenceXMin ?? 0.05, overrides.mouseInfluenceXMax ?? 0.16),
        mouseInfluenceY: randomInRange(overrides.mouseInfluenceYMin ?? 0.04, overrides.mouseInfluenceYMax ?? 0.12),
        companionTarget: overrides.companionTarget || null,
        companionRadiusX: randomInRange(1.4, 3.1),
        companionRadiusY: randomInRange(0.8, 1.8),
        companionRadiusZ: randomInRange(0.12, 0.4),
        companionSpeed: randomInRange(0.12, 0.32),
        companionOffsetX: randomInRange(-1.9, 1.9),
        companionOffsetY: randomInRange(-1.6, 1.6),
        companionOffsetZ: randomInRange(-0.5, 0.5),
        displaySpinY: overrides.displaySpinY ?? 0
    };
}

function wrapValue(value, limit) {
    if (value > limit) return -limit;
    if (value < -limit) return limit;
    return value;
}

function applyDriftState(object3D, basePosition, overrides = {}) {
    const depthFactor = THREE.MathUtils.mapLinear(basePosition.z, -FLOAT_BOUNDS.z, FLOAT_BOUNDS.z - 2, 1.18, 0.74);
    object3D.userData = createDriftState(basePosition, depthFactor, overrides);
}

function animateDrifter(object3D, targetX, targetY, elapsed) {
    object3D.rotation.x += object3D.userData.rx;
    object3D.rotation.y += object3D.userData.ry;
    object3D.rotation.z += object3D.userData.rz;
    if (object3D.userData.displaySpinY) {
        object3D.rotation.y += object3D.userData.displaySpinY;
    }

    object3D.userData.baseX = wrapValue(object3D.userData.baseX + object3D.userData.driftX, FLOAT_BOUNDS.x + 2);
    object3D.userData.baseY = wrapValue(object3D.userData.baseY + object3D.userData.driftY, FLOAT_BOUNDS.y + 1.5);

    const orbitX = Math.sin(elapsed * object3D.userData.speedX + object3D.userData.phaseX) * object3D.userData.orbitX;
    const orbitY = Math.cos(elapsed * object3D.userData.speedY + object3D.userData.phaseY) * object3D.userData.orbitY;
    const orbitZ = Math.sin(elapsed * object3D.userData.speedZ + object3D.userData.phaseZ) * object3D.userData.orbitZ;

    object3D.position.x = object3D.userData.baseX + orbitX + targetX * object3D.userData.mouseInfluenceX;
    object3D.position.y = object3D.userData.baseY + orbitY - targetY * object3D.userData.mouseInfluenceY;
    object3D.position.z = object3D.userData.baseZ + orbitZ;
}

function animateCompanion(object3D, targetX, targetY, elapsed) {
    const target = object3D.userData.companionTarget;
    if (!target) {
        animateDrifter(object3D, targetX, targetY, elapsed);
        return;
    }

    object3D.rotation.x += object3D.userData.rx * 1.2;
    object3D.rotation.y += object3D.userData.ry * 1.4;
    object3D.rotation.z += object3D.userData.rz * 1.1;

    const anchor = target.position;
    const angle = elapsed * object3D.userData.companionSpeed + object3D.userData.phaseX;
    const desiredX =
        anchor.x +
        object3D.userData.companionOffsetX +
        Math.cos(angle) * object3D.userData.companionRadiusX +
        targetX * 0.04;
    const desiredY =
        anchor.y +
        object3D.userData.companionOffsetY +
        Math.sin(angle) * object3D.userData.companionRadiusY -
        targetY * 0.035;
    const desiredZ =
        anchor.z +
        object3D.userData.companionOffsetZ +
        Math.sin(angle * 0.6 + object3D.userData.phaseZ) * object3D.userData.companionRadiusZ;

    object3D.position.x += (desiredX - object3D.position.x) * 0.035;
    object3D.position.y += (desiredY - object3D.position.y) * 0.035;
    object3D.position.z += (desiredZ - object3D.position.z) * 0.035;
}

const materialCache = new Map();
const animatedMaterials = [];

function addBreathingShader(material) {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
        `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
            // Organic Omma-style breathing/squishing displacement
            float theta = sin(uTime * 2.5 + position.y * 3.0 + position.x * 2.0) * 0.12;
            transformed += normal * theta;
            `
        );
        material.userData.shader = shader;
    };
    if (!animatedMaterials.includes(material)) {
        animatedMaterials.push(material);
    }
}

function tuneImportedMaterial(material) {
    if (!material) return material;
    if (materialCache.has(material.uuid)) return materialCache.get(material.uuid);

    const next = material.clone();
    if ('envMapIntensity' in next) next.envMapIntensity = 1.25;
    
    if ('roughness' in next && typeof next.roughness === 'number') next.roughness = Math.min(next.roughness, 0.72);
    if ('metalness' in next && typeof next.metalness === 'number') next.metalness = Math.min(next.metalness, 0.45);
    if ('emissive' in next && next.emissive?.setHex) next.emissive.setHex(0x05070a);
    if ('emissiveIntensity' in next) next.emissiveIntensity = 0.22;
    next.needsUpdate = true;
    
    materialCache.set(material.uuid, next);
    return next;
}

function createPrimitiveMaterials() {
    return [
        new THREE.MeshPhysicalMaterial({
            color: 0x12f7ff,
            emissive: 0x0b4f5e,
            emissiveIntensity: 0.7,
            metalness: 0.96,
            roughness: 0.12,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            iridescence: 0.3,
            iridescenceIOR: 1.18,
            iridescenceThicknessRange: [90, 220]
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xff4fd8,
            emissive: 0x6f123f,
            emissiveIntensity: 0.62,
            metalness: 0.9,
            roughness: 0.16,
            clearcoat: 1.0,
            clearcoatRoughness: 0.06,
            iridescence: 0.36,
            iridescenceIOR: 1.2,
            iridescenceThicknessRange: [120, 260]
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xa8ff3e,
            emissive: 0x224d13,
            emissiveIntensity: 0.58,
            metalness: 0.86,
            roughness: 0.18,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 1.0,
            roughness: 0.22,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            iridescence: 0.95,
            iridescenceIOR: 1.34,
            iridescenceThicknessRange: [180, 520],
            sheen: 1.0,
            sheenColor: new THREE.Color(0xffffff),
            specularIntensity: 1.0
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0x0e1119,
            emissive: 0x1b1f2d,
            emissiveIntensity: 0.28,
            metalness: 0.92,
            roughness: 0.16,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xff9c2a,
            emissive: 0x5f2d08,
            emissiveIntensity: 0.5,
            metalness: 0.82,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            iridescence: 0.22,
            iridescenceIOR: 1.17,
            iridescenceThicknessRange: [80, 200]
        }),
        new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff, metalness: 0.1, roughness: 0.2, 
            clearcoat: 1.0, clearcoatRoughness: 0.1, transmission: 0.6
        }),
        new THREE.MeshPhysicalMaterial({ 
            color: 0xccff00, metalness: 0.2, roughness: 0.3,
            clearcoat: 1.0, clearcoatRoughness: 0.2 
        })
    ];
    
    mats.forEach(addBreathingShader);
    return mats;
}

function setPrimitiveScale(object3D) {
    const roll = Math.random();

    if (roll < 0.2) {
        setRandomScale(object3D, 0.16, 0.26);
        return;
    }

    if (roll < 0.72) {
        setRandomScale(object3D, 0.28, 0.58);
        return;
    }

    setRandomScale(object3D, 0.62, 1.08);
}

function assignPrimitiveCompanions(primitives, models) {
    if (!models.length) return;

    primitives.forEach((primitive, index) => {
        const target = models[index % models.length];
        const visualRadius = target.userData.visualRadius || 1.6;
        const angle = (index / Math.max(primitives.length, 1)) * Math.PI * 2 + randomInRange(-0.35, 0.35);
        const safeDistance = visualRadius + randomInRange(1.2, 2.2);

        primitive.userData.companionTarget = target;
        primitive.userData.companionRadiusX = safeDistance + randomInRange(0.4, 1.1);
        primitive.userData.companionRadiusY = safeDistance * randomInRange(0.45, 0.72);
        primitive.userData.companionRadiusZ = randomInRange(0.08, Math.max(0.18, visualRadius * 0.16));
        primitive.userData.companionOffsetX = Math.cos(angle) * safeDistance;
        primitive.userData.companionOffsetY = Math.sin(angle) * safeDistance * randomInRange(0.55, 0.88);
        primitive.userData.companionOffsetZ = randomInRange(-Math.max(0.22, visualRadius * 0.14), Math.max(0.22, visualRadius * 0.14));
        primitive.userData.companionSpeed = randomInRange(0.08, 0.18);
    });
}

export async function initThreeJS() {
    const resolvedBackgroundModelUrls = await getBackgroundModelUrls();
    
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.24;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.opacity = '0.56';

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.02).texture;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(0, 0, 15);

    const geometries = [
        new THREE.TorusKnotGeometry(1, 0.3, 256, 64),
        new THREE.TorusGeometry(1.2, 0.5, 64, 100),
        new THREE.SphereGeometry(1.2, 64, 64),
        new THREE.CylinderGeometry(0.8, 0.8, 2, 64),
        new THREE.IcosahedronGeometry(1.15, 1),
        new THREE.CapsuleGeometry(0.7, 1.4, 8, 16)
    ];

    const primitiveMaterials = createPrimitiveMaterials();
    const modelObjects = [];
    const primitiveObjects = [];
    const allObjects = [];
    const particleCount = window.innerWidth < 768 ? 4200 : 9000;
    const torusParticleCount = window.innerWidth < 768 ? 2400 : 5200;
    const particleSwarm = new ParticlesSwarm(scene, particleCount, {
        mode: 'sphere',
        position: new THREE.Vector3(0, 0.15, -7.2),
        rotation: new THREE.Euler(-0.18, 0.3, 0),
        color: 0x00ff88,
        radius: 30
    });
    const torusSwarm = new ParticlesSwarm(scene, torusParticleCount, {
        mode: 'torus',
        position: new THREE.Vector3(0.8, -0.4, -11.4),
        rotation: new THREE.Euler(0.82, 0.2, 0.24),
        color: 0xff0055,
        radius: 25,
        tubeRadius: 8,
        turnMultiplier: 40
    });
    const shuffledStageSlots = shuffleArray(MODEL_STAGE_SLOTS);
    const loader = new GLTFLoader();
    const chosenModelUrls = resolvedBackgroundModelUrls.length
        ? pickVisibleModelUrls(resolvedBackgroundModelUrls)
        : [];
    const scaleBands = buildModelScaleBands(chosenModelUrls.length);
    const primitiveCount = chosenModelUrls.length
        ? Math.max(chosenModelUrls.length + 1, 3)
        : 5;

    for (let i = 0; i < primitiveCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = primitiveMaterials[Math.floor(Math.random() * primitiveMaterials.length)];
        const mesh = new THREE.Mesh(geometry, material);

        const basePosition = setPosition(mesh, getRandomPrimitivePosition());
        setRandomRotation(mesh);
        setPrimitiveScale(mesh);
        applyDriftState(mesh, basePosition, {
            role: 'companion',
            orbitXMin: 0.08,
            orbitXMax: 0.34,
            orbitYMin: 0.06,
            orbitYMax: 0.26,
            orbitZMin: 0.02,
            orbitZMax: 0.1,
            speedXMin: 0.03,
            speedXMax: 0.1,
            speedYMin: 0.03,
            speedYMax: 0.1,
            speedZMin: 0.02,
            speedZMax: 0.06,
            rx: 0.00024,
            ry: 0.00036,
            rz: 0.00018,
            mouseInfluenceXMin: 0.01,
            mouseInfluenceXMax: 0.03,
            mouseInfluenceYMin: 0.01,
            mouseInfluenceYMax: 0.026
        });

        scene.add(mesh);
        primitiveObjects.push(mesh);
        allObjects.push(mesh);
    }

    if (chosenModelUrls.length) {
        chosenModelUrls.forEach((modelUrl, index) => {
            loader.load(modelUrl, (gltf) => {
                const profile = getModelProfile(modelUrl);
                const modelRoot = gltf.scene.clone(true);
                const modelWrapper = new THREE.Group();
                const box = new THREE.Box3().setFromObject(modelRoot);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxAxis = Math.max(size.x, size.y, size.z) || 1;

                modelRoot.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = false;
                        child.receiveShadow = false;
                        if (Array.isArray(child.material)) {
                            child.material = child.material.map(tuneImportedMaterial);
                        } else {
                            child.material = tuneImportedMaterial(child.material);
                        }
                    }
                });

                modelRoot.position.sub(center);
                modelRoot.scale.multiplyScalar(4.15 / maxAxis);
                modelRoot.scale.multiplyScalar(getModelScaleMultiplier(profile) * (scaleBands[index] || 1));
                modelWrapper.add(modelRoot);

                const scaledSphere = new THREE.Box3().setFromObject(modelRoot).getBoundingSphere(new THREE.Sphere());
                modelWrapper.userData.visualRadius = Math.max(scaledSphere.radius, 1.1);

                const basePosition = getModelStagePosition(shuffledStageSlots, index, profile);
                const scaleBand = scaleBands[index] || 1;
                if (scaleBand >= 1.7) {
                    basePosition.z += 0.85;
                    basePosition.y += randomInRange(-0.4, 0.6);
                }

                setPosition(modelWrapper, basePosition);
                setModelPresentationRotation(modelWrapper, profile);
                applyDriftState(modelWrapper, basePosition, {
                    role: 'model',
                    driftX: randomInRange(profile.driftX[0], profile.driftX[1]) * 0.38,
                    driftY: randomInRange(profile.driftY[0], profile.driftY[1]) * 0.38,
                    orbitXMin: profile.orbitX[0] * 0.5,
                    orbitXMax: profile.orbitX[1] * 0.58,
                    orbitYMin: profile.orbitY[0] * 0.5,
                    orbitYMax: profile.orbitY[1] * 0.58,
                    orbitZMin: 0.01,
                    orbitZMax: 0.045,
                    speedXMin: 0.015,
                    speedXMax: 0.035,
                    speedYMin: 0.015,
                    speedYMax: 0.034,
                    speedZMin: 0.012,
                    speedZMax: 0.025,
                    rx: 0.000018,
                    ry: 0.000032,
                    rz: 0.000016,
                    mouseInfluenceXMin: 0.004,
                    mouseInfluenceXMax: 0.012,
                    mouseInfluenceYMin: 0.004,
                    mouseInfluenceYMax: 0.012,
                    displaySpinY: randomInRange(profile.displaySpinY[0], profile.displaySpinY[1]) * 0.34
                });

                scene.add(modelWrapper);
                modelObjects.push(modelWrapper);
                allObjects.push(modelWrapper);
                assignPrimitiveCompanions(primitiveObjects, modelObjects);
            });
        });
    }

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f1118, 0.055);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.095);
    dirLight.position.set(5, 9, 5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x7ab8ff, 0.04);
    fillLight.position.set(-5, -1, -5);
    scene.add(fillLight);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // --- OMMA STYLE INTERACTIVE GRID ---
    const gridCountX = 43;
    const gridCountY = 29;
    const gridInstanceCount = gridCountX * gridCountY;
    const gridGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const gridMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xccff00, 
        metalness: 0.9, 
        roughness: 0.28,
        emissive: 0x101700,
        transparent: true,
        opacity: 0.42
    });
    const gridMesh = new THREE.InstancedMesh(gridGeometry, gridMaterial, gridInstanceCount);
    
    const dummy = new THREE.Object3D();
    const gridPositions = [];
    
    for (let i = 0; i < gridCountX; i++) {
        for (let j = 0; j < gridCountY; j++) {
            const x = (i - gridCountX / 2) * 0.62;
            const y = (j - gridCountY / 2) * 0.62;
            const z = -8; 
            gridPositions.push({ x, y, z, baseX: x, baseY: y, baseZ: z });
            
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            gridMesh.setMatrixAt(i * gridCountY + j, dummy.matrix);
        }
    }
    gridMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(gridMesh);

    let mouseSpeed = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Subtle camera parallax tied to mouse
    document.addEventListener('mousemove', (event) => {
        const rawMouseX = (event.clientX - window.innerWidth / 2) * 0.0026;
        const rawMouseY = (event.clientY - window.innerHeight / 2) * 0.0026;
        
        mouseSpeed += Math.sqrt((rawMouseX - prevMouseX)**2 + (rawMouseY - prevMouseY)**2) * 2.2;
        prevMouseX = rawMouseX;
        prevMouseY = rawMouseY;
        
        mouseX = rawMouseX;
        mouseY = rawMouseY;
    });

    // Mobile Gyroscope support for parallax
    window.addEventListener('deviceorientation', (event) => {
        if (event.gamma !== null && event.beta !== null) {
            mouseX = event.gamma * 0.005; 
            mouseY = (event.beta - 45) * 0.005; 
        }
    });

    // Post-Processing Setup
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.18, 0.96);
    bloomPass.threshold = 0.72;
    bloomPass.strength = 0.14;
    bloomPass.radius = 0.03;
    
    // Add some noise (FilmPass) to get the cinematic brutalist feel
    const filmPass = new FilmPass(0.1, false);

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(filmPass);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        targetX = mouseX * 1.15;
        targetY = mouseY * 1.15;

        camera.position.x += (targetX - camera.position.x) * 0.03;
        camera.position.y += (-targetY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        allObjects.forEach((object3D) => {
            if (object3D.userData.role === 'companion') {
                animateCompanion(object3D, targetX, targetY, elapsed);
            } else {
                animateDrifter(object3D, targetX, targetY, elapsed);
            }
            
            // Add mouse velocity chaos
            object3D.rotation.x += mouseSpeed * 0.006 * (object3D.position.x > 0 ? 1 : -1);
            object3D.rotation.y += mouseSpeed * 0.006 * (object3D.position.y > 0 ? 1 : -1);
            object3D.rotation.z += mouseSpeed * 0.003;
        });

        // Update breathing shaders
        animatedMaterials.forEach((mat) => {
            if (mat.userData && mat.userData.shader) {
                mat.userData.shader.uniforms.uTime.value = elapsed;
            }
        });

        // Decay mouse speed
        mouseSpeed *= 0.86;
        bloomPass.strength = 0.14 + (mouseSpeed * 0.06);

        // Fluid Grid Physics
        let idx = 0;
        const vecPointX = mouseX * 4.1;
        const vecPointY = -mouseY * 4.1; 

        for (let x = 0; x < gridCountX; x++) {
            for (let y = 0; y < gridCountY; y++) {
                const pos = gridPositions[idx];
                
                const dx = pos.baseX - vecPointX;
                const dy = pos.baseY - vecPointY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Repulsion field around mouse
                const repel = Math.max(0, 2.6 - dist);
                
                // Basic sine wave + mouse bulge
                const wave = Math.sin(elapsed * 1.4 + pos.baseX * 0.35 + pos.baseY * 0.35) * 0.15;
                const targetZ = pos.baseZ + wave + repel * 1.2;
                const scale = 1 + repel * 0.22;
                
                // Spring motion
                pos.z += (targetZ - pos.z) * 0.08;
                
                dummy.position.set(pos.baseX, pos.baseY, pos.z);
                dummy.scale.set(scale, scale, scale);
                // Aggressive rotation when repelled
                dummy.rotation.x = pos.z * 0.08;
                dummy.rotation.y = pos.z * 0.08;
                dummy.updateMatrix();
                
                gridMesh.setMatrixAt(idx, dummy.matrix);
                idx++;
            }
        }
        gridMesh.instanceMatrix.needsUpdate = true;
        particleSwarm.update(targetX, targetY);
        torusSwarm.update(targetX * 0.82, targetY * 0.82);

        composer.render();
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });
}
