import React from 'react';
import Terminal from './Terminal';
import PageSection from '../PageSection';
import service from '../../info/service.json';
import Style from './Services.module.scss';

export default function Services({ innerRef }) {
    return (
        <PageSection id="services" title="Academic Service" innerRef={innerRef}>
            <Terminal text={
                <div className={Style.content}>
                    <p className={Style.intro}>{service.intro}</p>
                    {service.groups.map(group => (
                        <div key={group.id} className={Style.group}>
                            <h3 className={Style.heading}>{group.title}</h3>
                            <ul className={Style.list}>
                                {group.items.map(item => {
                                    const name = item.italic ? <em>{item.name}</em> : item.name;
                                    return (
                                        <li key={`${item.role}-${item.name}`}>
                                            <strong>{item.role}</strong>{' — '}
                                            {item.url ? (
                                                <a href={item.url} target="_blank" rel="noopener noreferrer"
                                                   aria-label={`${item.name} (opens in a new tab)`}>{name}</a>
                                            ) : name}
                                            {item.context && `, ${item.context}`}
                                            {item.years && <> <span aria-hidden="true">·</span> <span className={Style.years}>{item.years}</span></>}
                                            {item.subject && <span className={Style.detail}>Special Issue: <em>{item.subject}</em>.</span>}
                                            {item.detail && <span className={Style.detail}>{item.detail}</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                    <details className={`${Style.group} ${Style.review}`}>
                        <summary>Peer Review <span className={Style.reviewCount}>({service.peerReview.journals.length} journals · {service.peerReview.conferences.length} conferences)</span></summary>
                        <h4 className={Style.subheading}>International Journals</h4>
                        <ul className={Style.list}>
                            {service.peerReview.journals.map(name => <li key={name}>{name}</li>)}
                        </ul>
                        <h4 className={Style.subheading}>International Conferences</h4>
                        <ul className={Style.list}>
                            {service.peerReview.conferences.map(name => <li key={name}>{name}</li>)}
                        </ul>
                    </details>
                </div>
            } />
        </PageSection>
    );
}
