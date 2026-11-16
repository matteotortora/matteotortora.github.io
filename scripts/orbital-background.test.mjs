import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { geoArea } from 'd3-geo';
import { ORBITS, homeVisibility, motionState } from '../src/components/background/scene-settings.mjs';
import { observationPass } from '../src/components/background/observation-pass.mjs';

test('background motion requires a visible home, an active tab and permission to animate', () => {
    const allowed = { hidden: false, visibility: 1, reducedMotion: false, compact: false, paused: false };
    assert.equal(motionState(allowed), 'running');
    for (const restriction of [
        { hidden: true }, { visibility: 0 }, { reducedMotion: true }, { paused: true },
    ]) assert.notEqual(motionState({ ...allowed, ...restriction }), 'running');
    assert.equal(motionState({ ...allowed, paused: true }), 'paused');
    assert.equal(motionState({ ...allowed, reducedMotion: true }), 'reduced');
    assert.equal(motionState({ ...allowed, compact: true }), 'running', 'Touch and narrow layouts must still animate.');
});

test('the globe fades out before the home passes underneath the fixed navigation', () => {
    assert.equal(homeVisibility({ top: 72, bottom: 928 }, 1000), 1);
    const fading = homeVisibility({ top: -500, bottom: 250 }, 1000);
    assert.ok(fading > 0 && fading < 1);
    assert.equal(homeVisibility({ top: -900, bottom: 72 }, 1000), 0);
    assert.equal(homeVisibility({ top: 1100, bottom: 1800 }, 1000), 0);
    assert.equal(homeVisibility(null, 1000), 0);
});

test('coastline data covers land rather than its spherical complement', () => {
    const land = JSON.parse(readFileSync(new URL('../src/data/earth-land.json', import.meta.url), 'utf8'));
    assert.equal(land.type, 'GeometryCollection');
    assert.ok(land.geometries.length > 100);
    const area = geoArea(land);
    assert.ok(area > 3 && area < 4, `Unexpected land area: ${area} steradians`);
});

for (const [index, orbit] of ORBITS.entries()) {
    test(`satellite ${index + 1} illuminates the visible globe along its own orbit`, () => {
        let visible = 0;
        for (let seconds = 0; seconds < orbit.period; seconds += 0.25) {
            const pass = observationPass(orbit, seconds);
            if (!pass) continue;
            visible++;
            assert.ok(pass.opacity > 0 && pass.opacity <= 1);
            assert.ok(pass.swath.length > 0);
            for (const point of [...pass.edge, ...pass.swath.flatMap(slice => slice.points)]) {
                assert.ok(point.z > 0, 'The scan must not appear on the far side.');
                assert.ok(point.x ** 2 + point.y ** 2 <= 1 + 1e-12, 'The swath must stay inside the globe.');
                assert.ok(Math.abs(point.x ** 2 + point.y ** 2 + point.z ** 2 - 1) < 1e-12);
            }
            const theta = orbit.phase + seconds * Math.PI * 2 / orbit.period;
            const x = 1.32 * (Math.cos(theta) * Math.cos(orbit.tilt) - orbit.ratio * Math.sin(theta) * Math.sin(orbit.tilt));
            const y = 1.32 * (Math.cos(theta) * Math.sin(orbit.tilt) + orbit.ratio * Math.sin(theta) * Math.cos(orbit.tilt));
            assert.ok(Math.hypot(pass.satellite.x - x, pass.satellite.y - y) < 1e-12);
        }
        assert.ok(visible > 0 && visible < orbit.period / 0.25 / 2, 'The beam must be limited to the front of the globe.');
        const back = (Math.PI * 1.5 - orbit.phase) * orbit.period / (Math.PI * 2);
        assert.equal(observationPass(orbit, back), null);
        const middle = (Math.PI * 0.5 - orbit.phase) * orbit.period / (Math.PI * 2);
        const first = observationPass(orbit, middle), next = observationPass(orbit, middle + orbit.period);
        assert.ok(Math.hypot(first.ground.x - next.ground.x, first.ground.y - next.ground.y) < 1e-12);
        for (const angle of [0.12001, Math.PI - 0.12001]) {
            const pass = observationPass(orbit, (angle - orbit.phase) * orbit.period / (Math.PI * 2));
            assert.ok(pass.opacity < 0.001, 'The observation pass must fade in and out.');
        }
    });
}
