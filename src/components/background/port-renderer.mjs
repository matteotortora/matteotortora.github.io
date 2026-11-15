import { createPortModel, createPortVehicle } from './port-model.mjs';
import { ENERGY_ROUTES, projectPortPoint, pointOnRoute, portVehicle, energyPhase, waterPhase } from './port-motion.mjs';

const MODEL = createPortModel();
const VEHICLE = createPortVehicle();
const SHORE = ENERGY_ROUTES.find(route => route.id === 'shore-power');
const WAVES = [[-4.5,1.8],[-4.3,2.7],[-4.1,3.55],[-3.6,4.3],[-2.1,4.4],[-0.2,4.45],[1.9,4.35],[3.8,3.65],[4,2.8],[3.7,1.75]];

function trace(context, points, project, close = false) {
    context.beginPath();
    points.forEach((point,index) => {
        const p = project(point);
        if (index) context.lineTo(p.x,p.y);
        else context.moveTo(p.x,p.y);
    });
    if (close) context.closePath();
}

function paintCommands(context, commands, project, scale) {
    context.lineJoin = 'round';
    context.lineCap = 'round';
    for (const command of commands) {
        if (command.kind === 'tree') {
            const p = project(command.point), radius = command.radius * scale;
            const leaf = context.createRadialGradient(p.x+radius*0.3,p.y-radius*0.4,radius*0.1,p.x,p.y,radius*1.25);
            leaf.addColorStop(0,'#bdcfae'); leaf.addColorStop(1,'#95b395');
            context.fillStyle = leaf;
            context.beginPath(); context.ellipse(p.x,p.y,radius,radius*1.25,0,0,Math.PI*2); context.fill();
            continue;
        }
        if (command.softness) {
            context.save();
            context.shadowColor = command.fill;
            context.shadowBlur = command.softness*scale;
            context.shadowOffsetY = 1;
        }
        trace(context,command.points,project,command.kind === 'polygon');
        if (command.fill) {
            let fill = command.fill;
            if (Array.isArray(fill)) {
                const start = project(command.points[0]), end = project(command.points[2]);
                const gradient = context.createLinearGradient(start.x,start.y,end.x,end.y);
                gradient.addColorStop(0,fill[0]); gradient.addColorStop(1,fill[1]);
                fill = gradient;
            }
            context.fillStyle = fill; context.fill();
        }
        if (command.stroke) {
            context.strokeStyle = command.stroke;
            context.lineWidth = command.width;
            context.stroke();
        }
        if (command.softness) context.restore();
    }
}

function paintSun(context,width,height) {
    const x = width * 0.85, y = height * 0.14, radius = width * 0.033;
    const halo = context.createRadialGradient(x,y,radius*0.6,x,y,radius*3.5);
    halo.addColorStop(0,'rgba(218, 174, 86, 0.23)'); halo.addColorStop(1,'rgba(218, 174, 86, 0)');
    context.fillStyle = halo;
    context.beginPath(); context.arc(x,y,radius*3.5,0,Math.PI*2); context.fill();
    const disc = context.createLinearGradient(x-radius,y-radius,x+radius,y+radius);
    disc.addColorStop(0,'#f5e8b7'); disc.addColorStop(1,'#dbb16d');
    context.fillStyle = disc;
    context.beginPath(); context.arc(x,y,radius,0,Math.PI*2); context.fill();
}

function paintGround(context,width,height,project,scale) {
    paintSun(context,width,height);
    context.save();
    context.shadowColor = 'rgba(53, 88, 82, 0.15)';
    context.shadowBlur = 18; context.shadowOffsetY = 7;
    trace(context,[[-5,-0.19,-4],[5,-0.19,-4],[5,-0.19,4.8],[-5,-0.19,4.8]],project,true);
    context.fillStyle = '#edf1ed'; context.fill();
    context.restore();
    paintCommands(context,MODEL.ground,project,scale);
}

function paintForeground(context,project,scale) {
    let cablePainted = false;
    for (const group of MODEL.groups) {
        if (!cablePainted && group.depth > 0.6) {
            trace(context,SHORE.points,project);
            context.strokeStyle = '#86a98e'; context.lineWidth = 2.1; context.stroke();
            cablePainted = true;
        }
        paintCommands(context,group.commands,project,scale);
    }
}

function paintWater(context,seconds,project,scale) {
    WAVES.forEach(([x,z],index) => {
        const wave = waterPhase(seconds,index);
        const drift = wave * 0.075;
        trace(context,[[x+drift,-0.135,z],[x+0.32+drift,-0.135,z+wave*0.015],[x+0.65+drift,-0.135,z]],project);
        context.strokeStyle = `rgba(226, 244, 245, ${0.3+wave*0.09})`;
        context.lineWidth = Math.max(0.65,scale*0.021); context.stroke();
    });
}

function paintEnergy(context,seconds,project,shoreOnly = false) {
    context.save();
    context.lineCap = 'round';
    for (const route of ENERGY_ROUTES) {
        if ((route.id === 'shore-power') !== shoreOnly) continue;
        const count = shoreOnly ? 1 : 2;
        for (let index = 0; index < count; index++) {
            const phase = energyPhase(seconds,route,index);
            const trail = Array.from({length:7},(_,step) => pointOnRoute(route.points,Math.max(0,phase-(6-step)*0.007)));
            trace(context,trail,project);
            context.strokeStyle = shoreOnly ? 'rgba(189, 155, 77, 0.9)' : 'rgba(88, 147, 121, 0.82)';
            context.lineWidth = shoreOnly ? 2.3 : 1.65; context.stroke();
            const head = project(pointOnRoute(route.points,phase));
            context.shadowColor = 'rgba(217, 180, 96, 0.65)'; context.shadowBlur = 6;
            context.fillStyle = '#c1a05e';
            context.beginPath(); context.arc(head.x,head.y,shoreOnly ? 2.25 : 1.7,0,Math.PI*2); context.fill();
            context.shadowBlur = 0;
        }
    }
    context.restore();
}

function paintVehicle(context,seconds,project,scale) {
    const vehicle = portVehicle(seconds);
    const transform = ([x,y,z]) => [vehicle.x+x*Math.cos(vehicle.yaw)-z*Math.sin(vehicle.yaw),y,vehicle.z+x*Math.sin(vehicle.yaw)+z*Math.cos(vehicle.yaw)];
    const vehicleProject = point => project(transform(point));
    context.save();
    trace(context,[[-0.36,0.025,-0.15],[0.44,0.025,-0.15],[0.44,0.025,0.25],[-0.36,0.025,0.25]],vehicleProject,true);
    context.fillStyle = 'rgba(68, 96, 83, 0.12)'; context.fill();
    paintCommands(context,VEHICLE,vehicleProject,scale);
    if (vehicle.charging) {
        const p = vehicleProject([0.15,0.45,0]);
        context.fillStyle = 'rgba(112, 159, 124, 0.65)';
        context.beginPath(); context.arc(p.x,p.y,1,0,Math.PI*2); context.fill();
    }
    context.restore();
}

export function createPortPainter(canvas) {
    const context = canvas.getContext('2d');
    const back = document.createElement('canvas'), front = document.createElement('canvas');
    const backContext = back.getContext('2d'), frontContext = front.getContext('2d');
    if (!context || !backContext || !frontContext) return null;
    let width = 1, height = 1, ratio = 1, cachedPointer = null;
    function resize(nextWidth,nextHeight,nextRatio) {
        width = nextWidth; height = nextHeight; ratio = nextRatio;
        for (const surface of [canvas,back,front]) {
            surface.width = Math.max(1,Math.round(width*ratio));
            surface.height = Math.max(1,Math.round(height*ratio));
            surface.getContext('2d').setTransform(ratio,0,0,ratio,0,0);
        }
        cachedPointer = null;
    }
    function paint(seconds,pointer) {
        const dirty = !cachedPointer || Math.hypot(pointer.x-cachedPointer.x,pointer.y-cachedPointer.y) > 0.0015;
        if (dirty) {
            cachedPointer = {...pointer};
            const project = point => projectPortPoint(point,width,height,cachedPointer);
            backContext.clearRect(0,0,width,height); frontContext.clearRect(0,0,width,height);
            paintGround(backContext,width,height,project,width/18.3);
            paintForeground(frontContext,project,width/18.3);
        }
        const project = point => projectPortPoint(point,width,height,cachedPointer);
        context.clearRect(0,0,width,height);
        context.drawImage(back,0,0,width,height);
        paintWater(context,seconds,project,width/18.3);
        paintEnergy(context,seconds,project);
        paintVehicle(context,seconds,project,width/18.3);
        context.drawImage(front,0,0,width,height);
        paintEnergy(context,seconds,project,true);
    }
    return { resize, paint, dispose() { back.width = 1; back.height = 1; front.width = 1; front.height = 1; } };
}
