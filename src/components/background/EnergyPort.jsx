import React, { useEffect, useRef, useState } from 'react';
import { createPortScene } from './port-scene.mjs';
import BackgroundMotionControl from './BackgroundMotionControl';
import Style from './EnergyPort.module.scss';

export default function EnergyPort({paused,onTogglePause}) {
    const root = useRef(null), canvas = useRef(null), scene = useRef(null);
    const [showControl,setShowControl] = useState(false);
    useEffect(() => {
        const controller = createPortScene({root:root.current,canvas:canvas.current,onControlVisibility:setShowControl});
        scene.current = controller;
        return () => { controller.dispose(); scene.current = null; };
    },[]);
    useEffect(() => { scene.current?.setPaused(paused); },[paused]);
    return (
        <>
            <div ref={root} className={Style.scene} aria-hidden="true" data-motion="loading" data-background="energy-port">
                <canvas ref={canvas} className={Style.canvas}/>
            </div>
            <BackgroundMotionControl visible={showControl} paused={paused} onToggle={onTogglePause}/>
        </>
    );
}
