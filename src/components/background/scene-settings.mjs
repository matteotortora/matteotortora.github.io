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
