import React from 'react';
import Terminal from './Terminal';
import PageSection from '../PageSection';
import about from '../../info/about.json';
import Style from './About.module.scss';

export default function About({ innerRef }) {
    return (
        <PageSection id="about" title="About Me" innerRef={innerRef}>
            <Terminal text={
                <div className={Style.content}>
                    <p className={Style.intro}><span className={Style.emoji} aria-hidden="true">👋</span>{about.intro}</p>
                    <div className={Style.research}>
                        <h3 className={Style.heading}><span className={Style.emoji} aria-hidden="true">🧠</span>Research</h3>
                        <p>{about.research}</p>
                        <div className={Style.areas}>
                            {about.areas.map(area => (
                                <div key={area.id} className={Style.area}>
                                    <h4 className={Style.areaHeading}><span className={Style.emoji} aria-hidden="true">{area.emoji}</span>{area.title}</h4>
                                    <p>{area.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={Style.background}>
                        <h3 className={Style.heading}><span className={Style.emoji} aria-hidden="true">🎓</span>Background</h3>
                        <p>{about.background}</p>
                    </div>
                </div>
            } />
        </PageSection>
    );
}
