const TAU = Math.PI * 2;
const START = 0.12;
const END = Math.PI - 0.12;

// A decorative swath on the visible hemisphere, aligned with each satellite's orbit.
// All coordinates are in globe radii, before translation to the canvas.
export function observationPass(orbit, seconds) {
    const theta = ((orbit.phase + seconds * TAU / orbit.period) % TAU + TAU) % TAU;
    if (theta <= START || theta >= END) return null;
    const opacity = Math.min(1, (theta - START) / 0.28, (END - theta) / 0.28);
    const cos = Math.cos(orbit.tilt), sin = Math.sin(orbit.tilt);
    const depth = Math.sqrt(1 - orbit.ratio ** 2);
    const normal = { x: sin * depth, y: -cos * depth, z: orbit.ratio };
    function surface(angle, crossTrack = 0) {
        const x = Math.cos(angle) * cos - Math.sin(angle) * orbit.ratio * sin;
        const y = Math.cos(angle) * sin + Math.sin(angle) * orbit.ratio * cos;
        const z = Math.sin(angle) * depth;
        return {
            x: x * Math.cos(crossTrack) + normal.x * Math.sin(crossTrack),
            y: y * Math.cos(crossTrack) + normal.y * Math.sin(crossTrack),
            z: z * Math.cos(crossTrack) + normal.z * Math.sin(crossTrack),
        };
    }
    const halfWidth = 0.045;
    const trail = Math.min(0.48, theta - START);
    const slices = 20;
    const swath = Array.from({ length: slices }, (_, index) => {
        const from = theta - trail + trail * index / slices;
        const to = theta - trail + trail * (index + 1) / slices;
        return {
            points: [surface(from, -halfWidth), surface(to, -halfWidth),
                surface(to, halfWidth), surface(from, halfWidth)],
            opacity: opacity * ((index + 1) / slices) ** 1.5,
        };
    }).filter(slice => slice.points.every(point => point.z > 0));
    const ground = surface(theta);
    const edge = Array.from({ length: 9 }, (_, index) => surface(theta, -halfWidth + index * halfWidth / 4));
    return {
        opacity, swath, edge, ground,
        satellite: { x: ground.x * 1.32, y: ground.y * 1.32 },
    };
}
