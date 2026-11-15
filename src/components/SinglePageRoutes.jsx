import React from 'react';
import Home from './home/Home';
import About from './about/About';
import Teaching from './teaching/Teaching';
import Services from './services/Services';
import Publications from './publications/Publications';
import News from './news/News';
import Supervision from './supervision/Supervision';

export default function SinglePageRoutes({ refs }) {
    return (
        <>
            <Home innerRef={refs.refHome} />
            <News innerRef={refs.refNews} />
            <About innerRef={refs.refAbout} />
            <Supervision innerRef={refs.refSupervision} />
            <Services innerRef={refs.refServices} />
            <Teaching innerRef={refs.refTeaching} />
            <Publications innerRef={refs.refPublications} />
        </>
    );
}
