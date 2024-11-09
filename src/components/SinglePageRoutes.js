import Home from "./home/Home";
import About from "./about/About";
import Portfolio from "./portfolio/Portfolio";
import Publications from "./publications/Publications";
import React from 'react';
import { Box } from "@mui/material";
import styles from './SinglePageRoutes.module.scss'; // Importa il file SCSS

// export default function SinglePageRoutes({refs}) {
//     return (<Box mt={'3rem'}>
//         <Home innerRef={refs.refHome}/>
//         <About innerRef={refs.refAbout}/>
//         <Portfolio innerRef={refs.refPortfolio}/>
//     </Box>)
// }
export default function SinglePageRoutes({ refs }) {
    return (
        <Box mt={'3rem'}>
            <Home innerRef={refs.refHome}/>
            <div className={styles.pageDivider}>
                <span>About Me</span>
            </div>
            <About innerRef={refs.refAbout}/>
            {/*<div className={styles.pageDivider}>*/}
            {/*    <span>Portfolio</span>*/}
            {/*</div>*/}
            {/*<Portfolio innerRef={refs.refPortfolio}/>*/}
            <div className={styles.pageDivider}>
                <span>Publications</span>
            </div>
            <Publications innerRef={refs.refPublications}/>
        </Box>
    );
}