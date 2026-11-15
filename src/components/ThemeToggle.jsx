import React, { useState } from 'react';
import Style from './ThemeToggle.module.scss';

export default function ThemeToggle({ darkMode, onToggle, className = '' }) {
    const [animating, setAnimating] = useState(false);
    return (
        <button type="button" aria-label="Dark mode" aria-pressed={darkMode}
                title={darkMode ? 'Use light mode' : 'Use dark mode'}
                className={`${Style.button} ${darkMode ? Style.isDark : ''} ${className}`}
                onClick={() => { setAnimating(true); onToggle(); }}>
            <span className={Style.sky} aria-hidden="true">
                <svg className={Style.sun} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
                <svg className={Style.moon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.7 13.2A8.8 8.8 0 0 1 10.8 3.3a8.8 8.8 0 1 0 9.9 9.9Z" />
                </svg>
                <span className={`${Style.blind} ${animating ? Style.sweep : ''}`}
                      onAnimationEnd={() => setAnimating(false)} />
            </span>
        </button>
    );
}
