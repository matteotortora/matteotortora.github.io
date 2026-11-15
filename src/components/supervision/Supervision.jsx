import React from 'react';
import PageSection from '../PageSection';
import Terminal from '../teaching/Terminal';
import supervision from '../../info/supervision.json';
import Style from './Supervision.module.scss';

function MentoringList({ people }) {
    return (
        <ul className={Style.entries}>
            {people.map(person => (
                <li key={person.name}>
                    <span className={Style.period}>{person.period}</span>
                    <div>
                        <strong>{person.profileUrl ? (
                            <a href={person.profileUrl} target="_blank" rel="noopener noreferrer"
                               aria-label={`${person.name} — ${person.profileLabel || 'LinkedIn'} (opens in a new tab)`}>{person.name}</a>
                        ) : person.name}</strong>
                        <span className={Style.detail}>{person.context}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function Supervision({ innerRef }) {
    return (
        <PageSection id="supervision" title="Supervision & Mentoring" innerRef={innerRef}>
            <Terminal text={
                <div className={Style.content}>
                    <p className={Style.intro}>{supervision.intro}</p>
                    <div className={Style.group}>
                        <h3 className={Style.heading}><span className={Style.emoji} aria-hidden="true">🎓</span>PhD Supervision</h3>
                        <p>{supervision.phd.program}, {supervision.phd.institution}.</p>
                        <ul className={Style.entries}>
                            {supervision.phd.candidates.map(person => (
                                <li key={person.name}>
                                    <span className={Style.period}>{person.period}</span>
                                    <div>
                                        <strong>{person.scholarUrl ? (
                                            <a href={person.scholarUrl} target="_blank" rel="noopener noreferrer"
                                               aria-label={`${person.name} — Google Scholar (opens in a new tab)`}>
                                                {person.name}
                                            </a>
                                        ) : person.name}</strong>, {person.cycle}
                                        <span className={Style.detail}>{person.topics.join(' · ')}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <details className={Style.disclosure}>
                            <summary><span className={Style.emoji} aria-hidden="true">🌱</span>Research Mentoring</summary>
                            <p>{supervision.mentoring.intro}</p>
                            <h4 className={Style.subheading}>PhD Researchers</h4>
                            <MentoringList people={supervision.mentoring.phd} />
                            <h4 className={Style.subheading}>Other Research Mentoring</h4>
                            <MentoringList people={supervision.mentoring.other} />
                        </details>
                    </div>
                    <div className={Style.group}>
                        <h3 className={Style.heading}><span className={Style.emoji} aria-hidden="true">📚</span>Bachelor’s and Master’s Thesis Supervision</h3>
                        <p>Since {supervision.theses.since}, I have supervised or co-supervised <strong>{supervision.theses.count} bachelor’s and master’s theses</strong> at national and international universities.</p>
                        <p>{supervision.theses.topics}</p>
                    </div>
                </div>
            } />
        </PageSection>
    );
}
