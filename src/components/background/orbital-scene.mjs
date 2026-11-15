import { geoGraticule, geoOrthographic, geoPath } from 'd3-geo';
import land from '../../data/earth-land.json';
import { ORBITS, homeVisibility, motionState } from './scene-settings.mjs';
import { observationPass } from './observation-pass.mjs';

const TAU = Math.PI * 2;
const GRATICULE = geoGraticule().step([30, 30]).precision(6)();

function starField(width, height, compact) {
    let seed = 24681;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const count = Math.min(compact ? 65 : 165, Math.max(40, Math.round(width * height / 9500)));
    return Array.from({ length: count }, () => ({
        x: random() * width, y: random() * height,
        radius: 0.4 + random(), alpha: 0.14 + random() * 0.35,
        depth: 0.2 + random() * 0.8, phase: random() * TAU,
        color: ['#b9c9df', '#b9c9df', '#b9c9df', '#98c8b9', '#b4a1cd'][Math.floor(random() * 5)],
    }));
}

function drawStars(context, stars, width, height, seconds, pointer, animate) {
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
        context.globalAlpha = star.alpha + Math.sin(seconds * 0.4 + star.phase) * 0.055;
        context.fillStyle = star.color;
        context.beginPath();
        context.arc(star.x + pointer.x * star.depth * 8, star.y + pointer.y * star.depth * 6, star.radius, 0, TAU);
        context.fill();
    }
    context.globalAlpha = 1;
    // A short, infrequent meteor, restricted to the top of the home scene.
    const age = (seconds + 38) % 55;
    if (!animate || age > 1.1) return;
    const progress = age / 1.1;
    const distance = Math.min(width * 0.28, 360) * progress;
    const head = { x: width * 0.85 - distance, y: height * 0.07 + distance * 0.55 };
    const tail = { x: head.x + 110, y: head.y - 60 };
    const trail = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
    trail.addColorStop(0, 'rgba(160, 222, 210, 0)');
    trail.addColorStop(1, `rgba(202, 245, 229, ${Math.sin(progress * Math.PI) * 0.65})`);
    context.strokeStyle = trail;
    context.lineWidth = 1.2;
    context.beginPath(); context.moveTo(tail.x, tail.y); context.lineTo(head.x, head.y); context.stroke();
}

function orbitPosition(orbit, radius, theta) {
    const x = radius * 1.32 * Math.cos(theta);
    const y = radius * 1.32 * orbit.ratio * Math.sin(theta);
    return {
        x: x * Math.cos(orbit.tilt) - y * Math.sin(orbit.tilt),
        y: x * Math.sin(orbit.tilt) + y * Math.cos(orbit.tilt),
    };
}

function drawOrbit(context, orbit, center, radius, front, seconds) {
    context.strokeStyle = front ? 'rgba(132, 181, 183, 0.27)' : 'rgba(123, 153, 170, 0.15)';
    context.lineWidth = 0.8;
    context.beginPath();
    context.ellipse(center, center, radius * 1.32, radius * 1.32 * orbit.ratio,
        orbit.tilt, front ? 0 : Math.PI, front ? Math.PI : TAU);
    context.stroke();
    const theta = (orbit.phase + seconds * TAU / orbit.period) % TAU;
    if ((Math.sin(theta) >= 0) !== front) return;
    const point = orbitPosition(orbit, radius, theta);
    const ahead = orbitPosition(orbit, radius, theta + 0.01);
    context.save();
    context.translate(center + point.x, center + point.y);
    context.rotate(Math.atan2(ahead.y - point.y, ahead.x - point.x));
    context.shadowColor = orbit.color;
    context.shadowBlur = 6;
    context.strokeStyle = orbit.color;
    context.fillStyle = '#264459';
    context.lineWidth = 0.8;
    context.fillRect(-9, -3.5, 5, 7); context.strokeRect(-9, -3.5, 5, 7);
    context.fillRect(4, -3.5, 5, 7); context.strokeRect(4, -3.5, 5, 7);
    context.beginPath(); context.moveTo(-4, 0); context.lineTo(4, 0); context.stroke();
    context.fillStyle = '#c6ddda'; context.fillRect(-2, -3, 4, 6);
    context.restore();
}

function traceObservation(context, points, center, radius, close = false) {
    context.beginPath();
    points.forEach((point, index) => {
        const x = center + point.x * radius, y = center + point.y * radius;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    });
    if (close) context.closePath();
}

function drawObservationSwath(context, pass, center, radius) {
    for (const slice of pass.swath) {
        traceObservation(context, slice.points, center, radius, true);
        context.fillStyle = `rgba(139, 234, 209, ${slice.opacity * 0.22})`;
        context.fill();
    }
    traceObservation(context, pass.edge, center, radius);
    context.strokeStyle = `rgba(173, 244, 222, ${pass.opacity * 0.65})`;
    context.lineWidth = 1;
    context.stroke();
}

function drawObservationBeam(context, pass, center, radius) {
    const x = center + pass.satellite.x * radius;
    const y = center + pass.satellite.y * radius;
    const beam = context.createLinearGradient(x, y,
        center + pass.ground.x * radius, center + pass.ground.y * radius);
    beam.addColorStop(0, `rgba(148, 221, 202, ${pass.opacity * 0.05})`);
    beam.addColorStop(1, `rgba(148, 221, 202, ${pass.opacity * 0.2})`);
    traceObservation(context, [pass.satellite, ...pass.edge], center, radius, true);
    context.fillStyle = beam;
    context.fill();
}

function drawGlobe(context, size, seconds, pointer, showObservation) {
    const center = size / 2;
    const radius = size * 0.33;
    const passes = showObservation ? ORBITS.map(orbit => observationPass(orbit, seconds)).filter(Boolean) : [];
    context.clearRect(0, 0, size, size);
    const glow = context.createRadialGradient(center, center, radius * 0.95, center, center, radius * 1.18);
    glow.addColorStop(0, 'rgba(91, 177, 175, 0.13)');
    glow.addColorStop(1, 'rgba(91, 177, 175, 0)');
    context.fillStyle = glow;
    context.beginPath(); context.arc(center, center, radius * 1.18, 0, TAU); context.fill();
    ORBITS.forEach(orbit => drawOrbit(context, orbit, center, radius, false, seconds));

    context.save();
    context.beginPath(); context.arc(center, center, radius, 0, TAU); context.clip();
    const ocean = context.createRadialGradient(center - radius * 0.35, center - radius * 0.4, radius * 0.1, center, center, radius);
    ocean.addColorStop(0, '#183540'); ocean.addColorStop(0.65, '#112a36'); ocean.addColorStop(1, '#0d1c2a');
    context.fillStyle = ocean; context.fillRect(0, 0, size, size);
    const projection = geoOrthographic().translate([center, center]).scale(radius)
        .rotate([-25 + seconds, -18 + pointer.y * 2, -10 + pointer.x * 2]).precision(0.8);
    const path = geoPath(projection, context);
    context.beginPath(); path(GRATICULE);
    context.strokeStyle = 'rgba(125, 181, 193, 0.17)'; context.lineWidth = 0.65; context.stroke();
    const landColor = context.createLinearGradient(center - radius, center - radius, center + radius, center + radius);
    landColor.addColorStop(0, '#397e70'); landColor.addColorStop(0.6, '#245d59'); landColor.addColorStop(1, '#263d51');
    context.beginPath(); path(land);
    context.fillStyle = landColor; context.fill();
    context.strokeStyle = 'rgba(116, 212, 175, 0.35)'; context.lineWidth = 0.65; context.stroke();
    passes.forEach(pass => drawObservationSwath(context, pass, center, radius));
    const shade = context.createLinearGradient(center - radius, center - radius * 0.3, center + radius, center + radius * 0.6);
    shade.addColorStop(0, 'rgba(172, 211, 210, 0.025)');
    shade.addColorStop(0.55, 'rgba(3, 12, 24, 0.08)'); shade.addColorStop(1, 'rgba(3, 12, 24, 0.65)');
    context.fillStyle = shade; context.fillRect(0, 0, size, size);
    context.restore();
    context.beginPath(); context.arc(center, center, radius, 0, TAU);
    context.strokeStyle = 'rgba(117, 197, 190, 0.32)'; context.lineWidth = 1; context.stroke();
    passes.forEach(pass => drawObservationBeam(context, pass, center, radius));
    ORBITS.forEach(orbit => drawOrbit(context, orbit, center, radius, true, seconds));
}

export function createOrbitalScene({ root, starsCanvas, globeCanvas, onControlVisibility }) {
    const starsContext = starsCanvas.getContext('2d');
    const globeContext = globeCanvas.getContext('2d');
    if (!starsContext || !globeContext) return { setPaused() {}, dispose() {} };
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactQuery = window.matchMedia('(max-width: 48rem)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    let width = 0, height = 0, globeSize = 0, stars = [];
    let visibility = 0, paused = false, frame = null, lastTime = null;
    let elapsed = 0, lastPaint = -Infinity, lastGlobePaint = -Infinity, globeDirty = true;
    let controlsVisible = false, disposed = false;
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const compact = () => compactQuery.matches || !pointerQuery.matches;
    const state = () => motionState({
        hidden: document.hidden, visibility, reducedMotion: reducedQuery.matches, compact: compact(), paused,
    });

    function queue() {
        if (frame === null && !document.hidden && !disposed) frame = requestAnimationFrame(tick);
    }
    function updateControls(value) {
        if (value !== controlsVisible) { controlsVisible = value; onControlVisibility(value); }
    }
    function measureHome() {
        const home = document.getElementById('home');
        const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 72;
        visibility = homeVisibility(home?.getBoundingClientRect(), window.innerHeight, headerHeight);
        globeCanvas.style.opacity = String(visibility * (compact() ? 0.32 : 0.8));
        queue();
    }
    function resize() {
        width = window.innerWidth; height = window.innerHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        globeSize = globeCanvas.getBoundingClientRect().width;
        starsCanvas.width = Math.round(width * ratio); starsCanvas.height = Math.round(height * ratio);
        globeCanvas.width = Math.round(globeSize * ratio); globeCanvas.height = Math.round(globeSize * ratio);
        starsContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        globeContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        stars = starField(width, height, compact());
        globeDirty = true; lastPaint = -Infinity;
        measureHome();
    }
    function paint(animate) {
        if (animate) {
            pointer.x += (target.x - pointer.x) * 0.06;
            pointer.y += (target.y - pointer.y) * 0.06;
        }
        drawStars(starsContext, stars, width, height, elapsed / 1000, pointer, animate);
        if (visibility > 0.001 && (globeDirty || elapsed - lastGlobePaint >= 100)) {
            drawGlobe(globeContext, globeSize, elapsed / 1000, pointer, !compact() && !reducedQuery.matches);
            lastGlobePaint = elapsed; globeDirty = false;
        }
        globeCanvas.style.transform = `translate3d(${pointer.x * 6}px, ${pointer.y * 4}px, 0)`;
    }
    function tick(now) {
        frame = null;
        const current = state();
        if (root.dataset.motion !== current) root.dataset.motion = current;
        updateControls(!compact() && !reducedQuery.matches && visibility > 0.001 && !document.hidden);
        if (current === 'running') {
            if (lastTime !== null) elapsed += Math.min(now - lastTime, 120);
            lastTime = now;
            if (now - lastPaint >= 1000 / 24) { paint(true); lastPaint = now; }
            queue();
        } else {
            lastTime = null;
            if (current !== 'hidden') paint(false);
        }
    }
    function visibilityChanged() {
        lastTime = null;
        if (document.hidden) {
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null; root.dataset.motion = 'hidden'; updateControls(false);
        } else queue();
    }
    function move(event) {
        if (state() !== 'running' || event.pointerType === 'touch') return;
        target.x = (event.clientX / width - 0.5) * 2;
        target.y = (event.clientY / height - 0.5) * 2;
    }
    function leave(event) { if (!event.relatedTarget) { target.x = 0; target.y = 0; } }

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', measureHome, { passive: true });
    window.addEventListener('hashchange', measureHome);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave);
    document.addEventListener('visibilitychange', visibilityChanged);
    for (const query of [reducedQuery, compactQuery, pointerQuery]) query.addEventListener('change', resize);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(globeCanvas);
    resize();

    return {
        setPaused(value) { paused = value; lastTime = null; queue(); },
        dispose() {
            disposed = true;
            if (frame !== null) cancelAnimationFrame(frame);
            observer?.disconnect();
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', measureHome);
            window.removeEventListener('hashchange', measureHome);
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerout', leave);
            document.removeEventListener('visibilitychange', visibilityChanged);
            for (const query of [reducedQuery, compactQuery, pointerQuery]) query.removeEventListener('change', resize);
        },
    };
}
