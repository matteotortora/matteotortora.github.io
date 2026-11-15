import React from 'react';

function SocialIcon(props) {
    const {link, image, label} = props;
    return (
        <a target="_blank" aria-label={label} className="social-link"
           rel="noopener noreferrer" href={link}>
            <span className="social-symbol">
                <span className="social-image" style={{ '--social-image': `url("${image}")` }} aria-hidden="true" />
            </span>
        </a>
    );
}

export default SocialIcon;
