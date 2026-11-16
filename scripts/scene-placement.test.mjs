import assert from 'node:assert/strict';
import test from 'node:test';
import { fitSceneInSlot, inlineSceneVisibility } from '../src/components/background/scene-placement.mjs';

test('responsive illustrations stay centered and wholly inside their reserved area', () => {
    for (const [width,height] of [[288,224],[358,224],[600,276],[728,320],[200,120]]) {
        const slot = {left:16,top:680,width,height};
        for (const aspect of [1,4/3]) {
            const scene = fitSceneInSlot(slot,aspect);
            assert.ok(scene.left >= slot.left && scene.top >= slot.top);
            assert.ok(scene.left+scene.width <= slot.left+slot.width+1e-9);
            assert.ok(scene.top+scene.height <= slot.top+slot.height+1e-9);
            assert.ok(Math.abs(scene.width/scene.height-aspect) < 1e-9);
            assert.ok(Math.abs(scene.left+scene.width/2-slot.left-slot.width/2) < 1e-9);
            assert.ok(Math.abs(scene.top+scene.height/2-slot.top-slot.height/2) < 1e-9);
        }
    }
    assert.equal(fitSceneInSlot({left:0,top:0,width:0,height:0},1),null);
    assert.equal(fitSceneInSlot(null,1),null);
});

test('inline scenes follow document scrolling and fade only as their own area leaves view', () => {
    const top = fitSceneInSlot({left:20,top:720,width:300,height:225},4/3);
    const scrolled = fitSceneInSlot({left:20,top:420,width:300,height:225},4/3);
    assert.equal(top.top-scrolled.top,300);
    assert.equal(inlineSceneVisibility({top:900,height:225},844),0);
    assert.equal(inlineSceneVisibility({top:400,height:225},844),1);
    assert.equal(inlineSceneVisibility({top:-200,height:225},844),0);
    const fade = inlineSceneVisibility({top:-100,height:225},844);
    assert.ok(fade > 0 && fade < 1);
});
