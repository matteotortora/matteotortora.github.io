import React from 'react';
import Style from './BackgroundMotionControl.module.scss';

export default function BackgroundMotionControl({visible,paused,onToggle}) {
    if (!visible) return null;
    const label = paused ? 'Resume background animation' : 'Pause background animation';
    return (
        <button type="button" className={Style.control} aria-pressed={paused}
                aria-label={label} title={label} onClick={onToggle}>
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                {paused ? <path d="m9 5 11 7-11 7z"/> : <path d="M7 5h3v14H7zm7 0h3v14h-3z"/>}
            </svg>
        </button>
    );
}
