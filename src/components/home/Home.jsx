import React from 'react';
import Style from './Home.module.scss';
import portrait320 from '../../img/portrait/matteo-tortora-320.webp';
import portrait640 from '../../img/portrait/matteo-tortora-640.webp';
import portrait960 from '../../img/portrait/matteo-tortora-960.webp';
import classNames from 'classnames';
import EmojiBullet from './EmojiBullet';
import SocialIcon from './SocialIcon';
import { Box } from '@mui/material';
import { info } from '../../info/Info';

export default function Home({ innerRef }) {
    return (
        <section ref={innerRef} id="home" tabIndex={-1} aria-labelledby="home-title" className={Style.home}>
            <img className={classNames(Style.avatar, Style.shadowed)}
                 alt={`${info.firstName} ${info.lastName}`} src={portrait640}
                 srcSet={`${portrait320} 320w, ${portrait640} 640w, ${portrait960} 960w`}
                 sizes="(min-width: 68.75rem) 328px, (min-width: 56.25rem) calc(32vw - 24px), (min-width: 27.7rem) 264px, calc(65vw - 24px)"
                 width="1084" height="1080" fetchPriority="high" decoding="async"
                 style={{ background: info.gradient }} />
            <div className={Style.profile}>
                <h1 id="home-title" className={Style.title}>
                    Hi, I'm <span style={{ background: info.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{info.firstName}</span>
                    <span className={Style.hand} aria-hidden="true">🤚</span>
                </h1>
                <p className={Style.subtitle}>I'm {info.position}</p>
                <ul className={Style.miniBio}>
                    {info.miniBio.map((bio, index) => (
                        <EmojiBullet key={index} emoji={bio.emoji} text={bio.text} link={bio.link} />
                    ))}
                </ul>
                <Box display="flex" gap="1.5rem" justifyContent={{ xs: 'center', md: 'flex-start' }} fontSize={{ xs: '2rem', md: '2.5rem' }}>
                    {info.socials.map((social, index) => (
                        <SocialIcon key={index} link={social.link} image={social.image} label={social.label} />
                    ))}
                </Box>
            </div>
            <div className={Style.backgroundSlot} data-background-slot="" aria-hidden="true"/>
        </section>
    );
}
