import React from 'react';
import PageSection from '../PageSection';
import news from '../../info/news.json';
import publications from '../../info/publications.json';
import Style from './News.module.scss';

const month = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const publicationsById = new Map(publications.map(publication => [publication.id, publication]));

export default function News({ innerRef }) {
    return (
        <PageSection id="news" title="News" innerRef={innerRef}>
            <div className={Style.card}>
                <ol className={Style.list} role="list">
                    {news.map(item => (
                        <li key={item.id} className={Style.item}>
                            <time dateTime={item.date} className={Style.date}>
                                {month.format(new Date(`${item.date}-01T00:00:00Z`))}
                            </time>
                            <p className={Style.text}>
                                <span className={Style.emoji} aria-hidden="true">{item.emoji}</span>
                                {item.content.map((part, index) => {
                                    if (typeof part === 'string') return part;
                                    const publication = publicationsById.get(part.publicationId);
                                    const label = part.text ?? publication?.title;
                                    const text = part.italic ? <em>{label}</em> : label;
                                    const url = publication ?
                                        (publication.links.find(link => link.label === 'Paper') || publication.links[0]).url : part.url;
                                    return url ? (
                                        <a key={index} href={url} target="_blank" rel="noopener noreferrer"
                                           aria-label={`${label} (opens in a new tab)`}>{text}</a>
                                    ) : <React.Fragment key={index}>{text}</React.Fragment>;
                                })}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </PageSection>
    );
}
