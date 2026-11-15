import React from 'react';

function SocialIcon(props) {
    const {link, icon, image, label} = props;
    return (
        <a target="_blank" aria-label={label} className="social-link"
           rel="noopener noreferrer" href={link}>
            <span className="social-symbol">{image ?
                <span className="social-image" style={{ '--social-image': `url("${image}")` }} aria-hidden="true" /> :
                <i className={icon} aria-hidden="true"/>}</span>
        </a>
    );
}

export default SocialIcon;
