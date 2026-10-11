const hashNoise = (value) => {
  const result = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return result - Math.floor(result);
};

const noise = (value, phase) => {
  const shifted = value + phase;
  const left = Math.floor(shifted);
  const fraction = shifted - left;
  const smooth = fraction * fraction * (3 - 2 * fraction);
  return hashNoise(left) * (1 - smooth) + hashNoise(left + 1) * smooth;
};

const PHASE_SPEED = 0.00022;
const FRAME_INTERVAL = 40;

export const createScrollBurnTransition = ({
  getCanvas,
  onClipPath,
  onProgress = () => {},
  shouldReduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  curve = 0.12,
  sway = 0.03,
}) => {
  let context = null;
  let width = 0;
  let height = 0;
  let progress = 0;
  let frameId = 0;
  let lastFrameTime = 0;
  let destroyed = false;

  // Posisi Y tepi burn pada titik x. amplitude (0..1) menskalakan semua deformasi.
  // Posisi Y tepi burn pada titik x. amplitude (0..1) menskalakan semua deformasi.
const edgeY = (x, baseY, drift, phase, amplitude) => {
    const shiftedX = x + drift;
    const u = x / width;

    // Busur besar: puncak bergeser pelan supaya tidak simetris kaku
    const peak = 0.5 + Math.sin(phase * 0.12) * 0.08;
    const skewed =
      u < peak ? (u / peak) * 0.5 : 0.5 + ((u - peak) / (1 - peak)) * 0.5;
    const arch = Math.pow(Math.max(Math.sin(Math.PI * skewed), 0), 1.35);
    const bow = -arch * height * curve;

    const tilt = Math.sin(u * 2.4 + phase * 0.18) * height * sway;
    const swell =
      Math.sin(shiftedX * 0.003 + phase * 0.24) * 10 +
      Math.sin(shiftedX * 0.009 - phase * 0.17) * 6;
    const chop =
      (noise(shiftedX * 0.018, phase * 0.13) - 0.5) * 28 +
      (noise(shiftedX * 0.052, -phase * 0.19) - 0.5) * 22 +
      (noise(shiftedX * 0.15, phase * 0.23) - 0.5) * 16 +
      (noise(shiftedX * 0.43, -phase * 0.31) - 0.5) * 8;

    // Deviasi maksimum ke atas: busur + kemiringan + swell (16) + chop (37) + cadangan
    // Dipakai untuk menggeser tepi ke bawah, supaya tidak pernah di atas section berikutnya.
    const cover = (curve + sway) * height + 58;
    // Cadangan ekstra untuk lubang bakar yang menjorok sedikit di atas tepi
    const holePad = 48 * Math.sqrt(amplitude);

    return baseY + (cover + bow + tilt + swell + chop) * amplitude + holePad;
    };

const buildClipPath = (phase, drift) => {
    const amplitude = Math.sin(progress * Math.PI);
    const baseY = height * (1 - progress);
    const segments = Math.ceil(width / 5);
    const edge = [];

    for (let index = segments; index >= 0; index -= 1) {
      const x = (width * index) / segments;
      const y = edgeY(x, baseY, drift, phase, amplitude);
      edge.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    const burnHoles = [];
    const holeCount = Math.max(4, Math.round(width / 140));
    for (let index = 0; index < holeCount; index += 1) {
      const seed = index * 43.7 + 9.2;
      const x =
        (hashNoise(seed) * width + Math.sin(seed + phase * 0.1) * 9 + width) %
        width;
      const y =
        edgeY(x, baseY, drift, phase, amplitude) +
        (hashNoise(seed + 6.1) - 0.5) * 44 * amplitude;
      const radius = (8 + hashNoise(seed + 12.4) * 18) * Math.sqrt(amplitude);
      const vertexCount = 8;
      const vertices = [];

      for (let vertex = 0; vertex < vertexCount; vertex += 1) {
        const angle = -((vertex / vertexCount) * Math.PI * 2);
        const uneven = radius * (0.72 + hashNoise(seed + vertex * 3.1) * 0.55);
        vertices.push({
          x: x + Math.cos(angle) * uneven,
          y: y + Math.sin(angle) * uneven * 0.7,
        });
      }

      const midpoints = vertices.map((vertex, i) => {
        const next = vertices[(i + 1) % vertexCount];
        return { x: (vertex.x + next.x) / 2, y: (vertex.y + next.y) / 2 };
      });

      let holePath = `M ${midpoints[vertexCount - 1].x.toFixed(1)} ${midpoints[vertexCount - 1].y.toFixed(1)}`;
      vertices.forEach((vertex, i) => {
        holePath += ` Q ${vertex.x.toFixed(1)} ${vertex.y.toFixed(1)} ${midpoints[i].x.toFixed(1)} ${midpoints[i].y.toFixed(1)}`;
      });
      burnHoles.push(`${holePath} Z`);
    }

    const path = `M 0 0 H ${width.toFixed(1)} L ${edge.join(' L ')} L 0 0 Z ${burnHoles.join(' ')}`;
    return `path('${path}')`;
  };

  const draw = (animationPhase = 0) => {
    if (!context || !width || !height) return;

    context.clearRect(0, 0, width, height);
    if (progress <= 0) {
      onClipPath('none');
      return;
    }

    const phase = progress * Math.PI * 8 + animationPhase;
    const drift = progress * width * 0.24 + animationPhase * 18;
    const amplitude = Math.sin(progress * Math.PI);
    const baseY = height * (1 - progress);
    const step = Math.max(2, width / 700);
    const points = [];

    for (let x = -step; x <= width + step; x += step) {
      points.push({ x, y: edgeY(x, baseY, drift, phase, amplitude) });
    }

    onClipPath(buildClipPath(phase, drift));

    const strokeEdge = (offsetY, lineWidth, style, wobble = 0, layer = 0) => {
      context.beginPath();
      points.forEach((point, index) => {
        const y =
          point.y +
          offsetY +
          (wobble
            ? Math.sin((point.x + drift * 0.7) * 0.012 + phase * 0.37 + layer) * wobble
            : 0);
        if (index === 0) context.moveTo(point.x, y);
        else context.lineTo(point.x, y);
      });
      context.lineWidth = lineWidth;
      context.strokeStyle = style;
      context.stroke();
    };

    context.save();
    context.globalAlpha = amplitude;
    context.lineJoin = 'round';
    context.lineCap = 'round';

    // Bayangan gosong yang mengikuti lengkungan (sebelumnya band lurus)
    strokeEdge(14, 110, 'rgba(9, 11, 14, 0.05)');
    strokeEdge(10, 70, 'rgba(9, 11, 14, 0.09)');
    strokeEdge(6, 34, 'rgba(9, 11, 14, 0.15)');

    // Garis tekstur tipis di sepanjang tepi
    for (let layer = 0; layer < 4; layer += 1) {
      strokeEdge(
        (5 + layer * 7) * amplitude,
        layer === 0 ? 1 : 0.65,
        `rgba(34, 38, 41, ${0.09 - layer * 0.015})`,
        2 + layer,
        layer,
      );
    }

    context.restore();
  };

  const tick = (timestamp) => {
    frameId = 0;
    if (destroyed || progress <= 0 || progress >= 1 || shouldReduceMotion()) return;

    if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
      lastFrameTime = timestamp;
      draw(timestamp * PHASE_SPEED);
    }
    frameId = requestAnimationFrame(tick);
  };

  const stopLoop = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };

  const startLoop = () => {
    if (!frameId) frameId = requestAnimationFrame(tick);
  };

    const setProgress = (value) => {
    progress = Math.min(Math.max(value, 0), 1);
    onProgress(progress);
    draw(performance.now() * PHASE_SPEED);

    if (progress > 0 && progress < 1 && !shouldReduceMotion()) startLoop();
    else stopLoop();
  };

  const resize = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context = canvas.getContext('2d');
    context?.setTransform(scale, 0, 0, scale, 0, 0);
    draw(performance.now() * PHASE_SPEED);
  };

  // Panggil saat preferensi reduced-motion berubah
  const refresh = () => setProgress(progress);

  const destroy = () => {
    destroyed = true;
    stopLoop();
  };

  return { resize, setProgress, refresh, destroy };
};