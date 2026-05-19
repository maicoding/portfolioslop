export async function initSlopBackground() {
  const container = document.getElementById('slop-canvas-container');
  if (!container) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [];
  let rafId = null;

  canvas.className = 'slop-background-canvas';
  container.innerHTML = '';
  container.appendChild(canvas);

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: width < 720 ? 70 : 150 }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 4 + Math.random() * 24,
      speed: 0.08 + Math.random() * 0.42,
      drift: -0.25 + Math.random() * 0.5,
      hue: [78, 184, 305, 26][index % 4],
      alpha: 0.16 + Math.random() * 0.42,
    }));
  }

  function drawGrid(width, height) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#38f8ff';
    ctx.lineWidth = 1;

    for (let x = 0; x < width + height; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - height * 0.6, height);
      ctx.stroke();
    }

    ctx.strokeStyle = '#ff3df2';
    for (let y = 0; y < height; y += 84) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + Math.sin(y * 0.02) * 20);
      ctx.stroke();
    }

    ctx.restore();
  }

  function draw(time = 0) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 61, 242, 0.16)');
    gradient.addColorStop(0.42, 'rgba(56, 248, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(185, 255, 69, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawGrid(width, height);

    particles.forEach((particle, index) => {
      particle.y -= particle.speed;
      particle.x += Math.sin(time * 0.0004 + index) * particle.drift;
      if (particle.y < -40) {
        particle.y = height + 40;
        particle.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(time * 0.00018 + index);
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = `hsl(${particle.hue} 100% 64%)`;
      ctx.shadowColor = `hsl(${particle.hue} 100% 64%)`;
      ctx.shadowBlur = 18;

      if (index % 3 === 0) {
        ctx.fillRect(-particle.size * 0.5, -particle.size * 0.5, particle.size, particle.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener('resize', resize);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  };
}
