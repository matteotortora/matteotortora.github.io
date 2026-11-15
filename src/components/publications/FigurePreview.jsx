import React, { useId, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import Style from './FigurePreview.module.scss';

export default function FigurePreview({ imagePath, imageAlt, title }) {
    const [open, setOpen] = useState(false);
    const labelId = useId();
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    return (
        <>
            <button type="button" className={Style.trigger} onClick={() => setOpen(true)}
                    aria-label={`Enlarge figure — ${title}`} aria-haspopup="dialog" aria-expanded={open}>
                <img src={imagePath} alt={imageAlt} className={Style.preview} loading="lazy" decoding="async" />
                <span className={Style.zoomIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                         strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="10" cy="10" r="6" />
                        <path d="m14.5 14.5 6 6M7 10h6M10 7v6" />
                    </svg>
                </span>
            </button>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg"
                    aria-labelledby={labelId} transitionDuration={reduceMotion ? 0 : 150}
                    PaperProps={{ 'aria-modal': true, sx: {
                        backgroundColor: 'var(--surface-bg)', color: 'var(--text-color)',
                        borderRadius: '0.65rem', margin: '1rem', width: 'calc(100% - 2rem)',
                        maxHeight: 'calc(100dvh - 2rem)',
                    } }}>
                <div className={Style.header}>
                    <h2 id={labelId} className={Style.title}>{title}</h2>
                    <button type="button" autoFocus className={Style.close}
                            aria-label="Close enlarged figure" onClick={() => setOpen(false)}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className={Style.body}>
                    <img src={imagePath} alt={imageAlt || title} className={Style.expanded} decoding="async" />
                </div>
            </Dialog>
        </>
    );
}
