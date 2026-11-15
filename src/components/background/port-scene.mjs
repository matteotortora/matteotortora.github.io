import { homeVisibility, motionState } from './scene-settings.mjs';
import { createPortPainter } from './port-renderer.mjs';

export function createPortScene({root,canvas,onControlVisibility}) {
    const painter = createPortPainter(canvas);
    if (!painter) return { setPaused() {}, dispose() {} };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 48rem)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const pointer = {x:0,y:0}, target = {x:0,y:0};
    let visibility = 0, paused = false, disposed = false, frame = null;
    let elapsed = 0, lastTime = null, lastPaint = -Infinity, controlsVisible = false;
    const compact = () => narrow.matches || !finePointer.matches;
    const state = () => motionState({hidden:document.hidden,visibility,reducedMotion:reduced.matches,compact:compact(),paused});
    function queue() {
        if (frame === null && !disposed && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function controls(value) {
        if (controlsVisible !== value) { controlsVisible = value; onControlVisibility(value); }
    }
    function measureHome() {
        const home = document.getElementById('home');
        const header = document.querySelector('header')?.getBoundingClientRect().height || 72;
        visibility = homeVisibility(home?.getBoundingClientRect(),window.innerHeight,header);
        canvas.style.opacity = String(visibility*(compact() ? 0.2 : 1));
        queue();
    }
    function resize() {
        const bounds = canvas.getBoundingClientRect();
        painter.resize(Math.max(1,bounds.width),Math.max(1,bounds.height),Math.min(window.devicePixelRatio || 1,1.5));
        if (compact() || reduced.matches) { pointer.x = 0; pointer.y = 0; target.x = 0; target.y = 0; }
        lastPaint = -Infinity;
        measureHome();
    }
    function paint(animate) {
        if (animate) { pointer.x += (target.x-pointer.x)*0.08; pointer.y += (target.y-pointer.y)*0.08; }
        painter.paint(elapsed/1000,pointer);
        canvas.style.transform = `translate3d(${pointer.x*6}px, ${pointer.y*4}px, 0)`;
    }
    function tick(now) {
        frame = null;
        const current = state();
        root.dataset.motion = current;
        controls(!compact() && !reduced.matches && visibility > 0.001 && !document.hidden);
        if (current === 'running') {
            if (lastTime !== null) elapsed += Math.min(now-lastTime,120);
            lastTime = now;
            if (now-lastPaint >= 1000/20) { paint(true); lastPaint = now; }
            queue();
        } else {
            lastTime = null;
            if (current !== 'hidden' && current !== 'offscreen') paint(false);
        }
    }
    function visibilityChanged() {
        lastTime = null;
        if (document.hidden) {
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null; root.dataset.motion = 'hidden'; controls(false);
        } else queue();
    }
    function move(event) {
        if (state() !== 'running' || event.pointerType === 'touch') return;
        target.x = Math.max(-1,Math.min(1,(event.clientX/window.innerWidth-0.5)*2));
        target.y = Math.max(-1,Math.min(1,(event.clientY/window.innerHeight-0.5)*2));
    }
    function leave(event) { if (!event.relatedTarget) { target.x = 0; target.y = 0; } }
    window.addEventListener('resize',resize);
    window.addEventListener('scroll',measureHome,{passive:true});
    window.addEventListener('hashchange',measureHome);
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('pointerout',leave);
    document.addEventListener('visibilitychange',visibilityChanged);
    for (const query of [reduced,narrow,finePointer]) query.addEventListener('change',resize);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(canvas);
    resize();
    return {
        setPaused(value) { paused = value; lastTime = null; queue(); },
        dispose() {
            disposed = true;
            if (frame !== null) cancelAnimationFrame(frame);
            observer?.disconnect(); painter.dispose();
            window.removeEventListener('resize',resize);
            window.removeEventListener('scroll',measureHome);
            window.removeEventListener('hashchange',measureHome);
            window.removeEventListener('pointermove',move);
            window.removeEventListener('pointerout',leave);
            document.removeEventListener('visibilitychange',visibilityChanged);
            for (const query of [reduced,narrow,finePointer]) query.removeEventListener('change',resize);
        },
    };
}
