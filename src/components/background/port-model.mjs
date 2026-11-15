import { ENERGY_ROUTES } from './port-motion.mjs';

export function createPortModel() {
    const ground = [], groups = [];
    let commands = ground;
    const polygon = (points, fill, stroke, width = 0.55, softness = 0) => commands.push({ kind: 'polygon', points, fill, stroke, width, softness });
    const line = (points, stroke, width = 0.7) => commands.push({ kind: 'line', points, stroke, width });
    function box(x, z, w, d, h, y = 0, colors = [['#f2f1e8','#dce6db'], ['#cedbd0','#a5bdb0'], ['#a9c1b4','#7e9f92']]) {
        polygon([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]], colors[0], 'rgba(113, 145, 132, 0.28)');
        polygon([[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]], colors[2]);
        polygon([[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]], colors[1]);
    }
    function object(depth, draw) {
        commands = [];
        draw();
        groups.push({ depth, commands });
        commands = ground;
    }
    function shadow(x, z, w, d, height = 1) {
        polygon([[x+0.08,0.014,z+0.06],[x+w+height*0.25,0.014,z+0.06],
            [x+w+height*0.25,0.014,z+d+height*0.55],[x+0.08,0.014,z+d+height*0.55]], 'rgba(45, 79, 67, 0.12)', undefined, 0.5, 0.18);
        polygon([[x-0.02,0.015,z-0.02],[x+w+0.1,0.015,z-0.02],
            [x+w+0.1,0.015,z+d+0.09],[x-0.02,0.015,z+d+0.09]], 'rgba(45, 79, 67, 0.09)', undefined, 0.5, 0.05);
    }
    function panels(x, z, roofHeight, cols, rows, rowStep = 0.36, moduleDepth = 0.28) {
        const heightAt = typeof roofHeight === 'function' ? roofHeight : () => roofHeight;
        for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
            const a = x + col * 0.65, b = z + row * rowStep;
            const point = (u, v) => [a+u*0.57,heightAt(b+v*moduleDepth)+0.045+v*0.025,b+v*moduleDepth];
            for (const u of [0.12, 0.88]) line([[a+u*0.57,heightAt(b+moduleDepth*0.8),b+moduleDepth*0.8],point(u,0.82)], '#748e91', 0.6);
            polygon([point(0,0),point(1,0),point(1,1),point(0,1)], ['#365d78', '#193c56'], '#cedee3', 0.7);
            for (const u of [0.33, 0.66]) line([point(u,0),point(u,1)], 'rgba(184, 209, 220, 0.55)', 0.38);
            line([point(0,0.5),point(1,0.5)], 'rgba(184, 209, 220, 0.55)', 0.38);
        }
    }
    function container(x, z, y, w = 0.82, d = 0.5, h = 0.38, colors = ['#d7e0d5','#bacdbd','#a2baac']) {
        box(x,z,w,d,h,y,colors);
        for (let a = 0.12; a < w-0.07; a += 0.16) line([[x+a,y+0.06,z+d+0.006],[x+a,y+h-0.06,z+d+0.006]], '#dce5dd', 0.4);
    }

    box(-5,1.2,10,3.6,0.06,-0.2,[['#b8d7df','#76aabb'],'#84b2c2','#6496ab']);
    box(-5,-4,10,5.2,0.2,-0.2,[['#e4e9df','#cddbd0'],'#b8cabe','#91ac9d']);
    polygon([[-4.85,0.004,-1.55],[4.85,0.004,-1.55],[4.85,0.004,-0.72],[-4.85,0.004,-0.72]], '#d5dfe0');
    polygon([[-0.95,0.006,-3.85],[-0.25,0.006,-3.85],[-0.25,0.006,0.9],[-0.95,0.006,0.9]], '#d5dfe0');
    for (const x of [-4.4,-3.5,-2.6,-1.7,0.3,1.2,2.1,3,3.9]) line([[x,0.008,-1.14],[x+0.4,0.008,-1.14]], '#f4f7f4', 0.9);
    for (const z of [-3.4,-2.5,-0.5,0.35]) line([[-0.6,0.009,z],[-0.6,0.009,z+0.36]], '#f4f7f4', 0.9);
    line([[-4.9,0.012,1.09],[4.9,0.012,1.09]], '#d1bc7f', 0.9);
    for (const route of ENERGY_ROUTES) {
        if (route.id === 'shore-power') continue;
        line(route.points, 'rgba(98, 159, 136, 0.65)', 1.3);
        line(route.points, 'rgba(219, 235, 205, 0.65)', 0.45);
    }

    const buildings = [[-4.3,-3.4,2.9,1.65,1.18],[-4.3,-0.48,2.5,1.32,1.04]];
    buildings.forEach(([x,z,w,d,h], index) => {
        shadow(x,z,w,d,h);
        box(x-0.08,z-0.08,w+0.16,d+0.16,0.045,0,['#eff2ec','#dbe4db','#cad8cd']);
        object(x+w/2+z+d/2, () => {
            box(x,z,w,d,h);
            for (const a of [0.35,1.15]) {
                polygon([[x+a,0.08,z+d+0.008],[x+a+0.48,0.08,z+d+0.008],
                    [x+a+0.48,0.65,z+d+0.008],[x+a,0.65,z+d+0.008]], ['#8fa8ad','#68858c']);
                for (const y of [0.22,0.38,0.54]) line([[x+a,y,z+d+0.012],[x+a+0.48,y,z+d+0.012]], '#d2dedd', 0.4);
            }
            const ridge = z+d/2, lift = 0.28;
            polygon([[x,h,z],[x+w,h,z],[x+w,h+lift,ridge],[x,h+lift,ridge]], ['#f2f1e6','#d9e2d7']);
            polygon([[x,h+lift,ridge],[x+w,h+lift,ridge],[x+w,h,z+d],[x,h,z+d]], ['#dce5d9','#afc5b7']);
            polygon([[x+w,h,z],[x+w,h+lift,ridge],[x+w,h,z+d]], ['#e5e8d7','#b8cbb4']);
            line([[x,h+0.015,z+d],[x+w,h+0.015,z+d]], '#eaf0e6', 1);
            polygon([[x+0.2,h-0.29,z+d+0.01],[x+w-0.2,h-0.29,z+d+0.01],
                [x+w-0.2,h-0.13,z+d+0.01],[x+0.2,h-0.13,z+d+0.01]], ['#688b92','#426974']);
            const roofHeight = position => h+lift*(1-(position-ridge)/(d/2));
            if (index === 0) panels(-4.05,ridge+0.07,roofHeight,4,2);
            if (index === 1) panels(-4.05,ridge+0.035,roofHeight,3,2,0.32,0.25);
        });
    });
    shadow(2.7,-3.1,1.8,0.73);
    object(0.9, () => {
        box(2.7,-3.1,0.85,0.73,0.66,0,['#e1e9df','#b8cdbe','#9eb8a7']);
        for (const x of [3.8,4.22]) {
            box(x,-3.1,0.3,0.65,0.64,0,['#e7ece5','#c4d4c8','#b0c7b8']);
            line([[x+0.05,0.43,-2.443],[x+0.24,0.43,-2.443]], '#79a58c', 0.9);
        }
    });
    for (const [x,z,colors] of [[4,-0.3,[['#adbfc3','#819fa7'],'#77959d','#557c88']]]) {
        shadow(x,z,0.82,0.5);
        object(x+z+0.66, () => container(x,z,0,0.82,0.5,0.45,colors));
    }
    polygon([[-3.1,-0.132,2.1],[2.9,-0.132,2.1],[3.75,-0.132,3.13],[2.9,-0.132,4.18],[-3.1,-0.132,4.18]], 'rgba(25, 66, 83, 0.2)', undefined, 0.5, 0.17);
    object(3.2, () => {
        const outline = [[-3.25,2.02],[2.7,2.02],[3.55,2.98],[2.7,3.97],[-3.25,3.97]];
        polygon(outline.map(([x,z]) => [x,0.52,z]), ['#dce5e0','#aebfb9'], '#8ea6aa');
        outline.forEach((a,index) => {
            const b = outline[(index+1)%outline.length];
            if ((a[1] === 3.97 && b[1] === 3.97) || (a[0] >= 2.7 && b[0] >= 2.7)) {
                const hull = a[1] === b[1] ? ['#3a6276','#193b50'] : ['#7396a5','#3b667b'];
                polygon([[a[0],-0.12,a[1]],[b[0],-0.12,b[1]],[b[0],0.52,b[1]],[a[0],0.52,a[1]]], hull);
                line([[a[0],0.1,a[1]],[b[0],0.1,b[1]]], '#99b9c4', 0.8);
                line([[a[0],0.54,a[1]],[b[0],0.54,b[1]]], '#d5e1df', 0.8);
            }
        });
        box(-2.91,2.35,1.05,1.26,0.72,0.52);
        box(-2.81,2.43,0.84,1.09,0.25,1.24,[['#e7eeea','#c6d8d1'],['#688d9b','#426b7e'],['#476e80','#315368']]);
        box(-2.91,2.35,1.05,1.26,0.045,1.49,[['#e6eee7','#c7d9d0'],'#a6bfb5','#93afa4']);
        line([[-2.41,1.54,2.88],[-2.41,1.88,2.88]], '#72918f', 0.8);
        line([[-2.62,1.77,2.88],[-2.2,1.77,2.88]], '#72918f', 0.8);
        const cargo = [[-1.48,2.33],[-1.48,3.05],[-0.22,2.33],[-0.22,3.05]].sort((a,b) => a[0]+a[1]-b[0]-b[1]);
        for (const [x,z] of cargo) container(x,z,0.52,1.05,0.59,0.4,[['#d8d3b6','#b9bea0'],'#a9b493','#879f83']);
        box(-1.25,2.02,0.18,0.15,0.16,0.52,['#dce6df','#a9c2b1','#90ad99']);
        for (const x of [-3.05,-1.7,-0.35,1,2.35]) line([[x,0.54,3.97],[x,0.69,3.97]], '#c1d4d7', 0.55);
        line([[-3.05,0.69,3.97],[2.35,0.69,3.97]], '#b0c9cf', 0.55);
    });
    // The legs sit behind the vessel; the outreach beam and cable sit above it.
    const crane = [['#d2bf8e','#b9a572'],['#b7a574','#9d8e60'],['#9d9369','#7f805d']];
    for (const x of [0.65,1.85]) object(x+0.25+1.25, () => box(x,0.25,0.16,0.22,2.5,0,crane));
    object(5.2, () => {
        line([[0.73,0.2,0.475],[1.93,2.45,0.475]], '#a09970', 1.45);
        box(0.55,0.23,1.6,0.25,0.18,2.5,crane);
        box(1.27,-0.2,0.16,3.4,0.16,2.69,crane);
        for (let z = 0.1; z < 3.05; z += 0.48) line([[1.35,2.85,z],[1.35,2.69,z+0.4]], '#938b66', 0.65);
        box(1.72,0.16,0.48,0.43,0.36,2.12,[['#d2d7cb','#aebfb3'],'#6a8d94','#496e7c']);
        line([[1.35,2.69,2.87],[1.35,1.14,2.87]], '#71918f', 0.8);
        line([[1.28,1.14,2.87],[1.35,1.06,2.87],[1.42,1.14,2.87]], '#5e827e', 0.9);
    });
    object(0.05, () => box(-1.3,0.85,0.23,0.2,0.27,0,['#dce6df','#a9c2b1','#90ad99']));
    for (const x of [-4.3,-3.3,-0.1,2.35,4.5]) object(x+1.03+0.1, () => box(x,1.03,0.09,0.1,0.1,0,['#a0b5af','#88a49c','#74948c']));
    object(0.25, () => box(1.94,-1.94,0.13,0.19,0.4,0,['#e1e9e0','#b7ceb9','#98b39f']));
    for (const [x,z] of [[-4.65,-3.62],[4.5,-3.6]]) object(x+z+0.65, () => {
        box(x-0.025,z-0.025,0.05,0.05,0.45,0,['#adb39d','#99a78d','#8ca080']);
        commands.push({ kind: 'tree', point: [x,0.65,z], radius: 0.23 });
    });
    return { ground, groups: groups.sort((a,b) => a.depth-b.depth) };
}

export function createPortVehicle() {
    const parts = [];
    function box(x,z,w,d,h,y,colors) {
        parts.push({kind:'polygon',points:[[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]],fill:colors[0]});
        parts.push({kind:'polygon',points:[[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]],fill:colors[2]});
        parts.push({kind:'polygon',points:[[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]],fill:colors[1]});
    }
    box(-0.36,-0.15,0.72,0.3,0.17,0.06,['#e4ece7','#a3bdb1','#86a99d']);
    box(0.1,-0.14,0.23,0.28,0.18,0.23,['#bfd2d4','#95b0b7','#7f9fa9']);
    box(-0.31,-0.12,0.34,0.24,0.11,0.23,['#d2dfd7','#adc5b5','#99b6a6']);
    return parts;
}
