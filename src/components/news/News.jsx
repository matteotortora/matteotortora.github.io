import React from 'react';
import PageSection from '../PageSection';
import news from '../../info/news.json';
import publications from '../../info/publications.json';
import Style from './News.module.scss';

const month = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const publicationsById = new Map(publications.map(publication => [publication.id, publication]));

const RECENT_NEWS_COUNT = 5;

function NewsList({ items, label, start = 1 }) {
    return (
                <ol className={Style.list} role="list" aria-label={label} start={start}>
                    {items.map(item => (
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
    );
}

export default function News({ innerRef }) {
    const recent = news.slice(0, RECENT_NEWS_COUNT);
    const older = news.slice(RECENT_NEWS_COUNT);
    return (
        <PageSection id="news" title="News" innerRef={innerRef}>
            <div className={Style.card}>
                <NewsList items={recent} label="Recent news" />
                {older.length > 0 && (
                    <details className={Style.archive}>
                        <summary>Older News ({older.length})</summary>
                        <NewsList items={older} label="Older news" start={recent.length + 1} />
                    </details>
                )}
            </div>
        </PageSection>
    );
}
