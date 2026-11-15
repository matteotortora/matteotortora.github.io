import React, { useId } from 'react';
import Style from './Card.module.scss';
import FigurePreview from './FigurePreview';

export default function Card({ id, imagePath, imageAlt = '', title, authors, venue, year, status, links }) {
    const titleId = useId();
    const authorList = authors.split(',').map(author => author.trim());
    return (
        <article id={`publication-${id}`} tabIndex={-1}
                 className={`${Style.card} ${imagePath ? '' : Style.textOnly}`} aria-labelledby={titleId}>
            {imagePath && <div className={Style.imageContainer}>
                <FigurePreview imagePath={imagePath} imageAlt={imageAlt} title={title} />
            </div>}
            <div className={Style.content}>
                <p className={Style.venue}>
                    {venue} <span aria-hidden="true">·</span> {year}
                    {status === 'accepted' && <span className={Style.status}>Accepted</span>}
                </p>
                <h3 id={titleId} className={Style.title}>{title}</h3>
                <p className={Style.authors}>
                    {authorList.map((author, index) => (
                        <React.Fragment key={index}>
                            {author === 'Matteo Tortora' ? <strong>{author}</strong> : author}
                            {index < authorList.length - 1 ? ', ' : ''}
                        </React.Fragment>
                    ))}
                </p>
                <ul className={Style.links}>
                    {links?.map(link => (
                        <li key={link.url}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer"
                               aria-label={`${link.label} — ${title} (opens in a new tab)`}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}
