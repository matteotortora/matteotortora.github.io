import React, { useEffect, useRef, useState } from 'react';
import Style from './BaseLayout.module.scss'
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import MultiPageRoutes from './MultiPageRoutes';
import { singlePage } from '../info/Info';
import site from '../info/site.json';
import SinglePageRoutes from './SinglePageRoutes';
import useScrollObserver from '../hooks/useScrollObserver';
import { initializeTheme, applyTheme, saveTheme } from '../theme.mjs';
import NightSkyBoundary from './background/NightSkyBoundary';

export default function BaseLayout() {
   const location = useLocation()

   const [active, setActive] = useState(location.hash.slice(1) || (location.pathname === '/' ? 'home' : location.pathname.slice(1)));
   const initialHash = useRef(location.hash);
   const refHome = useScrollObserver(setActive);
   const refNews = useScrollObserver(setActive);
   const refAbout = useScrollObserver(setActive);
   const refSupervision = useScrollObserver(setActive);
   const refTeaching = useScrollObserver(setActive);
   const refServices = useScrollObserver(setActive);
   const refPublications = useScrollObserver(setActive);
   const [darkMode, setDarkMode] = useState(() => initializeTheme() === 'dark');

   useEffect(() => { applyTheme(darkMode ? 'dark' : 'light'); }, [darkMode]);

   function toggleTheme() {
      const next = !darkMode;
      applyTheme(next ? 'dark' : 'light');
      saveTheme(next ? 'dark' : 'light');
      setDarkMode(next);
   }

   useEffect(() => {
      if (!singlePage || !initialHash.current) return;
      const frame = requestAnimationFrame(() => {
         const section = document.getElementById(initialHash.current.slice(1));
         if (section) {
            section.scrollIntoView({ behavior: 'instant', block: 'start' });
            section.focus({ preventScroll: true });
         }
      });
      return () => cancelAnimationFrame(frame);
   }, []);

   return (
      <Box className={Style.layout}>
         <a className="skip-link" href="#main-content">Skip to content</a>
         {darkMode && <NightSkyBoundary />}
         <Grid container className={Style.content} display={'flex'} flexDirection={'column'} minHeight={'100vh'}
            justifyContent={'space-between'}>
            <Grid item>
               <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} active={active} setActive={setActive} />
            </Grid>
            <Grid item component="main" id="main-content" tabIndex={-1} flexGrow={1}
                  sx={{ minWidth: 0, paddingTop: singlePage ? 'var(--navigation-height)' : 0 }}>
               {singlePage ? <SinglePageRoutes refs={{refHome, refNews, refAbout, refSupervision, refTeaching, refServices, refPublications}}/> : <MultiPageRoutes />}
            </Grid>
            <Grid item>
               <Box component={'footer'} display={'flex'} flexDirection={'column'} alignItems={'center'}
                  py={'1.5rem'} sx={{ opacity: 0.7 }} width={'100%'}>
                  <p>&copy; {new Date().getFullYear()} {site.name}</p>
               </Box>
            </Grid>
         </Grid>
      </Box>
   )
}
