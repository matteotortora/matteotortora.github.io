import React, { useEffect, useRef, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { info, singlePage } from '../info/Info';
import Style from './Navbar.module.scss';
import ThemeToggle from './ThemeToggle';

const links = [
    { name: 'Home', id: 'home', path: '' },
    { name: 'News', id: 'news', path: 'news' },
    { name: 'About Me', id: 'about', path: 'about' },
    { name: 'Supervision', id: 'supervision', path: 'supervision' },
    { name: 'Academic Service', id: 'services', path: 'services' },
    { name: 'Teaching', id: 'teaching', path: 'teaching' },
    { name: 'Publications', id: 'publications', path: 'publications' },
];

function scrollToSection(element) {
    element.focus({ preventScroll: true });
    element.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
    });
}

export default function Navbar({ darkMode, onToggleTheme, active, setActive }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const header = useRef(null);
    const toggle = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        function closeOutside(event) {
            if (!header.current?.contains(event.target)) setMenuOpen(false);
        }
        function closeOnEscape(event) {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                toggle.current?.focus();
            }
        }
        document.addEventListener('pointerdown', closeOutside);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOutside);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [menuOpen]);

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 60rem)');
        function closeOnDesktop(event) {
            if (event.matches) setMenuOpen(false);
        }
        desktop.addEventListener('change', closeOnDesktop);
        return () => desktop.removeEventListener('change', closeOnDesktop);
    }, []);

    function select(id) {
        setActive(id);
        setMenuOpen(false);
    }

    return (
        <header ref={header}
                className={`${Style.navbar} ${singlePage ? Style.fixed : ''}`}
                onBlur={event => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
                }}>
            <nav className={Style.bar} aria-label="Main navigation">
                <Link className={`${Style.brand} ${Style.mobileBrand}`} to={singlePage ? '#home' : '/'}
                      aria-label={`${info.firstName} ${info.lastName}, home`}
                      scroll={scrollToSection} onClick={() => select('home')}>
                    {info.initials}
                </Link>
                <button ref={toggle} type="button" className={Style.menuToggle}
                        aria-expanded={menuOpen} aria-controls="navigation-links"
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        onClick={() => setMenuOpen(open => !open)}>
                    <span>{menuOpen ? 'Close' : 'Menu'}</span>
                    <span className={Style.menuIcon} aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
                </button>
                <div id="navigation-links" className={`${Style.links} ${menuOpen ? Style.open : ''}`}>
                    {links.map((link, index) => (
                        <React.Fragment key={link.id}>
                            {index === 4 && (
                                <Link className={`${Style.brand} ${Style.desktopBrand}`}
                                      to={singlePage ? '#home' : '/'}
                                      aria-label={`${info.firstName} ${info.lastName}, home`}
                                      scroll={scrollToSection} onClick={() => select('home')}>
                                    {info.initials}
                                </Link>
                            )}
                                <Link to={singlePage ? `#${link.id}` : `/${link.path}`}
                                      className={Style.link}
                                      aria-current={active === link.id ? (singlePage ? 'location' : 'page') : undefined}
                                      scroll={scrollToSection} onClick={() => select(link.id)}>
                                    {link.name}
                                </Link>
                        </React.Fragment>
                    ))}
                </div>
                <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} className={Style.themeControl} />
            </nav>
        </header>
    );
}
