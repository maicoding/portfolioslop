import p5 from 'p5';
import { Pane } from 'tweakpane';
import { createNoise2D } from 'simplex-noise';

const PRESET_SIZE_MIN = 25;
const PRESET_SIZE_MAX = 400;

const UI_RANGES = {
  moveLevel: { min: 1, max: 200 },
  moveRate: { min: 1, max: 10 },
  offsetLevel: { min: 1, max: 25 },
  offsetRate: { min: 1, max: 10 },
  rotationLevel: { min: 5, max: 180 },
  rotationRate: { min: 1, max: 10 },
  scaleLevel: { min: 1.1, max: 2 },
  scaleRate: { min: 1, max: 10 }
};

const ENGINE_MAPPING = {
  move: {
    level: { min: 0.01, max: 1 },
    rate: {
      const: { min: 0.4, max: 12 },
      noise: { min: 0.01, max: 0.25 }
    }
  },
  offset: {
    level: { min: 0.01, max: 0.25 },
    rate: {
      noise: { min: 0.01, max: 0.15 }
    }
  },
  rotation: {
    rate: {
      noise: { min: 0.01, max: 0.5 },
      geom: { min: 0.25, max: 5 }
    }
  },
  scale: {
    level: { min: 0.1, max: 1 },
    rate: {
      noise: { min: 0.002, max: 0.05 },
      geom: { min: 0.005, max: 0.05 }
    }
  }
};

const PARAMS = {
  preset: 'User Preset',

  background: '#000000',
  showSourceImage: true,
  backgroundOpacity: 0.15,

  maxForms: 50,
  maskType: 'rectangle',
  sizeW: 160,
  sizeH: 40,
  randomizeSize: true,
  mixSolidColors: true,
  frame: true,
  frameWidth: 2,
  frameColor: '#bcff3b',

  moveTypeX: 'sin',
  moveLevelX: 100,
  moveRateX: 2,
  moveTypeY: 'noise',
  moveLevelY: 100,
  moveRateY: 2.5,

  offsetTypeX: 'cos',
  offsetLevelX: 5,
  offsetRateX: 1.5,
  offsetTypeY: 'noise',
  offsetLevelY: 5,
  offsetRateY: 2,

  rotationType: 'none',
  rotationLevel: 45,
  rotationRate: 2,
  scaleType: 'noise',
  scaleLevel: 1.2,
  scaleRate: 1.5,

  exportLength: 10,

  clear: () => {
    forms = [];
  }
};

const presetOptions = {
  'User Preset': 'User Preset',
  'Mental Flow': 'Mental Flow',
  'Memory Fragments': 'Memory Fragments',
  'Square Snapper': 'Square Snapper',
  'Blending Droplets': 'Blending Droplets',
  'Continuous Scanning': 'Continuous Scanning',
  'Recursive Entropy': 'Recursive Entropy',
  'Flying Carpets': 'Flying Carpets',
  'Spinning Therapy': 'Spinning Therapy'
};

let forms = [];
let img;
let mainCanvas;
let scaleRatio = 1;
let imgX = 0;
let imgY = 0;
let isRecording = false;
let mediaRecorder;
let recordedChunks = [];

const mapRange = (value, inMin, inMax, outMin, outMax) => {
  if (inMax === inMin) return outMin;
  const progress = (value - inMin) / (inMax - inMin);
  return outMin + progress * (outMax - outMin);
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const randomDirection = () => (Math.random() < 0.5 ? -1 : 1);

const presetSizeToPixels = (value) =>
  Math.round(mapRange(value, 1, 100, PRESET_SIZE_MIN, PRESET_SIZE_MAX));

const applyPreset = (presetName, pane) => {
  switch (presetName) {
    case 'Mental Flow':
      Object.assign(PARAMS, {
        background: '#ffffff',
        backgroundOpacity: 0.03,
        maskType: 'ellipse',
        sizeW: presetSizeToPixels(12),
        sizeH: presetSizeToPixels(12),
        frame: false,
        frameWidth: 2,
        frameColor: '#ffffff7f',
        moveTypeX: 'const',
        moveLevelX: 10,
        moveRateX: 4.5,
        moveTypeY: 'noise',
        moveLevelY: 92,
        moveRateY: 1,
        offsetTypeX: 'cos',
        offsetLevelX: 6,
        offsetRateX: 1.5,
        offsetTypeY: 'noise',
        offsetLevelY: 25,
        offsetRateY: 1.5,
        rotationType: 'noise',
        rotationLevel: 45,
        rotationRate: 1,
        scaleType: 'none',
        scaleLevel: 1.1,
        scaleRate: 8.5
      });
      break;
    case 'Memory Fragments':
      Object.assign(PARAMS, {
        background: '#000000',
        backgroundOpacity: 0.12,
        maskType: 'rectangle',
        sizeW: presetSizeToPixels(16),
        sizeH: presetSizeToPixels(10),
        frame: true,
        frameWidth: 1,
        frameColor: '#ffffffaa',
        moveTypeX: 'none',
        moveLevelX: 53,
        moveRateX: 6.3,
        moveTypeY: 'none',
        moveLevelY: 86,
        moveRateY: 2.5,
        offsetTypeX: 'noise',
        offsetLevelX: 3,
        offsetRateX: 1.2,
        offsetTypeY: 'noise',
        offsetLevelY: 1,
        offsetRateY: 1,
        rotationType: 'none',
        rotationLevel: 175,
        rotationRate: 2,
        scaleType: 'noise',
        scaleLevel: 1.2,
        scaleRate: 1
      });
      break;
    case 'Square Snapper':
      Object.assign(PARAMS, {
        background: '#ffffff',
        backgroundOpacity: 0.08,
        maskType: 'rectangle',
        sizeW: presetSizeToPixels(8),
        sizeH: presetSizeToPixels(8),
        frame: false,
        frameWidth: 2,
        frameColor: '#ffffff7f',
        moveTypeX: 'noise',
        moveLevelX: 100,
        moveRateX: 1.5,
        moveTypeY: 'sin',
        moveLevelY: 50,
        moveRateY: 1,
        offsetTypeX: 'noise',
        offsetLevelX: 6,
        offsetRateX: 2,
        offsetTypeY: 'noise',
        offsetLevelY: 10,
        offsetRateY: 2,
        rotationType: 'noise',
        rotationLevel: 15,
        rotationRate: 3,
        scaleType: 'noise',
        scaleLevel: 1.43,
        scaleRate: 1.5
      });
      break;
    case 'Blending Droplets':
      Object.assign(PARAMS, {
        background: '#ffffff',
        backgroundOpacity: 0.03,
        maskType: 'ellipse',
        sizeW: presetSizeToPixels(9),
        sizeH: presetSizeToPixels(9),
        frame: false,
        frameWidth: 2,
        frameColor: '#ffffff7f',
        moveTypeX: 'noise',
        moveLevelX: 100,
        moveRateX: 4.9,
        moveTypeY: 'noise',
        moveLevelY: 100,
        moveRateY: 3.2,
        offsetTypeX: 'noise',
        offsetLevelX: 2,
        offsetRateX: 1,
        offsetTypeY: 'noise',
        offsetLevelY: 2,
        offsetRateY: 1,
        rotationType: 'noise',
        rotationLevel: 5,
        rotationRate: 1.5,
        scaleType: 'noise',
        scaleLevel: 1.75,
        scaleRate: 8.9
      });
      break;
    case 'Continuous Scanning':
      Object.assign(PARAMS, {
        background: '#ffffff',
        backgroundOpacity: 0.05,
        maskType: 'rectangle',
        sizeW: presetSizeToPixels(16.8),
        sizeH: presetSizeToPixels(6.98),
        frame: false,
        frameWidth: 2,
        frameColor: '#0000007f',
        moveTypeX: 'none',
        moveLevelX: 100,
        moveRateX: 2,
        moveTypeY: 'sin',
        moveLevelY: 100,
        moveRateY: 6,
        offsetTypeX: 'noise',
        offsetLevelX: 1,
        offsetRateX: 3,
        offsetTypeY: 'sin',
        offsetLevelY: 12,
        offsetRateY: 8,
        rotationType: 'none',
        rotationLevel: 45,
        rotationRate: 2,
        scaleType: 'none',
        scaleLevel: 1.2,
        scaleRate: 1.5
      });
      break;
    case 'Recursive Entropy':
      Object.assign(PARAMS, {
        background: '#ffffff',
        backgroundOpacity: 0.02,
        maskType: 'rectangle',
        sizeW: presetSizeToPixels(1),
        sizeH: presetSizeToPixels(17),
        frame: false,
        frameWidth: 2,
        frameColor: '#ffffff7f',
        moveTypeX: 'cos',
        moveLevelX: 50,
        moveRateX: 2.2,
        moveTypeY: 'none',
        moveLevelY: 100,
        moveRateY: 6.2,
        offsetTypeX: 'noise',
        offsetLevelX: 4,
        offsetRateX: 6.3,
        offsetTypeY: 'none',
        offsetLevelY: 4,
        offsetRateY: 1,
        rotationType: 'none',
        rotationLevel: 80,
        rotationRate: 2,
        scaleType: 'none',
        scaleLevel: 1.2,
        scaleRate: 1.5
      });
      break;
    case 'Flying Carpets':
      Object.assign(PARAMS, {
        background: '#ffffff',
        backgroundOpacity: 0.04,
        maskType: 'rectangle',
        sizeW: presetSizeToPixels(33),
        sizeH: presetSizeToPixels(1),
        frame: false,
        frameWidth: 2,
        frameColor: '#ffffff7f',
        moveTypeX: 'const',
        moveLevelX: 100,
        moveRateX: 1.2,
        moveTypeY: 'cos',
        moveLevelY: 100,
        moveRateY: 2,
        offsetTypeX: 'noise',
        offsetLevelX: 3,
        offsetRateX: 1.5,
        offsetTypeY: 'sin',
        offsetLevelY: 4,
        offsetRateY: 2,
        rotationType: 'noise',
        rotationLevel: 45,
        rotationRate: 3.2,
        scaleType: 'noise',
        scaleLevel: 1.5,
        scaleRate: 2.2
      });
      break;
    case 'Spinning Therapy':
      Object.assign(PARAMS, {
        background: '#ffffff',
        backgroundOpacity: 0.04,
        maskType: 'ellipse',
        sizeW: presetSizeToPixels(12.5),
        sizeH: presetSizeToPixels(12.5),
        frame: false,
        frameWidth: 2,
        frameColor: '#ffffff7f',
        moveTypeX: 'none',
        moveLevelX: 167,
        moveRateX: 6.4,
        moveTypeY: 'const',
        moveLevelY: 100,
        moveRateY: 3,
        offsetTypeX: 'cos',
        offsetLevelX: 8,
        offsetRateX: 1.5,
        offsetTypeY: 'sin',
        offsetLevelY: 2,
        offsetRateY: 1.5,
        rotationType: 'const',
        rotationLevel: 135,
        rotationRate: 2.5,
        scaleType: 'none',
        scaleLevel: 1.1,
        scaleRate: 1.6
      });
      break;
    default:
      break;
  }

  if (pane) pane.refresh();
};

const getRotatedPoint = (cx, cy, theta, x, y) => {
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  return {
    x: cx + x * cosTheta - y * sinTheta,
    y: cy + x * sinTheta + y * cosTheta
  };
};

class Form {
  constructor(x, y, px, py, id, q) {
    this.id = id;
    this.q = q;
    this.translate = { x, y };
    this.sample = { x: px, y: py };
    this.size = {
      w: PARAMS.sizeW,
      h: PARAMS.sizeH
    };
    this.maskType = PARAMS.maskType;
    this.frameEnabled = PARAMS.frame;
    this.frameWidth = PARAMS.frameWidth;
    this.frameColor = PARAMS.frameColor;
    this.viewport = {
      width: q.width,
      height: q.height
    };
    this.displayFactor = {
      width: this.viewport.width / 2500,
      height: this.viewport.height / 2500
    };
    
    this.randomScaleW = PARAMS.randomizeSize ? (0.3 + Math.random() * 1.7) : 1;
    this.randomScaleH = PARAMS.randomizeSize ? (0.1 + Math.random() * 2.5) : 1;
    
    // Echte Netzkunst Palette (Neon, Primary, Black/White)
    const netArtColors = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF', '#bcff3b'
    ];
    let baseColor = q.color(netArtColors[Math.floor(Math.random() * netArtColors.length)]);
    baseColor.setAlpha(200 + Math.random() * 55);
    this.color = baseColor;
    
    this.useSolidColor = Math.random() > 0.4;
    this.blendMode = q.random([q.BLEND, q.DIFFERENCE, q.EXCLUSION]);

    this.moveX = this.createMoveState('x', PARAMS.moveTypeX, PARAMS.moveLevelX, PARAMS.moveRateX);
    this.moveY = this.createMoveState('y', PARAMS.moveTypeY, PARAMS.moveLevelY, PARAMS.moveRateY);
    this.offsetX = this.createOffsetState('x', PARAMS.offsetTypeX, PARAMS.offsetLevelX, PARAMS.offsetRateX);
    this.offsetY = this.createOffsetState('y', PARAMS.offsetTypeY, PARAMS.offsetLevelY, PARAMS.offsetRateY);
    this.rotation = this.createRotationState(PARAMS.rotationType, PARAMS.rotationLevel, PARAMS.rotationRate);
    this.scale = this.createScaleState(PARAMS.scaleType, PARAMS.scaleLevel, PARAMS.scaleRate);
  }

  createMoveState(axis, type, level, rate) {
    const viewportSize = axis === 'x' ? this.viewport.width : this.viewport.height;
    const axisFactor = axis === 'x' ? this.displayFactor.width : this.displayFactor.height;

    return {
      type,
      frame: 0,
      trend: randomDirection(),
      noise: createNoise2D(),
      axisFactor,
      constRate:
        mapRange(
          rate,
          UI_RANGES.moveRate.min,
          UI_RANGES.moveRate.max,
          ENGINE_MAPPING.move.rate.const.min,
          ENGINE_MAPPING.move.rate.const.max
        ) * axisFactor,
      noiseLevel: mapRange(
        level,
        UI_RANGES.moveLevel.min,
        UI_RANGES.moveLevel.max,
        viewportSize * ENGINE_MAPPING.move.level.min,
        viewportSize * ENGINE_MAPPING.move.level.max
      ),
      noiseRate: mapRange(
        rate,
        UI_RANGES.moveRate.min,
        UI_RANGES.moveRate.max,
        ENGINE_MAPPING.move.rate.noise.min,
        ENGINE_MAPPING.move.rate.noise.max
      ),
      noiseFactor: Math.max(level, 1),
      geomLevel: level * (viewportSize / 100) * 0.5,
      geomRate: mapRange(
        level,
        UI_RANGES.moveLevel.min,
        UI_RANGES.moveLevel.max,
        rate * 0.08,
        rate * 0.9
      )
    };
  }

  createOffsetState(axis, type, level, rate) {
    const imageSize = axis === 'x' ? img.width : img.height;

    return {
      type,
      frame: 0,
      trend: randomDirection(),
      noise: createNoise2D(),
      noiseLevel: mapRange(
        level,
        UI_RANGES.offsetLevel.min,
        UI_RANGES.offsetLevel.max,
        imageSize * ENGINE_MAPPING.offset.level.min,
        imageSize * ENGINE_MAPPING.offset.level.max
      ),
      noiseRate: mapRange(
        rate,
        UI_RANGES.offsetRate.min,
        UI_RANGES.offsetRate.max,
        ENGINE_MAPPING.offset.rate.noise.min,
        ENGINE_MAPPING.offset.rate.noise.max
      ),
      noiseFactor: Math.max(level, 1),
      geomLevel: level * (imageSize / 100) * 0.5,
      geomRate: mapRange(
        level,
        UI_RANGES.moveLevel.min,
        UI_RANGES.moveLevel.max,
        rate * 0.08,
        rate * 0.9
      )
    };
  }

  createRotationState(type, level, rate) {
    return {
      type,
      frame: 0,
      trend: randomDirection(),
      noise: createNoise2D(),
      noiseLevel: level,
      noiseRate: mapRange(
        rate,
        UI_RANGES.rotationRate.min,
        UI_RANGES.rotationRate.max,
        ENGINE_MAPPING.rotation.rate.noise.min,
        ENGINE_MAPPING.rotation.rate.noise.max
      ),
      geomLevel: level,
      geomRate: mapRange(
        rate,
        UI_RANGES.rotationRate.min,
        UI_RANGES.rotationRate.max,
        ENGINE_MAPPING.rotation.rate.geom.min,
        ENGINE_MAPPING.rotation.rate.geom.max
      )
    };
  }

  createScaleState(type, level, rate) {
    const noiseLevel = Math.max(0.01, level - 1);

    return {
      type,
      frame: 0,
      trend: randomDirection(),
      noise: createNoise2D(),
      noiseLevel,
      noiseRate: mapRange(
        rate,
        UI_RANGES.scaleRate.min,
        UI_RANGES.scaleRate.max,
        ENGINE_MAPPING.scale.rate.noise.min,
        ENGINE_MAPPING.scale.rate.noise.max
      ),
      noiseFactor: mapRange(
        clamp(noiseLevel, ENGINE_MAPPING.scale.level.min, ENGINE_MAPPING.scale.level.max),
        ENGINE_MAPPING.scale.level.min,
        ENGINE_MAPPING.scale.level.max,
        1,
        10
      ),
      geomLevel: noiseLevel,
      geomRate: mapRange(
        rate,
        UI_RANGES.scaleRate.min,
        UI_RANGES.scaleRate.max,
        ENGINE_MAPPING.scale.rate.geom.min,
        ENGINE_MAPPING.scale.rate.geom.max
      )
    };
  }

  getMoveValue(state) {
    switch (state.type) {
      case 'none':
        return 0;
      case 'const': {
        const value = state.frame * state.trend;
        state.frame += state.constRate;
        return value;
      }
      case 'noise': {
        const noiseStep = state.noiseRate / state.noiseFactor;
        const value = state.noise(state.frame * noiseStep, 0) * state.noiseLevel;
        state.frame += 1;
        return value;
      }
      case 'sin': {
        const divisor = Math.max(1, Math.round(state.geomLevel / (state.geomRate * state.axisFactor)));
        const frameRatio = state.frame / divisor;
        const value =
          mapRange(Math.sin(Math.PI * 2 * frameRatio), 1, -1, state.geomLevel, -state.geomLevel) *
          state.trend;
        state.frame = frameRatio >= 1 ? 1 : state.frame + 1;
        return value;
      }
      case 'cos': {
        const divisor = Math.max(1, Math.round(state.geomLevel / (state.geomRate * state.axisFactor)));
        const frameRatio = state.frame / divisor;
        const value =
          mapRange(
            1 - Math.cos(Math.PI * 2 * frameRatio),
            1,
            -1,
            state.geomLevel,
            -state.geomLevel
          ) * state.trend;
        state.frame = frameRatio >= 1 ? 1 : state.frame + 1;
        return value;
      }
      default:
        return 0;
    }
  }

  getOffsetValue(state) {
    switch (state.type) {
      case 'none':
        return 0;
      case 'noise': {
        const noiseStep = state.noiseRate / state.noiseFactor;
        const value = state.noise(state.frame * noiseStep, 0) * state.noiseLevel;
        state.frame += 1;
        return value;
      }
      case 'sin': {
        const divisor = Math.max(1, Math.round(state.geomLevel / state.geomRate));
        const frameRatio = state.frame / divisor;
        const value =
          mapRange(Math.sin(Math.PI * 2 * frameRatio), 1, -1, state.geomLevel, -state.geomLevel) *
          state.trend;
        state.frame = frameRatio >= 1 ? 0 : state.frame + 1;
        return value;
      }
      case 'cos': {
        const divisor = Math.max(1, Math.round(state.geomLevel / state.geomRate));
        const frameRatio = state.frame / divisor;
        const value =
          mapRange(
            1 - Math.cos(Math.PI * 2 * frameRatio),
            1,
            -1,
            state.geomLevel,
            -state.geomLevel
          ) * state.trend;
        state.frame = frameRatio >= 1 ? 0 : state.frame + 1;
        return value;
      }
      default:
        return 0;
    }
  }

  getRotationValue() {
    switch (this.rotation.type) {
      case 'none':
        return 0;
      case 'const': {
        const value = this.rotation.frame * this.rotation.trend;
        this.rotation.frame += this.rotation.geomRate;
        return value;
      }
      case 'noise': {
        const noiseStep = this.rotation.noiseRate / Math.max(this.rotation.noiseLevel, 1);
        const value = this.rotation.noise(this.rotation.frame * noiseStep, 0) * this.rotation.noiseLevel;
        this.rotation.frame += 1;
        return value;
      }
      case 'sin': {
        const value =
          Math.sin(this.rotation.frame * (this.rotation.geomRate / this.rotation.geomLevel)) *
          this.rotation.geomLevel *
          this.rotation.trend;
        this.rotation.frame += 1;
        return value;
      }
      case 'cos': {
        const value =
          (1 - Math.cos(this.rotation.frame * (this.rotation.geomRate / this.rotation.geomLevel))) *
          this.rotation.geomLevel *
          this.rotation.trend;
        this.rotation.frame += 1;
        return value;
      }
      default:
        return 0;
    }
  }

  getScaleValue() {
    switch (this.scale.type) {
      case 'none':
        return 1;
      case 'noise': {
        const noiseStep = this.scale.noiseRate / this.scale.noiseFactor;
        const value = 1 + this.scale.noise(this.scale.frame * noiseStep, 0) * this.scale.noiseLevel;
        this.scale.frame += 1;
        return Math.max(0.05, value);
      }
      case 'sin': {
        const value =
          1 +
          Math.sin(this.scale.frame * this.scale.geomRate) * this.scale.geomLevel * this.scale.trend;
        this.scale.frame += 1;
        return Math.max(0.05, value);
      }
      case 'cos': {
        let value =
          (1 - Math.cos(this.scale.frame * this.scale.geomRate)) *
          this.scale.geomLevel *
          this.scale.trend;
        value = 1 + value - value / 2;
        this.scale.frame += 1;
        return Math.max(0.05, value);
      }
      default:
        return 1;
    }
  }

  wrapEdges(width, height, moveX, moveY, rotationDegrees) {
    const canvasWidth = this.q.width;
    const canvasHeight = this.q.height;
    const cx = this.translate.x + moveX;
    const cy = this.translate.y + moveY;
    const theta = (rotationDegrees * Math.PI) / 180;
    const points = [];

    if (this.maskType === 'ellipse') {
      for (let angle = 0; angle < 360; angle += 15) {
        const px = Math.cos((angle * Math.PI) / 180) * (width / 2);
        const py = Math.sin((angle * Math.PI) / 180) * (height / 2);
        points.push(getRotatedPoint(cx, cy, theta, px, py));
      }
    } else {
      points.push(getRotatedPoint(cx, cy, theta, -width / 2, height / 2));
      points.push(getRotatedPoint(cx, cy, theta, width / 2, height / 2));
      points.push(getRotatedPoint(cx, cy, theta, -width / 2, -height / 2));
      points.push(getRotatedPoint(cx, cy, theta, width / 2, -height / 2));
    }

    let outsideLeft = 0;
    let outsideRight = 0;
    let outsideTop = 0;
    let outsideBottom = 0;
    let xLength = 0;
    let yLength = 0;

    for (const point of points) {
      if (point.x < 0) outsideLeft += 1;
      if (point.x > canvasWidth) outsideRight += 1;
      if (point.y < 0) outsideTop += 1;
      if (point.y > canvasHeight) outsideBottom += 1;
    }

    if (outsideLeft === points.length || outsideRight === points.length) {
      for (const point of points) {
        xLength = Math.max(xLength, Math.abs(cx - point.x));
      }
    }

    if (outsideTop === points.length || outsideBottom === points.length) {
      for (const point of points) {
        yLength = Math.max(yLength, Math.abs(cy - point.y));
      }
    }

    if (outsideLeft === points.length) {
      this.translate.x += canvasWidth + xLength * 2;
    } else if (outsideRight === points.length) {
      this.translate.x -= canvasWidth + xLength * 2;
    }

    if (outsideTop === points.length) {
      this.translate.y += canvasHeight + yLength * 2;
    } else if (outsideBottom === points.length) {
      this.translate.y -= canvasHeight + yLength * 2;
    }
  }

  draw() {
    const q = this.q;
    const moveX = this.getMoveValue(this.moveX);
    const moveY = this.getMoveValue(this.moveY);
    const offsetX = this.getOffsetValue(this.offsetX);
    const offsetY = this.getOffsetValue(this.offsetY);
    const rotationDegrees = this.getRotationValue();
    const scaleValue = this.getScaleValue();
    const baseWidth = PARAMS.randomizeSize ? this.size.w * this.randomScaleW : this.size.w;
    const baseHeight = PARAMS.randomizeSize ? this.size.h * this.randomScaleH : this.size.h;
    const sourceWidth = baseWidth / scaleRatio;
    const sourceHeight = baseHeight / scaleRatio;
    const sourceX = this.sample.x - sourceWidth / 2 - offsetX;
    const sourceY = this.sample.y - sourceHeight / 2 - offsetY;

    this.wrapEdges(baseWidth * scaleValue, baseHeight * scaleValue, moveX, moveY, rotationDegrees);

    q.push();
    q.blendMode(this.blendMode || q.BLEND);
    q.translate(this.translate.x + moveX, this.translate.y + moveY);
    q.rotate(q.radians(rotationDegrees));
    q.scale(scaleValue);

    q.drawingContext.beginPath();
    if (this.maskType === 'ellipse') {
      q.drawingContext.ellipse(0, 0, baseWidth / 2, baseHeight / 2, 0, 0, Math.PI * 2);
    } else {
      q.drawingContext.rect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
    }
    q.drawingContext.clip();

    if ((PARAMS.mixSolidColors && this.useSolidColor) || !img) {
      q.fill(this.color);
      q.noStroke();
      if (this.maskType === 'ellipse') {
        q.ellipse(0, 0, baseWidth, baseHeight);
      } else {
        q.rectMode(q.CENTER);
        q.rect(0, 0, baseWidth, baseHeight);
      }
    } else if (img) {
      q.image(
        img,
        -baseWidth / 2,
        -baseHeight / 2,
        baseWidth,
        baseHeight,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight
      );
    }
    q.pop();

    if (this.frameEnabled) {
      q.push();
      q.translate(this.translate.x + moveX, this.translate.y + moveY);
      q.rotate(q.radians(rotationDegrees));
      q.scale(scaleValue);
      q.noFill();
      q.strokeWeight(this.frameWidth);
      q.stroke(this.frameColor);

      if (this.maskType === 'ellipse') {
        q.ellipse(0, 0, baseWidth, baseHeight);
      } else {
        q.rectMode(q.CENTER);
        q.rect(0, 0, baseWidth, baseHeight);
      }
      q.pop();
    }
  }
}

const sketch = (q) => {
  const calculateImageScale = () => {
    if (!img) return;

    scaleRatio = Math.max(q.windowWidth / img.width, q.windowHeight / img.height);
    const scaledW = img.width * scaleRatio;
    const scaledH = img.height * scaleRatio;
    imgX = (q.windowWidth - scaledW) / 2;
    imgY = (q.windowHeight - scaledH) / 2;
  };

  q.preload = () => {};

  q.setup = () => {
    mainCanvas = q.createCanvas(q.windowWidth, q.windowHeight);
    mainCanvas.parent('canvas-container');
    q.pixelDensity(1);
    q.imageMode(q.CORNER);
    q.rectMode(q.CENTER);

    calculateImageScale();
    setupUI(q);
    
    // Load a random abstract image from Picsum
    const loadRandomImage = () => {
      // Use a timestamp to prevent aggressive caching of the same random image
      const timestamp = new Date().getTime();
      q.loadImage(`https://picsum.photos/1200/800?random=${timestamp}`, (loaded) => {
        img = loaded;
        calculateImageScale();
      }, (err) => {
        console.error("Failed to load random image", err);
      });
    };
    loadRandomImage();


    setTimeout(() => {
      const loading = document.getElementById('system-bootup');
      if (loading) loading.style.display = 'none';

      for (let i = 0; i < 9; i++) {
        setTimeout(() => {
          const rX = q.width / 2 + (Math.random() - 0.5) * (q.width * 0.45);
          const rY = q.height / 2 + (Math.random() - 0.5) * (q.height * 0.35);
          const px = (rX - imgX) / scaleRatio;
          const py = (rY - imgY) / scaleRatio;
          forms.push(new Form(rX, rY, px, py, forms.length, q));
        }, i * 110);
      }
    }, 1200);
  };

  q.draw = () => {
    q.background(PARAMS.background);

    if (PARAMS.showSourceImage && img) {
      q.push();
      q.tint(255, PARAMS.backgroundOpacity * 255);
      q.image(img, imgX, imgY, img.width * scaleRatio, img.height * scaleRatio);
      q.pop();
    }

    for (const form of forms) {
      form.draw();
    }

    if (isRecording) {
      q.push();
      q.fill('red');
      q.noStroke();
      q.circle(40, 80, 15);
      q.fill('white');
      q.text('REC', 55, 84);
      q.pop();
    }
  };

  q.mousePressed = () => {
    if (q.mouseX > q.width - 320) return;
    if (q.mouseX < 150 && q.mouseY < 100) return;

    if (forms.length >= PARAMS.maxForms) {
      forms.shift();
    }

    const px = (q.mouseX - imgX) / scaleRatio;
    const py = (q.mouseY - imgY) / scaleRatio;
    forms.push(new Form(q.mouseX, q.mouseY, px, py, forms.length, q));
  };

  q.windowResized = () => {
    q.resizeCanvas(q.windowWidth, q.windowHeight);
    calculateImageScale();
  };
};

const setupUI = (q) => {
  const pane = new Pane({ title: 'COPY_MACHINE v1.0', expanded: true });

  pane
    .addBinding(PARAMS, 'preset', {
      label: 'Preset Flow',
      options: presetOptions
    })
    .on('change', (ev) => {
      applyPreset(ev.value, pane);
    });

  const tab = pane.addTab({
    pages: [
      { title: 'MAIN' },
      { title: 'FORMS' },
      { title: 'ANIMATION' },
      { title: 'EXPORT' }
    ]
  });

  const pMain = tab.pages[0];
  pMain.addButton({ title: 'Upload Custom Image' }).on('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      q.loadImage(url, (newImg) => {
        img = newImg;
        q.windowResized();
      });
    };
    input.click();
  });
  pMain.addBinding(PARAMS, 'background', { label: 'Bg Color' });
  pMain.addBinding(PARAMS, 'showSourceImage', { label: 'Show Source' });
  pMain.addBinding(PARAMS, 'backgroundOpacity', { label: 'Bg Opacity', min: 0, max: 1 });
  pMain.addButton({ title: 'Clear Frame [C]' }).on('click', PARAMS.clear);

  const pForms = tab.pages[1];
  pForms.addBinding(PARAMS, 'maskType', {
    label: 'Mask',
    options: { Rectangle: 'rectangle', Ellipse: 'ellipse' }
  });
  pForms.addBinding(PARAMS, 'maxForms', { label: 'Max Forms', min: 1, max: 100, step: 1 });
  pForms.addBinding(PARAMS, 'sizeW', { label: 'Size W', min: 25, max: 800, step: 1 });
  pForms.addBinding(PARAMS, 'sizeH', { label: 'Size H', min: 25, max: 800, step: 1 });
  pForms.addBinding(PARAMS, 'randomizeSize', { label: 'Random Sizes' });
  pForms.addBinding(PARAMS, 'mixSolidColors', { label: 'Random Colors' });
  pForms.addBinding(PARAMS, 'frame', { label: 'Outline' });
  pForms.addBinding(PARAMS, 'frameWidth', { label: 'Stroke W', min: 0, max: 20 });
  pForms.addBinding(PARAMS, 'frameColor', { label: 'Stroke C' });

  const pAnim = tab.pages[2];
  const animOptions = { None: 'none', Constant: 'const', Sine: 'sin', Cosine: 'cos', Noise: 'noise' };
  const offsetOptions = { None: 'none', Sine: 'sin', Cosine: 'cos', Noise: 'noise' };
  const scaleOptions = { None: 'none', Sine: 'sin', Cosine: 'cos', Noise: 'noise' };

  const fMove = pAnim.addFolder({ title: 'Move X / Y' });
  fMove.addBinding(PARAMS, 'moveTypeX', { label: 'Mode X', options: animOptions });
  fMove.addBinding(PARAMS, 'moveLevelX', { label: 'Strength X', min: 1, max: 200, step: 1 });
  fMove.addBinding(PARAMS, 'moveRateX', { label: 'Speed X', min: 1, max: 10, step: 0.1 });
  fMove.addBinding(PARAMS, 'moveTypeY', { label: 'Mode Y', options: animOptions });
  fMove.addBinding(PARAMS, 'moveLevelY', { label: 'Strength Y', min: 1, max: 200, step: 1 });
  fMove.addBinding(PARAMS, 'moveRateY', { label: 'Speed Y', min: 1, max: 10, step: 0.1 });

  const fDrift = pAnim.addFolder({ title: 'Sample Offset' });
  fDrift.addBinding(PARAMS, 'offsetTypeX', { label: 'Mode X', options: offsetOptions });
  fDrift.addBinding(PARAMS, 'offsetLevelX', { label: 'Range X', min: 1, max: 25, step: 0.5 });
  fDrift.addBinding(PARAMS, 'offsetRateX', { label: 'Speed X', min: 1, max: 10, step: 0.1 });
  fDrift.addBinding(PARAMS, 'offsetTypeY', { label: 'Mode Y', options: offsetOptions });
  fDrift.addBinding(PARAMS, 'offsetLevelY', { label: 'Range Y', min: 1, max: 25, step: 0.5 });
  fDrift.addBinding(PARAMS, 'offsetRateY', { label: 'Speed Y', min: 1, max: 10, step: 0.1 });

  const fRot = pAnim.addFolder({ title: 'Rotation & Scale' });
  fRot.addBinding(PARAMS, 'rotationType', { label: 'Rot Mode', options: animOptions });
  fRot.addBinding(PARAMS, 'rotationLevel', { label: 'Rot Val', min: 5, max: 180, step: 5 });
  fRot.addBinding(PARAMS, 'rotationRate', { label: 'Rot Spd', min: 1, max: 10, step: 0.1 });
  fRot.addBinding(PARAMS, 'scaleType', { label: 'Scale Mode', options: scaleOptions });
  fRot.addBinding(PARAMS, 'scaleLevel', { label: 'Scale Val', min: 1.1, max: 2, step: 0.01 });
  fRot.addBinding(PARAMS, 'scaleRate', { label: 'Scale Spd', min: 1, max: 10, step: 0.1 });

  const pExport = tab.pages[3];
  pExport.addBinding(PARAMS, 'exportLength', {
    label: 'Rec Length (s)',
    min: 1,
    max: 60,
    step: 1
  });

  pExport.addButton({ title: 'Export PNG Image' }).on('click', async () => {
    try {
      if ('showSaveFilePicker' in window) {
        const canvasEl = document.querySelector('canvas');
        canvasEl?.toBlob(async (blob) => {
          if (!blob) return;
          try {
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: 'copy_machine_export.png',
              types: [{ description: 'PNG Image', accept: { 'image/png': ['.png'] } }]
            });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch {
            // Save dialog cancelled.
          }
        });
      } else {
        q.saveCanvas(mainCanvas, 'copy_machine_export', 'png');
      }
    } catch (error) {
      console.error(error);
    }
  });

  const btnExportVideo = pExport.addButton({ title: 'Record WebM Video' });
  btnExportVideo.on('click', () => {
    if (isRecording) {
      mediaRecorder.stop();
      btnExportVideo.title = 'Record WebM Video';
      return;
    }

    isRecording = true;
    btnExportVideo.title = 'STOP Recording';
    recordedChunks = [];
    const stream = mainCanvas.canvas.captureStream(30);
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      isRecording = false;
      btnExportVideo.title = 'Record WebM Video';
      const blob = new Blob(recordedChunks, { type: 'video/webm' });

      try {
        if ('showSaveFilePicker' in window) {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: 'copy_machine_export.webm',
            types: [
              {
                description: 'WebM Video',
                accept: { 'video/webm': ['.webm'] }
              }
            ]
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'copy_machine_export.webm';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Save dialog cancelled or failed:', error);
      }
    };
    mediaRecorder.start();

    setTimeout(() => {
      if (isRecording && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }, PARAMS.exportLength * 1000);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'c' || event.key === 'C') {
      PARAMS.clear();
    }
  });
};

new p5(sketch);
