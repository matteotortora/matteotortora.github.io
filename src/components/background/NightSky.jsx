import React, { useEffect, useRef, useState } from 'react';
import { createOrbitalScene } from './orbital-scene.mjs';
import Style from './NightSky.module.scss';
import BackgroundMotionControl from './BackgroundMotionControl';

export default function NightSky({paused,onTogglePause}) {
    const root = useRef(null);
    const stars = useRef(null);
    const globe = useRef(null);
    const scene = useRef(null);
    const [showControl, setShowControl] = useState(false);

    useEffect(() => {
        const controller = createOrbitalScene({
            root: root.current, starsCanvas: stars.current, globeCanvas: globe.current,
            onControlVisibility: setShowControl,
        });
        scene.current = controller;
        return () => { controller.dispose(); scene.current = null; };
    }, []);

    useEffect(() => { scene.current?.setPaused(paused); }, [paused]);

    return (
        <>
            <div ref={root} className={Style.scene} aria-hidden="true" data-motion="loading" data-background="orbital">
                <canvas ref={stars} className={Style.stars} />
                <canvas ref={globe} className={Style.globe} />
            </div>
            <BackgroundMotionControl visible={showControl} paused={paused} onToggle={onTogglePause}/>
        </>
    );
}
