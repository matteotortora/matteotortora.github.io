import React, { useEffect, useRef, useState } from 'react';
import { createOrbitalScene } from './orbital-scene.mjs';
import Style from './NightSky.module.scss';

export default function NightSky() {
    const root = useRef(null);
    const stars = useRef(null);
    const globe = useRef(null);
    const scene = useRef(null);
    const [paused, setPaused] = useState(false);
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
            <div ref={root} className={Style.scene} aria-hidden="true" data-motion="loading">
                <canvas ref={stars} className={Style.stars} />
                <canvas ref={globe} className={Style.globe} />
            </div>
            {showControl && (
                <button type="button" className={Style.motionControl} aria-pressed={paused}
                        aria-label={paused ? 'Resume background animation' : 'Pause background animation'}
                        title={paused ? 'Resume background animation' : 'Pause background animation'}
                        onClick={() => setPaused(value => !value)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                        {paused ? <path d="m9 5 11 7-11 7z" /> : <path d="M7 5h3v14H7zm7 0h3v14h-3z" />}
                    </svg>
                </button>
            )}
        </>
    );
}
