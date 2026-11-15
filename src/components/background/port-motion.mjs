const TAU = Math.PI * 2;
const ground = 0.035;

export const ENERGY_ROUTES = [
    { id: 'solar-rear', points: [[-2.8, ground, -1.65], [3.13, ground, -1.65]], period: 11 },
    { id: 'solar-front', points: [[-2.75, ground, 0.96], [3.13, ground, 0.96], [3.13, ground, -1.65]], period: 13 },
    { id: 'storage', points: [[3.13, ground, -1.65], [3.13, ground, -2.2], [4.35, ground, -2.2], [4.35, ground, -2.4]], period: 9 },
    { id: 'distribution', points: [[3.13, ground, -1.65], [3.13, ground, -2.32]], period: 8 },
    { id: 'quay', points: [[3.13, ground, -1.65], [3.13, ground, 0.96], [-1.18, ground, 0.96]], period: 12 },
    { id: 'shore-power', points: [[-1.18, 0.22, 1.04], [-1.18, 0.12, 1.3], [-1.18, 0.12, 1.57], [-1.18, 0.29, 1.85], [-1.18, 0.63, 2.02]], period: 5 },
];

export function pointOnRoute(points, progress) {
    const lengths = points.slice(1).map((point, index) => Math.hypot(...point.map((value, axis) => value - points[index][axis])));
    let distance = Math.max(0, Math.min(1, progress)) * lengths.reduce((sum, length) => sum + length, 0);
    for (let index = 0; index < lengths.length; index++) {
        if (distance <= lengths[index]) {
            const amount = lengths[index] ? distance / lengths[index] : 0;
            return points[index].map((value, axis) => value + (points[index + 1][axis] - value) * amount);
        }
        distance -= lengths[index];
    }
    return [...points.at(-1)];
}

const ease = value => (1 - Math.cos(Math.PI * value)) / 2;

export function portVehicle(seconds) {
    const phase = ((seconds % 36) + 36) % 36;
    let x, yaw = 0, charging = false;
    if (phase < 12) { x = 4 - ease(phase / 12) * 8.4; yaw = Math.PI; }
    else if (phase < 14) { x = -4.4; yaw = Math.PI * (1 - ease((phase - 12) / 2)); }
    else if (phase < 26) x = -4.4 + ease((phase - 14) / 12) * 6.2;
    else if (phase < 30) { x = 1.8; charging = true; }
    else if (phase < 34) x = 1.8 + ease((phase - 30) / 4) * 2.2;
    else { x = 4; yaw = Math.PI * ease((phase - 34) / 2); }
    return { x, z: -1.14, yaw, charging };
}

export function projectPortPoint([x, y, z], width, height, pointer = { x: 0, y: 0 }) {
    const yaw = Math.PI / 4 + pointer.x * 0.012;
    const scale = width / 18.3;
    return {
        x: width * 0.52 + (x * Math.cos(yaw) - z * Math.sin(yaw)) * Math.sqrt(1.5) * scale,
        y: height * 0.47 + ((x * Math.sin(yaw) + z * Math.cos(yaw)) / Math.SQRT2 - y) * scale * (1 + pointer.y * 0.015),
    };
}

export function energyPhase(seconds, route, index = 0) {
    return ((seconds / route.period + index * 0.5) % 1 + 1) % 1;
}

export function waterPhase(seconds, index) {
    return Math.sin(seconds * TAU / 14 + index * 1.7);
}
