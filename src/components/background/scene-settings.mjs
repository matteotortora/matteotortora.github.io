export const ORBITS = [
    { tilt: -0.5, ratio: 0.48, period: 90, phase: 0.65, color: '#94ddca' },
    { tilt: 0.82, ratio: 0.63, period: 125, phase: 3.9, color: '#ac9ad4' },
    { tilt: -1.05, ratio: 0.78, period: 155, phase: 3.45, color: '#a3c9dd' },
    { tilt: 0.25, ratio: 0.86, period: 180, phase: 4.05, color: '#bdc7a6' },
];

export function homeVisibility(rect, height, headerHeight = 72) {
    if (!rect || rect.top >= height) return 0;
    return Math.max(0, Math.min(1, (rect.bottom - headerHeight) / (height * 0.6)));
}

export function motionState({ hidden, visibility, reducedMotion, compact, paused }) {
    if (hidden) return 'hidden';
    if (visibility <= 0.001) return 'offscreen';
    if (reducedMotion) return 'reduced';
    if (compact) return 'static';
    return paused ? 'paused' : 'running';
}
