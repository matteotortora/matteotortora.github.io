import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { geoArea } from 'd3-geo';
import { homeVisibility, motionState } from '../src/components/background/scene-settings.mjs';

test('background motion requires a visible home, an active tab and permission to animate', () => {
    const allowed = { hidden: false, visibility: 1, reducedMotion: false, compact: false, paused: false };
    assert.equal(motionState(allowed), 'running');
    for (const restriction of [
        { hidden: true }, { visibility: 0 }, { reducedMotion: true }, { compact: true }, { paused: true },
    ]) assert.notEqual(motionState({ ...allowed, ...restriction }), 'running');
    assert.equal(motionState({ ...allowed, paused: true }), 'paused');
    assert.equal(motionState({ ...allowed, reducedMotion: true }), 'reduced');
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
