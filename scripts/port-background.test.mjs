import assert from 'node:assert/strict';
import test from 'node:test';
import { ENERGY_ROUTES, pointOnRoute, portVehicle, projectPortPoint } from '../src/components/background/port-motion.mjs';
import { createPortModel } from '../src/components/background/port-model.mjs';

test('the port is a single finite isometric scene with three equal-scale axes', () => {
    const origin = projectPortPoint([0,0,0],640,480);
    const lengths = [[1,0,0],[0,1,0],[0,0,1]].map(point => {
        const p = projectPortPoint(point,640,480);
        return Math.hypot(p.x-origin.x,p.y-origin.y);
    });
    assert.ok(Math.max(...lengths)-Math.min(...lengths) < 1e-10);
    const model = createPortModel();
    assert.ok(model.groups.length > 10);
    for (const command of [...model.ground,...model.groups.flatMap(group => group.commands)]) {
        assert.ok(['polygon','line','tree'].includes(command.kind));
        for (const point of command.points || [command.point]) assert.ok(point.every(Number.isFinite));
    }
});

test('energy pulses stay on their connected routes and shore power reaches the vessel', () => {
    const shore = ENERGY_ROUTES.find(route => route.id === 'shore-power');
    assert.ok(shore.points[0][2] < 1.2 && shore.points.at(-1)[2] > 2, 'Shore power must cross the water from the quay to the vessel.');
    assert.ok(shore.points.every(point => point[1] > -0.13), 'The cable must remain above the water.');
    for (const route of ENERGY_ROUTES) {
        assert.deepEqual(pointOnRoute(route.points,0),route.points[0]);
        assert.deepEqual(pointOnRoute(route.points,1),route.points.at(-1));
        for (let step = 0; step <= 100; step++) {
            const p = pointOnRoute(route.points,step/100);
            assert.ok(route.points.slice(1).some((b,index) => {
                const a = route.points[index];
                const length = Math.hypot(...b.map((value,axis) => value-a[axis]));
                const from = Math.hypot(...p.map((value,axis) => value-a[axis]));
                const to = Math.hypot(...p.map((value,axis) => value-b[axis]));
                return Math.abs(from+to-length) < 1e-9;
            }), 'An energy pulse must never jump between disconnected parts of a route.');
        }
    }
});

test('the electric vehicle stays on the road and turns without teleporting', () => {
    for (let seconds = 0; seconds <= 72; seconds += 0.1) {
        const vehicle = portVehicle(seconds);
        assert.ok(vehicle.x >= -4.4-1e-10 && vehicle.x <= 4+1e-10);
        assert.equal(vehicle.z,-1.14);
        assert.ok(Number.isFinite(vehicle.yaw));
    }
    for (const boundary of [0,12,14,26,30,34,36]) {
        const before = portVehicle(boundary-0.0001), after = portVehicle(boundary+0.0001);
        assert.ok(Math.abs(before.x-after.x) < 0.001);
        assert.ok(Math.abs(Math.sin(before.yaw)-Math.sin(after.yaw)) < 0.001);
        assert.ok(Math.abs(Math.cos(before.yaw)-Math.cos(after.yaw)) < 0.001);
    }
    assert.equal(portVehicle(28).charging,true);
    assert.equal(portVehicle(28).x,1.8);
    assert.deepEqual(portVehicle(7),portVehicle(43));
});
