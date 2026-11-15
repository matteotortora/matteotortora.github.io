import React from 'react';
import Style from './PageSection.module.scss';

export default function PageSection({ id, title, innerRef, children }) {
    return (
        <section ref={innerRef} id={id} tabIndex={-1}
                 aria-labelledby={`${id}-title`} className={Style.section}>
            <h2 id={`${id}-title`} className={Style.title}>{title}</h2>
            {children}
        </section>
    );
}
